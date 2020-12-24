process.env.JWT_SECRET = 'test-value'; // set the jwt token

const {
    getPostSubposts
} = require('../../api/subpostAPI');

jest.mock('../../db', () => {
    /**
     * Converts a multiline queryText to a single line query
     * 
     * @param {string} queryText
     */
    // const oneLineQuery = (queryText) => queryText.trim().replace(/\n/g, ' ').replace(/ {2,}/g, ' ');

    return {
        connect: jest.fn(),
        query: jest.fn().mockImplementation(_query => {
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

describe('Unit Test: subpostAPI', () => {
    describe('API: getPostSubposts', () => {
        let params = {};
        let query = {};

        beforeEach(() => {
            params = {
                post: 'paaaaaaaaaa1'
            };
            query = {
                offset: 0,
                limit: 7
            };
        });
        
        test('GOOD', async () => {
            const req = mockRequest({
                params,
                query
            });
            const res = mockResponse();
            
            await getPostSubposts(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.send).toHaveBeenCalledWith(
                expect.objectContaining({
                    subposts: expect.any(Array)
                })
            );
        });
    });
});