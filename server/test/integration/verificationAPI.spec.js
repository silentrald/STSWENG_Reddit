require('dotenv').config();
const request = require('supertest');
const server = require('../../app');

const db = require('../../db');

const url = '/api/verification';

const dummyUser = {
    username: 'dummy-account-1234',
    password: 'Asdf1234',
    email: 'dummy@gmail.com'
};
const token = 'thistoken';

const expiredUser = {
    username: 'dummy-account-1235',
    password: 'Asdf1234',
    email: 'dummy2@gmail.com'
};

let dummyToken;

beforeAll(async () => {
    // register user
    await request(server)
        .post('/api/user/create')
        .send(dummyUser);
    
    await request(server)
        .post('/api/user/create')
        .send(expiredUser);

    // get token
    const res = await request(server)
        .post('/api/user/login')
        .send(dummyUser);
    
    dummyToken = res.body.token;
});

describe('Verification API', () => {
    describe(`POST ${url}/verify`, () => {
        beforeAll(async () => {
            // create verification dummy
            await db.query({
                text: `
                    INSERT INTO verifications(username, token)
                        VALUES ($1, $2)
                `,
                values: [
                    dummyUser.username,
                    token
                ]
            });

            // create expired link
            await db.query({
                text: `
                    INSERT INTO verifications(username, token, expires_at)
                        VALUES ($1, $2, $3);
                `,
                values: [
                    expiredUser.username,
                    token,
                    new Date(Date.now() - 6000)
                ]
            });
        });

        test('BAD Expired link', async () => {
            const {
                statusCode,
                body
            } = await request(server)
                .post(`${url}/verify`)
                .send({
                    username: expiredUser.username,
                    token
                });
            
            expect(body.error).toEqual('EXPD');
            expect(statusCode).toEqual(403);
        });

        test('BAD Invalid username', async () => {
            const {
                statusCode,
                body
            } = await request(server)
                .post(`${url}/verify`)
                .send({
                    username: 'not-the-username',
                    token
                });
            
            expect(body.error).toEqual('ILNK');
            expect(statusCode).toEqual(404);
        });

        test('BAD Invalid token', async () => {
            const {
                statusCode,
                body
            } = await request(server)
                .post(`${url}/verify`)
                .send({
                    username: dummyUser.username,
                    token: 'notthetoken'
                });
            
            expect(body.error).toEqual('ITKN');
            expect(statusCode).toEqual(403);
        });

        test('GOOD', async () => {
            const {
                statusCode,
                body
            } = await request(server)
                .post(`${url}/verify`)
                .send({
                    username: dummyUser.username,
                    token
                });
            
            expect(body.error).toEqual(undefined);
            expect(statusCode).toEqual(200);
        });
    });

    describe(`POST ${url}`, () => {
        test('BAD User already verified', async () => {
            const {
                statusCode,
                body
            } = await request(server)
                .post(url)
                .set('Authorization', `Bearer ${dummyToken}`);
            
            expect(body.error).toEqual('VRFD');
            expect(statusCode).toEqual(403);
        });
    });
});

afterAll(async () => {
    await db.query({
        text: `
            DELETE FROM verifications WHERE username=$1;
        `,
        values: [ dummyUser.username ]
    });

    await db.query({
        text: `
            DELETE FROM users WHERE username=$1;
        `,
        values: [ dummyUser.username ]
    });

    await db.query({
        text: `
            DELETE FROM verifications WHERE username=$1;
        `,
        values: [ expiredUser.username ]
    });

    await db.query({
        text: `
            DELETE FROM users WHERE username=$1;
        `,
        values: [ expiredUser.username ]
    });

    await db.end();

    await server.close();
});
