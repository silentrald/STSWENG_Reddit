process.env.JWT_SECRET = 'test-value'; // set the jwt token

const {
    getPosts,
    getStationPosts
} = require('../../api/postAPI');

jest.mock('../../db', () => {
    /**
     * Converts a multiline queryText to a single line query
     * 
     * @param {string} queryText
     */
    // const oneLineQuery = (queryText) => queryText.trim().replace(/\n/g, ' ').replace(/ {2,}/g, ' ');

    return {
        connect: jest.fn(),
        query: jest.fn().mockImplementation((_query) => {
            const result = {
                rows: [],
                rowCount: 0
            };

            // query.text = oneLineQuery(query.text);

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
});