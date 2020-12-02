require('dotenv').config();
const request = require('supertest');
const server = require('../../app');

const db = require('../../db');

const url = '/api/post-vote';

const posts = [
    'paaaaaaaaaa1',
    'paaaaaaaaaa2',
    'paaaaaaaaaa3'
];

describe('Station API', () => {
    describe(`GET ${url}/score/:post`, () => {
        test('GOOD', async () => {
            const {
                statusCode,
                body
            } = await request(server).get(`${url}/score/${posts[0]}`);

            expect(statusCode).toEqual(200);
            expect(body.score).toEqual(expect.any(Number));
        });

        test('BAD: Invalid pattern', async () => {
            const {
                statusCode,
                body
            } = await request(server).get(`${url}/score/blahhhh`);

            expect(statusCode).toEqual(403);
            expect(body.errors).toEqual({
                post: 'pattern'
            });
        });
    });
});

afterAll(async () => {
    await db.end();

    await server.close();
});
