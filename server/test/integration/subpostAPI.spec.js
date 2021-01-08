require('dotenv').config();
const request = require('supertest');
const server = require('../../app');

const db = require('../../db');

// const userUrl = '/api/user';
const url = '/api/subpost';

// DATA
// const station = 'SampleStation';
// const station2 = 'Sample Station2';
const posts = [
    'paaaaaaaaaa1',
    'paaaaaaaaaa2',
    'paaaaaaaaaa3'
];
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
const crewmateUser = {
    username: 'crewmate',
    password: 'password'
};
// const imposterUser = {
//     username: 'imposter',
//     password: 'password'
// };
let crewmateToken;
// let startingPost;
// let failStation;

// const POST_REGEX = /^p[A-Za-z0-9]{0,11}$/;
const LIMIT = 7;

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

describe('Subpost API', () => {
    describe(`GET: ${url}/post/:post`, () => {
        let query = {};
        
        beforeEach(() => {
            query = {
                offset: 0,
                limit: LIMIT
            };
        });

        test('GOOD: Get subcomments no query', async () => {
            const { statusCode, body } = await request(server)
                .get(`${url}/post/${posts[0]}`);
            
            expect(statusCode).toEqual(200);
            expect(body.subposts).toEqual(
                expect.any(Array)
            );
        });

        test('GOOD: Get subcomments with different query', async () => {
            query.offset = 1;
            query.limit = 2;
            const { statusCode, body } = await request(server)
                .get(`${url}/post/${posts[0]}`)
                .query(query);
            
            expect(statusCode).toEqual(200);
            expect(body.subposts).toEqual(
                expect.any(Array)
            );
        });

        test('GOOD: Get subcomments as logged in', async () => {
            query.offset = 1;
            query.limit = 2;
            const { statusCode, body } = await request(server)
                .get(`${url}/post/${posts[0]}`)
                .query(query)
                .set('Authorization', `Bearer ${crewmateToken}`);
            
            expect(statusCode).toEqual(200);
            expect(body.subposts).toEqual(
                expect.any(Array)
            );
        });

        describe('GOOD: sanitize offset query', async () => {
            test('Wrong Type', async () => {
                query.offset = 'string';
                const { statusCode, body } = await request(server)
                    .get(`${url}/post/${posts[0]}`)
                    .query(query)
                    .set('Authorization', `Bearer ${crewmateToken}`);
                
                expect(statusCode).toEqual(200);
                expect(body.subposts).toEqual(
                    expect.any(Array)
                );
            });

            test('Negative Number', async () => {
                query.offset = -3;
                const { statusCode, body } = await request(server)
                    .get(`${url}/post/${posts[0]}`)
                    .query(query)
                    .set('Authorization', `Bearer ${crewmateToken}`);
                
                expect(statusCode).toEqual(200);
                expect(body.subposts).toEqual(
                    expect.any(Array)
                );
            });

            test('Float Number', async () => {
                query.offset = 2.1;
                const { statusCode, body } = await request(server)
                    .get(`${url}/post/${posts[0]}`)
                    .query(query)
                    .set('Authorization', `Bearer ${crewmateToken}`);
                
                expect(statusCode).toEqual(200);
                expect(body.subposts).toEqual(
                    expect.any(Array)
                );
            });

            test('Empty', async () => {
                delete query.offset;
                const { statusCode, body } = await request(server)
                    .get(`${url}/post/${posts[0]}`)
                    .query(query)
                    .set('Authorization', `Bearer ${crewmateToken}`);
                
                expect(statusCode).toEqual(200);
                expect(body.subposts).toEqual(
                    expect.any(Array)
                );
            });
        });

        describe('GOOD: sanitize limit query', async () => {
            test('Wrong Type', async () => {
                query.limit = 'string';
                const { statusCode, body } = await request(server)
                    .get(`${url}/post/${posts[0]}`)
                    .query(query)
                    .set('Authorization', `Bearer ${crewmateToken}`);
                
                expect(statusCode).toEqual(200);
                expect(body.subposts).toEqual(
                    expect.any(Array)
                );
            });

            test('Zero', async () => {
                query.limit = 0;
                const { statusCode, body } = await request(server)
                    .get(`${url}/post/${posts[0]}`)
                    .query(query)
                    .set('Authorization', `Bearer ${crewmateToken}`);
                
                expect(statusCode).toEqual(200);
                expect(body.subposts).toEqual(
                    expect.any(Array)
                );
            });

            test('Negative Number', async () => {
                query.limit = -3;
                const { statusCode, body } = await request(server)
                    .get(`${url}/post/${posts[0]}`)
                    .query(query)
                    .set('Authorization', `Bearer ${crewmateToken}`);
                
                expect(statusCode).toEqual(200);
                expect(body.subposts).toEqual(
                    expect.any(Array)
                );
            });

            test('Float Number', async () => {
                query.limit = 2.1;
                const { statusCode, body } = await request(server)
                    .get(`${url}/post/${posts[0]}`)
                    .query(query)
                    .set('Authorization', `Bearer ${crewmateToken}`);
                
                expect(statusCode).toEqual(200);
                expect(body.subposts).toEqual(
                    expect.any(Array)
                );
            });

            test('Empty', async () => {
                delete query.limit;
                const { statusCode, body } = await request(server)
                    .get(`${url}/post/${posts[0]}`)
                    .query(query)
                    .set('Authorization', `Bearer ${crewmateToken}`);
                
                expect(statusCode).toEqual(200);
                expect(body.subposts).toEqual(
                    expect.any(Array)
                );
            });
        });

        describe('BAD: Invalid comment params', () => {
            test('Invalid format', async () => {
                const { statusCode, body } = await request(server)
                    .get(`${url}/post/asdf`)
                    .query(query);
            
                expect(statusCode).toEqual(403);
                expect(body.errors.post).toEqual('pattern');
            });
        });
    });

    describe(`POST ${url}/post/:post`, () => {
        let body = { text: 'Test comment' };
        
        beforeEach(() => {
            body = { text: 'Test comment' };
        });
        
        test('GOOD: Comment posted', async () => {
            const { statusCode, body: data } = await request(server)
                .post(`${url}/post/${posts[0]}`)
                .set('Authorization', `Bearer ${crewmateToken}`)
                .send(body);
            
            expect(statusCode).toEqual(201);
            expect(data.comment).toEqual(
                expect.objectContaining({
                    comment_id: expect.any(String),
                    text: expect.any(String),
                    score: expect.any(Number),
                    author: expect.any(String),
                    station_name: expect.any(String),
                    timestamp_created: expect.any(String)
                })
            );
        });
        
        test('BAD: Not logged in', async () => {
            const { statusCode } = await request(server)
                .post(`${url}/post/${posts[0]}`)
                .send(body);
            
            expect(statusCode).toEqual(403);
        });
        
        test('BAD: Bad post id', async () => {
            const { statusCode, body: data } = await request(server)
                .post(`${url}/post/abcdef`)
                .set('Authorization', `Bearer ${crewmateToken}`)
                .send(body);
            
            expect(statusCode).toEqual(403);
            expect(data).toEqual(
                expect.objectContaining({
                    errors: expect.objectContaining({
                        post: 'pattern'
                    })
                })
            );
        });
        
        test('BAD: Nonexistent post', async () => {
            const { statusCode, body: data } = await request(server)
                .post(`${url}/post/pabcdefghijk`)
                .set('Authorization', `Bearer ${crewmateToken}`)
                .send(body);
            
            expect(statusCode).toEqual(403);
            expect(data).toEqual(
                expect.objectContaining({
                    errors: expect.objectContaining({
                        post: 'required'
                    })
                })
            );
        });
        
        test('BAD: Comment not provided', async () => {
            body = {};
            const { statusCode, body: data } = await request(server)
                .post(`${url}/post/${posts[0]}`)
                .set('Authorization', `Bearer ${crewmateToken}`)
                .send(body);
            
            expect(statusCode).toEqual(403);
            expect(data).toEqual(
                expect.objectContaining({
                    errors: expect.objectContaining({
                        text: 'required'
                    })
                })
            );
        });
        
        test('BAD: Comment not a string', async () => {
            body = { text: 12345 };
            const { statusCode, body: data } = await request(server)
                .post(`${url}/post/${posts[0]}`)
                .set('Authorization', `Bearer ${crewmateToken}`)
                .send(body);
            
            expect(statusCode).toEqual(403);
            expect(data).toEqual(
                expect.objectContaining({
                    errors: expect.objectContaining({
                        text: 'type'
                    })
                })
            );
        });
        
        test('BAD: Empty comment', async () => {
            body = { text: '' };
            const { statusCode, body: data } = await request(server)
                .post(`${url}/post/${posts[0]}`)
                .set('Authorization', `Bearer ${crewmateToken}`)
                .send(body);
            
            expect(statusCode).toEqual(403);
            expect(data).toEqual(
                expect.objectContaining({
                    errors: expect.objectContaining({
                        text: 'minLength'
                    })
                })
            );
        });
        
        test('BAD: Comment too long', async () => {
            let text = '';
            for (let i = 0; i < 101; i++) {
                text += 'abcdefghij';
            }    

            body = { text };
            const { statusCode, body: data } = await request(server)
                .post(`${url}/post/${posts[0]}`)
                .set('Authorization', `Bearer ${crewmateToken}`)
                .send(body);
            
            expect(statusCode).toEqual(403);
            expect(data).toEqual(
                expect.objectContaining({
                    errors: expect.objectContaining({
                        text: 'maxLength'
                    })
                })
            );
        });
    });
});

afterAll(async () => {
    await db.end();
    await server.close();
});