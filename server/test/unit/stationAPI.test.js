process.env.JWT_SECRET = 'test-value'; // set the jwt token

const {
    getStation,
    getTopStations,
    getStationCaptains,
    postCreateStation
} = require('../../api/stationAPI');

/**
 * Converts a multiline queryText to a single line query
 * 
 * @param {string} queryText
 */
const oneLineQuery = (queryText) => queryText.trim().replace(/\n/g, ' ').replace(/ {2,}/g, ' ');

const mockQuery = query => {
    const result = {
        rows: [],
        rowCount: 0
    };

    if (query.text) query.text = oneLineQuery(query.text);
    else query = { text: oneLineQuery(query) };

    console.log(query.text);

    if (query.text === 'SELECT * FROM stations WHERE name = $1 LIMIT 1;' && query.values[0] && query.values[0] === 'SampleStation') {
        result.rows = [
            {
                name: 'SampleStation',
                description: 'This is a test station',
                rules: 'There are no rules'
            }
        ];
        result.rowCount = 1;
    } else if (query.text === 'SELECT * FROM passengers WHERE username = $1 AND station_name = $2 LIMIT 1;'
                && query.values[0] && query.values[1] && query.values[0] === 'username' && query.values[1] === 'SampleStation') {
        result.rows = [
            {
                username: 'username',
                station_name: 'SampleStation',
                date_join: new Date(Date.now()).toUTCString()
            }
        ];
        result.rowCount = 1;
    } else if (query.text === 'SELECT * FROM captains WHERE station_name = $1;' && query.values[0] && query.values[0] === 'SampleStation') {
        result.rows = [
            {
                username: 'captain1',
                station_name: 'SampleStation',
                date_join: new Date(Date.now()).toUTCString()
            }
        ];
        result.rowCount = 1;
    } else if (query.text === 'INSERT INTO stations(name, description, rules) VALUES($1, $2, $3) RETURNING *;'
                && query.values[0] && typeof query.values[0] === 'string'
                && (!query.values[1] || typeof query.values[1] === 'string')
                && (!query.values[2] || typeof query.values[2] === 'string')) {
        if (query.values[0] === 'SampleStation') {
            throw { 
                code: '23505',
                constraint: 'stations_pkey'
            };
        }

        result.rows = [
            {
                name: query.values[0],
                description: query.values[1] || null,
                rules: query.values[2] || null
            }
        ];
        result.rowCount = 1;
    } else if (query.text === 'INSERT INTO captains(username, station_name) VALUES($1, $2) RETURNING *;'
                && query.values[0] && typeof query.values[0] === 'string'
                && query.values[1] && typeof query.values[1] === 'string') {
        result.rows = [
            {
                username: query.values[0],
                station_name: query.values[1],
                date_join: new Date(Date.now()).toUTCString()
            }
        ];
        result.rowCount = 1;
    } 

    return result;
};

jest.mock('../../db', () => {
    return {
        connect: jest.fn().mockImplementation(() => {
            return {
                query: mockQuery,
                release: () => {}
            };
        }),
        query: jest.fn().mockImplementation(query => mockQuery(query)),
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

describe('Unit test: stationAPI.js', () => {
    describe('API: getStation', () => {
        let stationName = '';
        let user = {};

        beforeEach(() => {
            stationName = 'SampleStation';
            user = { username: 'username' };
        });
        
        test('GOOD: user not joined', async () => {
            user.username = 'username2';
            const req = mockRequest({
                params: { stationName },
                user
            });
            const res = mockResponse();

            await getStation(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.send).toHaveBeenCalledWith({
                station: expect.objectContaining({
                    name: 'SampleStation',
                    description: 'This is a test station',
                    rules: 'There are no rules'
                }),
                joined: false
            });
        });
        
        test('GOOD: user joined', async () => {
            const req = mockRequest({
                params: { stationName },
                user
            });
            const res = mockResponse();

            await getStation(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.send).toHaveBeenCalledWith({
                station: expect.objectContaining({
                    name: 'SampleStation',
                    description: 'This is a test station',
                    rules: 'There are no rules'
                }),
                joined: true
            });
        });
        
        test('BAD: station nonexistent', async () => {
            stationName = 'SampleStation1';
            const req = mockRequest({
                params: { stationName },
                user
            });
            const res = mockResponse();

            await getStation(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.send).toHaveBeenCalledWith();
        });
    });

    describe('API: getTopStations', async () => {
        beforeEach(() => {
            jest.clearAllMocks();
        });

        test('GOOD', async () => {
            const req = mockRequest({});
            const res = mockResponse();
            
            await getTopStations(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.send).toHaveBeenCalledTimes(1);
            expect(db.query).toHaveBeenCalledTimes(1);
        });
    });

    describe('API: getStationCaptains', () => {
        let stationName = '';

        beforeEach(() => {
            stationName = 'SampleStation';
        });
        
        test('GOOD: get user captains', async () => {
            const req = mockRequest({
                params: { stationName }
            });
            const res = mockResponse();

            await getStationCaptains(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.send).toHaveBeenCalledWith({
                captains: expect.arrayContaining([
                    expect.objectContaining({
                        username: 'captain1',
                        station_name: 'SampleStation',
                        date_join: expect.any(String)
                    })
                ])
            });
        });
        
        test('BAD: station nonexistent', async () => {
            stationName = 'SampleStation1';
            const req = mockRequest({
                params: { stationName }
            });
            const res = mockResponse();

            await getStationCaptains(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.send).toHaveBeenCalledWith();
        });
    });

    describe('API: postCreateStation', () => {
        let station = {};
        let user = {};

        beforeEach(() => {
            station = {
                name: 'SampleStation1',
                description: 'Test description',
                rules: 'Yes there are no rules here'
            };
            user = { username: 'username' };
        });
        
        test('GOOD: create station', async () => {
            const req = mockRequest({
                body: { ...station },
                user
            });
            const res = mockResponse();

            await postCreateStation(req, res);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.send).toHaveBeenCalledWith({
                station:  expect.objectContaining({
                    name: 'SampleStation1',
                    description: 'Test description',
                    rules: 'Yes there are no rules here'
                })
            });
        });
        
        test('BAD: station exists already', async () => {
            station.name = 'SampleStation';
            const req = mockRequest({
                body: { ...station },
                user
            });
            const res = mockResponse();

            await postCreateStation(req, res);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.send).toHaveBeenCalledWith({
                errors: {
                    name: 'used'
                }
            });
        });
    });
});