process.env.JWT_SECRET = 'test-value'; // set the jwt token

const {
    getPostVote,
    postPostVote,
} = require('../../api/postVoteAPI');

jest.mock('../../db', () => {
    /**
     * Converts a multiline queryText to a single line query
     * 
     * @param {string} queryText
     */
    const oneLineQuery = (queryText) => queryText.trim().replace(/\n/g, ' ').replace(/ {2,}/g, ' ');

    return {
        connect: jest.fn().mockImplementation(() => {
            return {
                query: jest.fn().mockImplementation((query) => {
                    let rows = [];
                    let rowCount = 0;
                    
                    if (query !== 'BEGIN' && query !== 'COMMIT' && query !== 'ROLLBACK') {
                        query.text = oneLineQuery(query.text);

                        if (query.values[0] === 'post-remove' ||
                            query.values[0] === 'post-change') {
                            if (query.text.startsWith('INSERT')){
                                throw {
                                    code: '23505',
                                    constraint: 'pk_post_votes'
                                };
                            }
                        }
                    }
                    
                    return { rows, rowCount };
                }),
                release: jest.fn()
            };
        }),
        query: jest.fn().mockImplementation((query) => {
            let rows = [];
            let rowCount = 0;

            query.text = oneLineQuery(query.text);
            if (query.values[1] === 'username') {
                if (query.values[0] === 'post-true') {
                    rows = [{
                        upvote: true
                    }];
                    rowCount = 1;
                } else if (query.values[0] === 'post-false') {
                    rows = [{
                        upvote: false
                    }];
                    rowCount = 1;
                } else if (query.values[0] === 'post-remove') {
                    rows = [{
                        upvote: true
                    }];
                    rowCount = 1;
                } else if (query.values[0] === 'post-change') {
                    rows = [{
                        upvote: false
                    }];
                    rowCount = 1;
                }
            }

            return { rows, rowCount };
        }),
        end: jest.fn(),
    };
});
const db = require('../../db');

const mockRequest = (data) => {
    return data;
};

const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    return res;
};

describe('Unit test: postVoteAPI.js', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('API: getPostVote', () => {
        test('GOOD', async () => {
            const req = mockRequest({
                params: {
                    post: 'post-true'
                },
                user: {
                    username: 'username'
                }
            });
            const res = mockResponse();

            await getPostVote(req, res);

            expect(db.query).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.send).toHaveBeenCalledTimes(1);
        });
    });

    describe('API: postPostVote', () => {
        test('GOOD', async () => {
            const req = mockRequest({
                params: {
                    post: 'post-post'
                },
                body: {
                    upvote: true
                },
                user: {
                    username: 'username'
                }
            });
            const res = mockResponse();

            await postPostVote(req, res);
            
            const { query, release } = db.connect.mock.results[0].value;

            expect(db.connect).toHaveBeenCalledTimes(1);
            expect(query).toHaveBeenCalledTimes(4);
            expect(release).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.send).toHaveBeenCalledTimes(1);
        });

        test('GOOD: Remove post vote', async () => {
            const req = mockRequest({
                params: {
                    post: 'post-remove'
                },
                body: {
                    upvote: true
                },
                user: {
                    username: 'username'
                }
            });
            const res = mockResponse();

            await postPostVote(req, res);
            
            const { query, release } = db.connect.mock.results[0].value;

            expect(db.connect).toHaveBeenCalledTimes(2);
            expect(query).toHaveBeenCalledTimes(3);
            expect(release).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.send).toHaveBeenCalledTimes(1);
        });

        test('GOOD: Remove post vote', async () => {
            const req = mockRequest({
                params: {
                    post: 'post-change'
                },
                body: {
                    upvote: true
                },
                user: {
                    username: 'username'
                }
            });
            const res = mockResponse();

            await postPostVote(req, res);
            
            const { query, release } = db.connect.mock.results[0].value;

            expect(db.connect).toHaveBeenCalledTimes(2);
            expect(query).toHaveBeenCalledTimes(3);
            expect(release).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.send).toHaveBeenCalledTimes(1);
        });
    });
});
