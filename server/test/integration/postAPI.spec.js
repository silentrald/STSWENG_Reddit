require('dotenv').config();
const request = require('supertest');
const server = require('../../app');

const db = require('../../db');

// const userUrl = '/api/user';
const url = '/api/post';

// DATA
const station = 'SampleStation';
// const station2 = 'Sample Station2';
// const comments = {
//     0: 'caaaaaaaaaa1',
//     1: 'caaaaaaaaaa2',
//     2: 'caaaaaaaaaa3',
//     3: 'caaaaaaaaaa4' // another station
// };

// const captainUser = {
//     username: 'captain1',
//     password: 'password'
// };
// const captain2User = {
//     username: 'captain2',
//     password: 'password'
// };
// const crewmateUser = {
//     username: 'crewmate',
//     password: 'password'
// };
// const imposterUser = {
//     username: 'imposter',
//     password: 'password'
// };
// let captainToken, crewmateToken, imposterToken;

// let commentsDelete = [];

beforeAll(async () => {
    // let res = await request(server)
    //     .post('/api/user/login')
    //     .send(crewmateUser);
    
    // crewmateToken = res.body.token;

    // res = await request(server)
    //     .post('/api/user/login')
    //     .send(captainUser);
    
    // captainToken = res.body.token;

    // res = await request(server)
    //     .post('/api/user/login')
    //     .send(captain2User);
    
    // captain2Token = res.body.token;

    // res = await request(server)
    //     .post('/api/user/login')
    //     .send(imposterUser);

    // imposterToken = res.body.token;
});

describe('Station API', () => {
    describe(`GET ${url}/station/:station`, () => {
        test('GOOD: without query', async () => {
            const {
                statusCode,
                body
            } = await request(server).get(`${url}/station/${station}`);
            
            expect(statusCode).toEqual(200);
            expect(body.posts).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        post_id: expect.any(String), // regex this
                        title: expect.any(String),
                        text: expect.any(String),
                        author: expect.any(String),
                        deleted: expect.any(Boolean),
                        timestamp_created: expect.any(String)
                    })
                ])
            );
        });
    });
});

afterAll(async () => {
    await db.end();

    await server.close();
});
