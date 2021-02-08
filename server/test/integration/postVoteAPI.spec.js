require('dotenv').config();
const request = require('supertest');
const server = require('../../app');

const db = require('../../db');

const url = '/api/post-vote';

const crewmateUser = {
    username: 'crewmate',
    password: 'password'
};
const imposterUser = {
    username: 'imposter',
    password: 'password'
};

const noLikePosts = [
    'paaaaaaaaaa4',
    'paaaaaaaaaa5'
];

let crewmateToken, imposterToken;

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

    res = await request(server)
        .post('/api/user/login')
        .send(imposterUser);

    imposterToken = res.body.token;
});

describe('Post Vote API', () => {
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

        test('BAD: post param', async () => {
            const {
                statusCode,
                body
            } = await request(server)
                .get(`${url}/apost`)
                .set('Authorization', `Bearer ${crewmateToken}`);
            
            expect(statusCode).toEqual(403);
            expect(body.errors.post).toEqual('pattern');
        });
    });
    
    describe(`POST ${url}/:post`, () => {
        describe('GOOD: Upvote Insert, Change to Downvote, Delete', () => {
            test('GOOD: Upvote Insert', async () => {
                // INSERT
                const {
                    statusCode,
                    body
                } = await request(server)
                    .post(`${url}/${noLikePosts[0]}`)
                    .set('Authorization', `Bearer ${crewmateToken}`)
                    .send({ upvote: true });
    
                expect(statusCode).toEqual(201);
                expect(body.vote).toEqual(1);
                expect(body.inc).toEqual(1);
            });
    
            test('GOOD: Change to Downvote', async () => {
                // CHANGE
                const {
                    statusCode,
                    body
                } = await request(server)
                    .post(`${url}/${noLikePosts[0]}`)
                    .set('Authorization', `Bearer ${crewmateToken}`)
                    .send({ upvote: false });
                
                expect(statusCode).toEqual(200);
                expect(body.vote).toEqual(-1);
                expect(body.inc).toEqual(-2);
            });
    
            test('GOOD: Delete Downvote', async () => {
                // CHANGE
                const {
                    statusCode,
                    body
                } = await request(server)
                    .post(`${url}/${noLikePosts[0]}`)
                    .set('Authorization', `Bearer ${crewmateToken}`)
                    .send({ upvote: false });
                
                expect(statusCode).toEqual(200);
                expect(body.vote).toEqual(0);
                expect(body.inc).toEqual(1);
            });
        });
        
        describe('GOOD: Downvote Insert, Change to Upvote, Delete', () => {
            test('GOOD: Downvote Insert', async () => {
                // INSERT
                const {
                    statusCode,
                    body
                } = await request(server)
                    .post(`${url}/${noLikePosts[0]}`)
                    .set('Authorization', `Bearer ${crewmateToken}`)
                    .send({ upvote: false });
    
                expect(statusCode).toEqual(201);
                expect(body.vote).toEqual(-1);
                expect(body.inc).toEqual(-1);
            });
    
            test('GOOD: Change to Upvote', async () => {
                // CHANGE
                const {
                    statusCode,
                    body
                } = await request(server)
                    .post(`${url}/${noLikePosts[0]}`)
                    .set('Authorization', `Bearer ${crewmateToken}`)
                    .send({ upvote: true });
                
                expect(statusCode).toEqual(200);
                expect(body.vote).toEqual(1);
                expect(body.inc).toEqual(2);
            });
    
            test('GOOD: Delete Downvote', async () => {
                // CHANGE
                const {
                    statusCode,
                    body
                } = await request(server)
                    .post(`${url}/${noLikePosts[0]}`)
                    .set('Authorization', `Bearer ${crewmateToken}`)
                    .send({ upvote: true });
                
                expect(statusCode).toEqual(200);
                expect(body.vote).toEqual(0);
                expect(body.inc).toEqual(-1);
            });
        });

        describe('BAD: authentication', () => {
            test('BAD: No user', async () => {
                const {
                    statusCode
                } = await request(server)
                    .post(`${url}/${noLikePosts[0]}`)
                    .send({ upvote: false });
                
                expect(statusCode).toEqual(403);
            });
    
            test('BAD: User not a crewmate of the station', async () => {
                const {
                    statusCode
                } = await request(server)
                    .post(`${url}/${noLikePosts[0]}`)
                    .set('Authorization', `Bearer ${imposterToken}`)
                    .send({ upvote: false });
                
                expect(statusCode).toEqual(403);
            });
        });
        
        describe('BAD: post params', () => {
            test('Invalid format', async () => {
                const {
                    statusCode,
                    body
                } = await request(server)
                    .post(`${url}/apost`)
                    .set('Authorization', `Bearer ${crewmateToken}`)
                    .send({ upvote: false });
                
                expect(statusCode).toEqual(403);
                expect(body.errors.post).toEqual('pattern');
            });
        });
        
        describe('BAD: upvote body', () => {
            test('Empty', async () => {
                const {
                    statusCode,
                    body
                } = await request(server)
                    .post(`${url}/${noLikePosts[0]}`)
                    .set('Authorization', `Bearer ${crewmateToken}`);
                
                expect(statusCode).toEqual(403);
                expect(body.errors.upvote).toEqual('type');
            });

            test('Invalid format', async () => {
                const {
                    statusCode,
                    body
                } = await request(server)
                    .post(`${url}/${noLikePosts[0]}`)
                    .set('Authorization', `Bearer ${crewmateToken}`)
                    .send({ upvote: 100 });
                
                expect(statusCode).toEqual(403);
                expect(body.errors.upvote).toEqual('type');
            });
        });
    });
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
