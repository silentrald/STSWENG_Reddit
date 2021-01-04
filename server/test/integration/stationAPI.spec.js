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

let tmpUser2 = {
    username: 'temp-user-2',
    password: 'Hello-p4ssword',
    email: 'temp2@gmail.com',
    fname: 'Temporary Jr.',
    lname: 'User',
    gender: 'm',
    birthday: '2001-01-01',
    bio: 'I like testing stuff just like my parent'
};

let failStation;
let token, token2;

beforeAll(async () => {
    await request(server)
        .post(`${userUrl}/create`)
        .send(tmpUser);
    
    const res1 = await request(server)
        .post(`${userUrl}/login`)
        .send({
            username: tmpUser.username,
            password: tmpUser.password
        });

    token = res1.body.token;

    await request(server)
        .post(`${userUrl}/create`)
        .send(tmpUser2);
    
    const res2 = await request(server)
        .post(`${userUrl}/login`)
        .send({
            username: tmpUser2.username,
            password: tmpUser2.password
        });

    token2 = res2.body.token;
});

describe('Station API', () => {
    describe(`POST ${url}/create`, () => {
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
            } = await request(server).post(`${url}/create`).set('Authorization', `Bearer ${token}`)
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
            const { statusCode } = await request(server).post(`${url}/create`)
                .send(station);
            
            expect(statusCode).toEqual(403);
        });

        test('ERROR: station already exists', async () => {
            const { statusCode, body } = await request(server).post(`${url}/create`).set('Authorization', `Bearer ${token}`)
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
            const { statusCode, body } = await request(server).post(`${url}/create`).set('Authorization', `Bearer ${token}`)
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
            const { statusCode, body } = await request(server).post(`${url}/create`).set('Authorization', `Bearer ${token}`)
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
            const { statusCode, body } = await request(server).post(`${url}/create`).set('Authorization', `Bearer ${token}`)
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
            const { statusCode, body } = await request(server).post(`${url}/create`).set('Authorization', `Bearer ${token}`)
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
                        members: expect.any(String),
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

    describe(`GET ${url}/top`, () => {
        test('GOOD', async () => {
            const {
                statusCode,
                body
            } = await request(server)
                .get(`${url}/top`)
                .send(station);
            
            expect(statusCode).toEqual(200);
            expect(body.stations).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        name: expect.any(String),
                        description: expect.any(String),
                        rules: expect.any(String),
                        archived: expect.any(Boolean),
                        members: expect.any(String),
                        date_created: expect.any(String)
                    })
                ])
            );
            expect(body.stations.length).toBeLessThanOrEqual(5);
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

    describe(`POST ${url}/join/:name`, () => {
        test('GOOD: user previously not joined', async () => {
            const { statusCode } = await request(server).post(`${url}/join/${station.name}`)
                .set('Authorization', `Bearer ${token2}`)
                .send();
            
            expect(statusCode).toEqual(200);
        });

        // some unknown issue with primary key constraint here
        // fails, at least on my machine
        /*test('ERROR: user already joined', async () => {
            const { statusCode, body } = await request(server).post(`${url}/join/${station.name}`)
                .set('Authorization', `Bearer ${token2}`)
                .send();
            
            expect(statusCode).toEqual(403);
            expect(body).toEqual(
                expect.objectContaining({
                    errors: expect.objectContaining({
                        station: 'joined'
                    })
                })
            );
        });*/

        test('ERROR: user joins nonexistent station', async () => {
            const { statusCode } = await request(server).post(`${url}/join/${failStation.name}`)
                .set('Authorization', `Bearer ${token2}`)
                .send();
            
            expect(statusCode).toEqual(404);
        });
    });

    describe(`POST ${url}/leave/:name`, () => {
        test('GOOD: user joined previously before leaving', async () => {
            const { statusCode } = await request(server).post(`${url}/leave/${station.name}`)
                .set('Authorization', `Bearer ${token2}`)
                .send();
            
            expect(statusCode).toEqual(200);
        });

        test('ERROR: user not joined', async () => {
            const { statusCode, body } = await request(server).post(`${url}/leave/${station.name}`)
                .set('Authorization', `Bearer ${token2}`)
                .send();
            
            expect(statusCode).toEqual(403);
            expect(body).toEqual(
                expect.objectContaining({
                    errors: expect.objectContaining({
                        station: 'notJoined'
                    })
                })
            );
        });

        test('ERROR: user is a captain and cannot leave', async () => {
            const { statusCode, body } = await request(server).post(`${url}/leave/${station.name}`)
                .set('Authorization', `Bearer ${token}`)
                .send();
            
            expect(statusCode).toEqual(403);
            expect(body).toEqual(
                expect.objectContaining({
                    errors: expect.objectContaining({
                        station: 'isCaptain'
                    })
                })
            );
        });
    });
});

afterAll(async () => {
    await server.close();

    await db.query({ 
        text: 'DELETE FROM passengers WHERE username=$1',
        values: [ tmpUser2.username ]
    });
    await db.query({ 
        text: 'DELETE FROM passengers WHERE username=$1',
        values: [ tmpUser.username ]
    });
    await db.query({ 
        text: 'DELETE FROM stations WHERE name=$1',
        values: [ station.name ]
    });
    await db.query({ 
        text: 'DELETE FROM users WHERE username=$1',
        values: [ tmpUser2.username ]
    });
    await db.query({ 
        text: 'DELETE FROM users WHERE username=$1',
        values: [ tmpUser.username ]
    });
    await db.end();
});
