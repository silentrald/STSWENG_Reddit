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

let deleteVotePosts = [];

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
    
    // describe(`POST ${url}/:post`, () => {
    //     test()
    // });
});

afterAll(async () => {
    for (let index in deleteVotePosts) {
        await db.query({
            text: 'DELETE FROM post_votes WHERE post_id=$1;',
            values: [ deleteVotePosts[index] ]
        });
    }
    await db.end();

    await server.close();
});
