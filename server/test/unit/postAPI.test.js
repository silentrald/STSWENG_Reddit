process.env.JWT_SECRET = 'test-value'; // set the jwt token

const {
    getStationPosts,
    getStationPost
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

            if (query.text === 'SELECT * FROM posts WHERE post_id=$1 AND station_name=$2 LIMIT 1;'
                && query.values[0] && query.values[1]) {
                if (query.values[0] === 'paaaaaaaaaa1') {
                    result.rows = [{
                        // sample
                    }];
                    result.rowCount = 1;
                }
            }

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
        let station = '';
        let post = '';

        beforeEach(() => {
            station = 'SampleStation';
            post = 'paaaaaaaaaa1';
        });
        
        test('GOOD', async () => {
            const req = mockRequest({
                params: { station, post }
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
                params: { station, post }
            });
            const res = mockResponse();

            await getStationPost(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.send).toHaveBeenCalledTimes(1);
        });
    });
});