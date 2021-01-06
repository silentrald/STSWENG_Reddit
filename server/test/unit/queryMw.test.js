const {
    userIsPartOfStation,
    getStationPostParams
} = require('../../middlewares/queryMw');

const mockRequest = (data) => {
    return data;
};

const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    return res;
};

const mockNext = () => {
    return jest.fn();
};

describe('Unit Testing: queryMw', () => {
    describe('Middleware: userIsPartOfStation', () => {
        let query;

        test('GOOD: body', async () => {
            query = {
                body: {
                    post: 'psample'
                }
            };
            const req = mockRequest({
                query
            });
            const res = mockResponse();
            const next = mockNext();

            await userIsPartOfStation(req, res, next);
        });

        test('GOOD: params', async () => {
            query = {
                params: {
                    post: 'psample'
                }
            };
            const req = mockRequest({
                query
            });
            const res = mockResponse();
            const next = mockNext();

            await userIsPartOfStation(req, res, next);
        });
    });

    describe('Middleware: getStationPostParams', () => {
        let query;
        beforeEach(() => {
            query = {
                params: {
                    post: 'psample'
                }
            };
        });

        test('GOOD', async () => {
            const req = mockRequest({
                query
            });
            const res = mockResponse();
            const next = mockNext();

            await getStationPostParams(req, res, next);
        });
    });
});