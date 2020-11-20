require('dotenv').config();
const request = require('supertest');
const server = require('../app');

const db = require('../db');

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
    const { body } = await request(server).post(`${userUrl}/create`).send(tmpUser);
    token = body.token;
});

describe('Station API', () => {
    describe(`POST ${url}/new`, () => {
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
            
            expect(statusCode).toEqual(302);
        });

        test('ERROR: station already exists', async () => {
            const { statusCode } = await request(server).post(`${url}/new`).set('Authorization', `Bearer ${token}`)
                .send(station);
            
            expect(statusCode).toEqual(401);
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

        test('GOOD: return station with authorization', async () => {
            const {
                statusCode,
                body
            } = await request(server).get(`${url}/id/${station.name}`).set('Authorization', `Bearer ${token}`)
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

        test('GOOD: return station without authorization', async () => {
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

        test('ERROR: nonexistent station with auth', async () => {
            const {
                statusCode
            } = await request(server).get(`${url}/id/${failStation.name}`).set('Authorization', `Bearer ${token}`)
                .send(station);
            
            expect(statusCode).toEqual(404);
        });

        test('ERROR: nonexistent station without auth', async () => {
            const {
                statusCode
            } = await request(server).get(`${url}/id/${failStation.name}`)
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