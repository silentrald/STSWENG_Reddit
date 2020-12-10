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

            return result;
        }),
        end: jest.fn(),
    };
});

const mockRequest = (data) => {
    return data;
};

const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    return res;
};

const oneLineQuery = (queryText) => queryText.trim().replace(/\n/g, ' ').replace(/ {2,}/g, ' ');

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

    describe('API: postStationPost', async () => {
        let body, db, queryText;

        beforeAll(() => {
            queryText = oneLineQuery(`
                INSERT INTO posts(post_id, title, text, author, station_name) 
                    VALUES(post_id(), $1, $2, $3, $4)
            `);
        });

        beforeEach(() => {
            db = require('../../db');
            body = {
                title: 'sample-title',
                text: 'sample-text',
                author: 'sample-username',
                station_name: 'SampleStation'
            };
        });
        
        test('GOOD: Create post with correct format', async () => {
            const req = mockRequest({ body });
            const res = mockResponse();

            await postStationPost(req, res);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(db.query).toHaveBeenCalledWith(
                expect.objectContaining({
                    text: queryText,
                    values: expect.arrayContaining([
                        body.title,
                        body.text,
                        body.author,
                        body.station_name
                    ])
                })
            );
        });
    });
});