process.env.JWT_SECRET = 'test-value'; // set the jwt token

const {
    getStationPosts,
    getPosts,
    getStationPost,
    getUserPosts,
    postStationPost
} = require('../../api/postAPI');

jest.mock('../../db', () => {
    /**
     * Converts a multiline queryText to a single line query
     * 
     * @param {string} queryText
     */
    const oneLineQuery = (queryText) => queryText.trim().replace(/\n/g, ' ').replace(/ {2,}/g, ' ');

    return {
        connect: jest.fn(),
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
});