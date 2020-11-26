require('dotenv').config();
const request = require('supertest');
const server = require('../../app');

const db = require('../../db');

const userUrl = '/api/user';
const url = '/api/station';

const station = {
    name: 'teststation',
    description: 'Random description',
    rules: 'No rules yet'
};

let tmpUser = {
    username: 'temp-user',
    password: 'Hello-p4ssword',
    email: 'temp@gmail.com',
    fname: 'Temporary',
    lname: 'User',
    gender: 'm',
    birthday: '2000-01-01',
    bio: 'I like testing stuff'
};

let failStation;
let token;

beforeAll(async () => {
    await request(server)
        .post(`${userUrl}/create`)
        .send(tmpUser);
    
    const { body } = await request(server)
        .post(`${userUrl}/login`)
        .send({
            username: tmpUser.username,
            password: tmpUser.password
        });

    token = body.token;
});

describe('Station API', () => {
    describe(`POST ${url}/new`, () => {
        beforeEach(() => {
            failStation = {
                name: 'nontest',
                description: 'Random description',
                rules: 'No rules yet'
            };
        });

        test('GOOD: create station', async () => {
            const {
                statusCode,
                body
            } = await request(server).post(`${url}/new`).set('Authorization', `Bearer ${token}`)
                .send(station);
            
            expect(statusCode).toEqual(201);
            expect(body).toEqual(
                expect.objectContaining({
                    station: expect.objectContaining({
                        name: station.name,
                        description: station.description,
                        rules: station.rules,
                        archived: false,
                        date_created: expect.any(String)
                    })
                })
            );
        });

        test('ERROR: invalid token', async () => {
            const { statusCode } = await request(server).post(`${url}/new`)
                .send(station);
            
            expect(statusCode).toEqual(403);
        });

        test('ERROR: station already exists', async () => {
            const { statusCode, body } = await request(server).post(`${url}/new`).set('Authorization', `Bearer ${token}`)
                .send(station);
            
            expect(statusCode).toEqual(401);
            expect(body).toEqual(
                expect.objectContaining({
                    errors: expect.objectContaining({
                        name: 'used'
                    })
                })
            );
        });

        test('ERROR: station name too short', async () => {
            failStation.name = 'ab';
            const { statusCode, body } = await request(server).post(`${url}/new`).set('Authorization', `Bearer ${token}`)
                .send(failStation);
            
            expect(statusCode).toEqual(401);
            expect(body).toEqual(
                expect.objectContaining({
                    errors: expect.objectContaining({
                        name: 'minLength'
                    })
                })
            );
        });

        test('ERROR: station name too long', async () => {
            failStation.name = 'abcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcde'; // 65 chars
            const { statusCode, body } = await request(server).post(`${url}/new`).set('Authorization', `Bearer ${token}`)
                .send(failStation);
            
            expect(statusCode).toEqual(401);
            expect(body).toEqual(
                expect.objectContaining({
                    errors: expect.objectContaining({
                        name: 'maxLength'
                    })
                })
            );
        });

        test('ERROR: station name too short with spaces', async () => {
            failStation.name = 'ab   '; // 2 chars w/o spaces, 5 chars with spaces, 3 minimum
            const { statusCode, body } = await request(server).post(`${url}/new`).set('Authorization', `Bearer ${token}`)
                .send(failStation);
            
            expect(statusCode).toEqual(401);
            expect(body).toEqual(
                expect.objectContaining({
                    errors: expect.objectContaining({
                        name: 'minLength'
                    })
                })
            );
        });

        test('ERROR: station name with invalid characters', async () => {
            // Valid characters are A-Z, a-z, 0-9, _, and -
            failStation.name = 'abcdef012345???';
            const { statusCode, body } = await request(server).post(`${url}/new`).set('Authorization', `Bearer ${token}`)
                .send(failStation);
            
            expect(statusCode).toEqual(401);
            expect(body).toEqual(
                expect.objectContaining({
                    errors: expect.objectContaining({
                        name: 'pattern'
                    })
                })
            );
        });
    });

    describe(`GET ${url}/id/:name`, () => {
        beforeEach(() => {
            failStation = {
                name: 'nontest',
                description: 'Random description',
                rules: 'No rules yet'
            };
        });

        test('GOOD: return station', async () => {
            const {
                statusCode,
                body
            } = await request(server).get(`${url}/id/${station.name}`)
                .send(station);
            
            expect(statusCode).toEqual(200);
            expect(body).toEqual(
                expect.objectContaining({
                    station: expect.objectContaining({
                        name: station.name,
                        description: station.description,
                        rules: station.rules,
                        archived: false,
                        date_created: expect.any(String)
                    })
                })
            );
        });

        test('ERROR: nonexistent station', async () => {
            const {
                statusCode
            } = await request(server).get(`${url}/id/${failStation.name}`)
                .send(station);
            
            expect(statusCode).toEqual(404);
        });
    });

    describe(`GET ${url}/captains/:name`, () => {
        beforeEach(() => {
            failStation = {
                name: 'nontest',
                description: 'Random description',
                rules: 'No rules yet'
            };
        });

        test('GOOD: return list of captains', async () => {
            const {
                statusCode,
                body
            } = await request(server).get(`${url}/captains/${station.name}`)
                .send(station);
            
            expect(statusCode).toEqual(200);
            expect(body).toEqual(
                expect.objectContaining({
                    captains: expect.arrayContaining([ {
                        username: tmpUser.username,
                        station_name: station.name,
                        date_join: expect.any(String)
                    } ])
                })
            );
        });

        test('ERROR: nonexistent station', async () => {
            const {
                statusCode
            } = await request(server).get(`${url}/captains/${failStation.name}`)
                .send(station);
            
            expect(statusCode).toEqual(404);
        });
    });
});

afterAll(async () => {
    await db.query({ 
        text: 'DELETE FROM captains WHERE username=$1',
        values: [ tmpUser.username ]
    });
    await db.query({ 
        text: 'DELETE FROM stations WHERE name=$1',
        values: [ station.name ]
    });
    await db.query({ 
        text: 'DELETE FROM users WHERE username=$1',
        values: [ tmpUser.username ]
    });
    await db.end();

    await server.close();
});
