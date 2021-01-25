process.env.JWT_SECRET = 'test-value'; // set the jwt token

const {
    getStationPosts,
    getPosts,
    getStationPost,
    getUserPosts,
    postStationPost,
    deleteStationPost
} = require('../../api/postAPI');

jest.mock('../../db', () => {
    /**
     * Converts a multiline queryText to a single line query
     * 
     * @param {string} queryText
     */
    const oneLineQuery = (queryText) => queryText.trim().replace(/\n/g, ' ').replace(/ {2,}/g, ' ');

    return {
        connect: jest.fn().mockImplementation(() => ({
            query: jest.fn().mockImplementation(query => {
                if (query === 'BEGIN' || query === 'COMMIT' || query === 'ROLLBACK') {
                    return;
                }

                let result = {
                    rows: [],
                    rowCount: 0
                };
    
                query.text = oneLineQuery(query.text);

                if (query.text === 'DELETE FROM comments_votes WHERE comment_id IN ( SELECT comment_id FROM subposts WHERE parent_post=$1 UNION SELECT comment_id FROM subcomments WHERE parent_post=$1 );'
                    && query.values[0] === 'paaaaaaaaaa1') {
                    result = {
                        rows: [],
                        rowCount: 0
                    };
                } else if (query.text === 'DELETE FROM comments WHERE comment_id IN ( SELECT comment_id FROM subcomments WHERE parent_post=$1 );'
                    && query.values[0] === 'paaaaaaaaaa1') {
                    result = {
                        rows: [],
                        rowCount: 0
                    };
                } else if (query.text === 'DELETE FROM comments WHERE comment_id IN ( SELECT comment_id FROM subposts WHERE parent_post=$1 );'
                    && query.values[0] === 'paaaaaaaaaa1') {
                    result = {
                        rows: [],
                        rowCount: 0
                    };
                } else if (query.text === 'DELETE FROM subcomments WHERE parent_post=$1;'
                    && query.values[0] === 'paaaaaaaaaa1') {
                    result = {
                        rows: [],
                        rowCount: 0
                    };
                } else if (query.text === 'DELETE FROM subposts WHERE parent_post=$1;'
                    && query.values[0] === 'paaaaaaaaaa1') {
                    result = {
                        rows: [],
                        rowCount: 0
                    };
                } else if (query.text === 'DELETE FROM post_votes WHERE post_id=$1;'
                    && query.values[0] === 'paaaaaaaaaa1') {
                    result = {
                        rows: [],
                        rowCount: 0
                    };
                } else if (query.text === 'DELETE FROM posts WHERE post_id=$1;'
                    && query.values[0] === 'paaaaaaaaaa1') {
                    result = {
                        rows: [],
                        rowCount: 0
                    };
                }

                        
    
                return result;
            }),
            release: jest.fn()
        })),
        query: jest.fn().mockImplementation(query => {
            const result = {
                rows: [],
                rowCount: 0
            };

            query.text = oneLineQuery(query.text);
            
            if (query.text === 'SELECT * FROM posts WHERE post_id=$1 LIMIT 1;'
                && query.values[0]) {
                if (query.values[0] === 'paaaaaaaaaa1') {
                    result.rows = [{
                        // sample
                    }];
                    result.rowCount = 1;
                }
            } else if (query.text == 'INSERT INTO posts(post_id, title, text, author, station_name) VALUES(post_id(), $1, $2, $3, $4) RETURNING post_id;' &&
                query.values[0] && query.values[1] && query.values[2] && query.values[3]) {
                result.rows[0] = {
                    post_id: 'testingidlol'
                };
                result.rowCount = 1;
            } else if (query.text == 'SELECT * FROM users WHERE username=$1 LIMIT 1' && query.values[0]) {
                result.rows[0] = {
                    username: 'crewmate'
                };
                result.rowCount = 1;
            }

            return result;
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

describe('Unit test: postAPI.js', () => {
    describe('API: getPosts', () => {
        let query = {};

        beforeEach(() => {
            query = {
                offset: 0,
                limit: 10,
                sort: 'DESC'
            };
        });
        
        test('GOOD', async () => {
            const req = mockRequest({
                query
            });
            const res = mockResponse();

            await getPosts(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.send).toHaveBeenCalledWith({
                posts: expect.arrayContaining([])
            });
        });
    });

    describe('API: getStationPosts', () => {
        let station = '';
        let query = {};

        beforeEach(() => {
            station = 'SampleStation';
            query = {
                offset: 0,
                limit: 10,
                sort: 'DESC'
            };
        });
        
        test('GOOD', async () => {
            const req = mockRequest({
                params: { station },
                query
            });
            const res = mockResponse();

            await getStationPosts(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.send).toHaveBeenCalledWith({
                posts: expect.arrayContaining([])
            });
        });
    });

    describe('API: getStationPost', () => {
        let post = '';

        beforeEach(() => {
            post = 'paaaaaaaaaa1';
        });
        
        test('GOOD', async () => {
            const req = mockRequest({
                params: { post }
            });
            const res = mockResponse();

            await getStationPost(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.send).toHaveBeenCalledWith({
                post: expect.any(Object)
            });
        });

        test('rowCount < 1', async () => {
            post = 'paaaaa';
            const req = mockRequest({
                params: { post }
            });
            const res = mockResponse();

            await getStationPost(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.send).toHaveBeenCalledTimes(1);
        });
    });

    describe('API: getUserPosts', () => {
        let username = '';
        let query = {};

        beforeEach(() => {
            username = 'crewmate';
            query = {
                offset: 0,
                limit: 10
            };
        });
        
        test('GOOD', async () => {
            const req = mockRequest({
                params: { username },
                query
            });
            const res = mockResponse();

            await getUserPosts(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.send).toHaveBeenCalledWith({
                posts: expect.arrayContaining([])
            });
        });
    });

    describe('API: postStationPost', () => {
        let body, user, params;

        beforeEach(() => {
            jest.clearAllMocks();

            body = {
                title: 'sample-title',
                text: 'sample-text',
            };
            user = {
                username: 'crewmate'
            };
            params = {
                station: 'SampleStation'
            };
        });
        
        test('GOOD: Create post with correct format', async () => {
            const req = mockRequest({ body, user, params });
            const res = mockResponse();

            await postStationPost(req, res);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(db.query).toHaveBeenCalledTimes(1);
        });
    });

    describe('API: deleteStationPost', () => {
        let params, user;
        let queries;

        beforeAll(() => {
            queries = {
                delCommentVotes: 'DELETE FROM comment_votes WHERE comment_id IN ( SELECT comment_id FROM subposts WHERE parent_post=$1 UNION SELECT comment_id FROM subcomments WHERE parent_post=$1 );',
                delSubcomments: 'DELETE FROM subcomments WHERE parent_post=$1;',
                delCommentsFromSubcomments: 'DELETE FROM comments WHERE comment_id IN ( SELECT comment_id FROM subcomments WHERE parent_post=$1 );',
                delSubposts: 'DELETE FROM subposts WHERE parent_post=$1;',
                delCommentsFromSubposts: 'DELETE FROM comments WHERE comment_id IN ( SELECT comment_id FROM subposts WHERE parent_post=$1 );',
                delPostVotes: 'DELETE FROM post_votes WHERE post_id=$1;',
                delPost: 'DELETE FROM posts WHERE post_id=$1;'
            };
        });

        beforeEach(() => {
            jest.clearAllMocks();

            params = {
                post: 'paaaaaaaaaa1'
            };

            user = {
                username: 'crewmate'
            };
        });
        
        test('GOOD: Delete post', async () => {
            const req = mockRequest({ params, user });
            const res = mockResponse();

            await deleteStationPost(req, res);

            expect(res.status).toHaveBeenCalledWith(204);

            expect(db.connect).toHaveBeenCalledTimes(1);

            const { query, release } = db.connect.mock.results[0].value;

            expect(query).toHaveBeenCalledWith('BEGIN');
            expect(query).toHaveBeenCalledWith({
                text: queries.delCommentVotes,
                values: [ params.post ]
            });
            expect(query).toHaveBeenCalledWith({
                text: queries.delCommentsFromSubcomments,
                values: [ params.post ]
            });
            expect(query).toHaveBeenCalledWith({
                text: queries.delSubcomments,
                values: [ params.post ]
            });
            expect(query).toHaveBeenCalledWith({
                text: queries.delCommentsFromSubposts,
                values: [ params.post ]
            });
            expect(query).toHaveBeenCalledWith({
                text: queries.delSubposts,
                values: [ params.post ]
            });
            expect(query).toHaveBeenCalledWith({
                text: queries.delPostVotes,
                values: [ params.post ]
            });
            expect(query).toHaveBeenCalledWith({
                text: queries.delPost,
                values: [ params.post ]
            });
            
            expect(query).toHaveBeenCalledWith('COMMIT');

            expect(release).toHaveBeenCalledTimes(1);
        });
    });
});