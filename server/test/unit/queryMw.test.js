const {
    userIsPartOfStation,
    getStationPostParams
} = require('../../middlewares/queryMw');

jest.mock('../../db', () => {
    /**
     * Converts a multiline queryText to a single line query
     * 
     * @param {string} queryText
     */
    const oneLineQuery = (queryText) => queryText.trim().replace(/\n/g, ' ').replace(/ {2,}/g, ' ');

    return {
        connect: jest.fn(),
        query: jest.fn().mockImplementation((query) => {
            let rows = [];
            let rowCount = 0;

            query.text = oneLineQuery(query.text);
            if (query.values[0] === 'username' && query.values[1] === 'station') {
                rowCount = 1;
            } else if (query.values[0] === 'post') {
                rows = [{
                    station_name: 'station'
                }];
                rowCount = 1;
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

const mockNext = () => {
    return jest.fn();
};

describe('Unit Testing: queryMw', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    
    describe('Middleware: userIsPartOfStation', () => {
        let query;

        test('GOOD: body', async () => {
            query = {
                body: {
                    station: 'station'
                },
                user: {
                    username: 'username'
                }
            };
            const req = mockRequest(query);
            const res = mockResponse();
            const next = mockNext();

            await userIsPartOfStation(req, res, next);

            expect(db.query).toHaveBeenCalledTimes(1);
            expect(next).toHaveBeenCalledTimes(1);
        });

        test('GOOD: params', async () => {
            query = {
                body: {},
                params: {
                    station: 'station'
                },
                user: {
                    username: 'username'
                }
            };
            const req = mockRequest(query);
            const res = mockResponse();
            const next = mockNext();

            await userIsPartOfStation(req, res, next);

            expect(db.query).toHaveBeenCalledTimes(1);
            expect(next).toHaveBeenCalledTimes(1);
        });
    });

    describe('Middleware: getStationPostParams', () => {
        let query;

        test('GOOD', async () => {
            query = {
                body: {},
                params: {
                    post: 'post'
                }
            };
            const req = mockRequest(query);
            const res = mockResponse();
            const next = mockNext();

            await getStationPostParams(req, res, next);

            expect(req.body.station).toEqual('station');
            expect(db.query).toHaveBeenCalledTimes(1);
            expect(next).toHaveBeenCalledTimes(1);
        });
    });
});