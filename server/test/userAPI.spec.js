require('dotenv').config();
const request = require('supertest');
const server = require('../app');

const db = require('../db');

const url = '/api/user';
const JWT_REGEX = /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/;

const user = {
    username: 'test-user',
    password: 'hello',
    email: 'test@gmail.com',
    fname: 'Test',
    lname: 'User',
    birthday: new Date('1999-12-16'),
    bio: 'I like math'
};

let failUser = {
    username: 'sample',
    password: 'hello',
    email: 'sample@gmail.com',
    fname: 'Sample',
    lname: 'User',
    birthday: new Date('1999-12-17'),
    bio: 'I like english'
};

describe('User API', () => {
    describe(`Route: ${url}/register`, () => {
        test('GOOD: Register', async () => {
            const { 
                statusCode,
                body
            } = await request(server).post(`${url}/register`)
                .send(user);

            expect(statusCode).toEqual(201);
            expect(body).toEqual(
                expect.objectContaining({
                    token: expect.stringMatching(JWT_REGEX)
                })
            );
        });
    
        test('ERROR: Register with an existing username', async () => {
            const { 
                statusCode,
                body
            } = await request(server).post(`${url}/register`)
                .send(user);

            expect(statusCode).toEqual(401);
            expect(body).toEqual(
                expect.objectContaining({
                    error: `User ${user.username} is already used`
                })
            );
        });

        test('ERROR: Register with an existing email', async () => {
            let new_user = user;
            new_user.username = 'new-user';

            const { 
                statusCode,
                body
            } = await request(server).post(`${url}/register`)
                .send(new_user);

            expect(statusCode).toEqual(401);
            expect(body).toEqual(
                expect.objectContaining({
                    error: `Email ${user.username} is already used`
                })
            );
        });

        test('ERROR: Register with an invalid username format (long string)', async () => {
            let new_user = failUser;
            new_user.username = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'; // 51 chars

            const { 
                statusCode,
                body
            } = await request(server).post(`${url}/register`)
                .send(new_user);

            expect(statusCode).toEqual(401);
            expect(body).toEqual(
                expect.objectContaining({
                    error: 'Username is too long'
                })
            );
        });
    });
});

afterAll(async () => {
    await db.query('DELETE FROM users');
    await db.end();

    await server.close();
});