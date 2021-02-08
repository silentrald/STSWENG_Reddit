process.env.JWT_SECRET = 'test-value'; // set the jwt token

const {
    getCommentVote,
    postCommentVote,
} = require('../../api/commentVoteAPI');

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

                        if (query.values[0] === 'comment-remove' ||
                            query.values[0] === 'comment-change') {
                            if (query.text.startsWith('INSERT')){
                                throw {
                                    code: '23505',
                                    constraint: 'pk_comment_votes'
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
                if (query.values[0] === 'comment-true') {
                    rows = [{
                        upvote: true
                    }];
                    rowCount = 1;
                } else if (query.values[0] === 'comment-false') {
                    rows = [{
                        upvote: false
                    }];
                    rowCount = 1;
                } else if (query.values[0] === 'comment-remove') {
                    rows = [{
                        upvote: true
                    }];
                    rowCount = 1;
                } else if (query.values[0] === 'comment-change') {
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

describe('Unit test: commentVoteAPI.js', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('API: getCommentVote', () => {
        test('GOOD', async () => {
            const req = mockRequest({
                params: {
                    comment: 'comment-true'
                },
                user: {
                    username: 'username'
                }
            });
            const res = mockResponse();

            await getCommentVote(req, res);

            expect(db.query).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.send).toHaveBeenCalledTimes(1);
        });
    });

    describe('API: postCommentVote', () => {
        test('GOOD', async () => {
            const req = mockRequest({
                params: {
                    comment: 'comment-comment'
                },
                body: {
                    upvote: true
                },
                user: {
                    username: 'username'
                }
            });
            const res = mockResponse();

            await postCommentVote(req, res);
            
            const { query, release } = db.connect.mock.results[0].value;

            expect(db.connect).toHaveBeenCalledTimes(1);
            expect(query).toHaveBeenCalledTimes(4);
            expect(release).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.send).toHaveBeenCalledTimes(1);
        });

        test('GOOD: Remove comment vote', async () => {
            const req = mockRequest({
                params: {
                    comment: 'comment-remove'
                },
                body: {
                    upvote: true
                },
                user: {
                    username: 'username'
                }
            });
            const res = mockResponse();

            await postCommentVote(req, res);
            
            const { query, release } = db.connect.mock.results[0].value;

            expect(db.connect).toHaveBeenCalledTimes(2);
            expect(query).toHaveBeenCalledTimes(3);
            expect(release).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.send).toHaveBeenCalledTimes(1);
        });

        test('GOOD: Remove comment vote', async () => {
            const req = mockRequest({
                params: {
                    comment: 'comment-change'
                },
                body: {
                    upvote: true
                },
                user: {
                    username: 'username'
                }
            });
            const res = mockResponse();

            await postCommentVote(req, res);
            
            const { query, release } = db.connect.mock.results[0].value;

            expect(db.connect).toHaveBeenCalledTimes(2);
            expect(query).toHaveBeenCalledTimes(3);
            expect(release).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.send).toHaveBeenCalledTimes(1);
        });
    });
});
