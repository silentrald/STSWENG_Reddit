process.env.JWT_SECRET = 'test-value'; // set the jwt token

const {
    getStationPosts,
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

            if (query.text == 'INSERT INTO posts(post_id, title, text, author, station_name) VALUES(post_id(), $1, $2, $3, $4) RETURNING post_id;' &&
                query.values[0] && query.values[1] && query.values[2] && query.values[3]) {
                result.rows[0] = {
                    post_id: 'testingidlol'
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