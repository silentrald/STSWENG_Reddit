require('dotenv').config();
const request = require('supertest');
const server = require('../../app');

const db = require('../../db');

const url = '/api/post-vote';

const crewmateUser = {
    username: 'crewmate',
    password: 'password'
};

const noLikePosts = [
    'paaaaaaaaaa3',
    'paaaaaaaaaa4'
];

let crewmateToken;

beforeAll(async () => {
    let res = await request(server)
        .post('/api/user/login')
        .send(crewmateUser);
    
    crewmateToken = res.body.token;

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
    describe(`GET ${url}/:post`, () => {
        test('GOOD', async () => {
            const {
                statusCode,
                // body
            } = await request(server)
                .get(`${url}/${noLikePosts[0]}`)
                .set('Authorization', `Bearer ${crewmateToken}`);
            
            expect(statusCode).toEqual(200);
            
        });
    });
    //     describe(`GET ${url}/score/:post`, () => {
    //         test('GOOD', async () => {
    //             const {
    //                 statusCode,
    //                 body
    //             } = await request(server).get(`${url}/score/${posts[0]}`);

    //             expect(statusCode).toEqual(200);
    //             expect(body.score).toEqual(expect.any(Number));
    //         });

    //         test('BAD: Invalid pattern', async () => {
    //             const {
    //                 statusCode,
    //                 body
    //             } = await request(server).get(`${url}/score/blahhhh`);

    //             expect(statusCode).toEqual(403);
    //             expect(body.errors).toEqual({
    //                 post: 'pattern'
    //             });
    //         });
    //     });
});

afterAll(async () => {
    await db.end();

    await server.close();
});
