require('dotenv').config();
const request = require('supertest');
const server = require('../../app');

const db = require('../../db');

const url = '/api/comment';

// DATA
const station = 'SampleStation';
// const station2 = 'Sample Station2';
const posts = [
    'paaaaaaaaaa1',
    'paaaaaaaaaa2',
    'paaaaaaaaaa3'
];
const comments = {
    0: 'caaaaaaaaaa1',
    1: 'caaaaaaaaaa2',
    2: 'caaaaaaaaaa3',
    3: 'caaaaaaaaaa4' // another station
};

const captainUser = {
    username: 'captain1',
    password: 'password'
};
// const captain2User = {
//     username: 'captain2',
//     password: 'password'
// };
const crewmateUser = {
    username: 'crewmate',
    password: 'password'
};
const imposterUser = {
    username: 'imposter',
    password: 'password'
};

let crewmateToken, captainToken, imposterToken;

const SUBPOST_LIMIT = 7;
const SUBCOMMENT_LIMIT = 3;

let commentsDelete = [];

beforeAll(async () => {
    let res = await request(server)
        .post('/api/user/login')
        .send(crewmateUser);
    
    crewmateToken = res.body.token;

    res = await request(server)
        .post('/api/user/login')
        .send(captainUser);
    
    captainToken = res.body.token;

    // res = await request(server)
    //     .post('/api/user/login')
    //     .send(captain2User);
    
    // captain2Token = res.body.token;

    res = await request(server)
        .post('/api/user/login')
        .send(imposterUser);

    imposterToken = res.body.token;
});

describe('Comment API', () => {
    // SUBPOST
    describe(`GET: ${url}/post/:post`, () => {
        let query = {};
        
        beforeEach(() => {
            query = {
                offset: 0,
                SUBPOST_LIMIT: SUBPOST_LIMIT
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
            query.SUBPOST_LIMIT = 2;
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
            query.SUBPOST_LIMIT = 2;
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

        describe('GOOD: sanitize SUBPOST_LIMIT query', async () => {
            test('Wrong Type', async () => {
                query.SUBPOST_LIMIT = 'string';
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
                query.SUBPOST_LIMIT = 0;
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
                query.SUBPOST_LIMIT = -3;
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
                query.SUBPOST_LIMIT = 2.1;
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
                delete query.SUBPOST_LIMIT;
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
            body = {
                station: 'SampleStation',
                text: 'Test comment'
            };
        });
        
        test('GOOD: Comment posted', async () => {
            const { statusCode, body: data } = await request(server)
                .post(`${url}/post/${posts[0]}`)
                .set('Authorization', `Bearer ${crewmateToken}`)
                .send(body);
            
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
            expect(statusCode).toEqual(201);
            commentsDelete.push(data.comment.comment_id);
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
            delete body.text;
            const { statusCode, body: data } = await request(server)
                .post(`${url}/post/${posts[0]}`)
                .set('Authorization', `Bearer ${crewmateToken}`)
                .send(body);
                
            expect(data).toEqual({
                errors: {
                    text: 'type'
                }
            });
            expect(statusCode).toEqual(403);
        });
        
        test('BAD: Comment not a string', async () => {
            body.text = 12345;
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
            body.text = '';
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

            body.text = text;
            const { statusCode, body: data } = await request(server)
                .post(`${url}/post/${posts[0]}`)
                .set('Authorization', `Bearer ${crewmateToken}`)
                .send(body);
            
            expect(data).toEqual({
                errors: {
                    text: 'maxLength'
                }
            });
            expect(statusCode).toEqual(403);
        });
    });

    // SUBCOMMENT
    describe(`GET: ${url}/c/:comment`, () => {
        let query = {};
        
        beforeEach(() => {
            query = {
                offset: 0,
                SUBCOMMENT_LIMIT: SUBCOMMENT_LIMIT
            };
        });

        test('GOOD: Get subcomments no query', async () => {
            const { statusCode, body } = await request(server)
                .get(`${url}/c/${comments[0]}`);
            
            expect(statusCode).toEqual(200);
            expect(body.subcomments).toEqual(
                expect.any(Array)
            );
        });

        test('GOOD: Get subcomments with different query', async () => {
            query.offset = 1;
            query.SUBCOMMENT_LIMIT = 2;
            const { statusCode, body } = await request(server)
                .get(`${url}/c/${comments[0]}`)
                .query(query);
            
            expect(statusCode).toEqual(200);
            expect(body.subcomments).toEqual(
                expect.any(Array)
            );
        });

        test('GOOD: Get subcomments as logged in', async () => {
            query.offset = 1;
            query.SUBCOMMENT_LIMIT = 2;
            const { statusCode, body } = await request(server)
                .get(`${url}/c/${comments[0]}`)
                .query(query)
                .set('Authorization', `Bearer ${crewmateToken}`);
            
            expect(statusCode).toEqual(200);
            expect(body.subcomments).toEqual(
                expect.any(Array)
            );
        });

        describe('GOOD: sanitize offset query', () => {
            test('Wrong Type', async () => {
                query.offset = 'string';
                const { statusCode, body } = await request(server)
                    .get(`${url}/c/${comments[0]}`)
                    .query(query)
                    .set('Authorization', `Bearer ${crewmateToken}`);
                
                expect(statusCode).toEqual(200);
                expect(body.subcomments).toEqual(
                    expect.any(Array)
                );
            });

            test('Negative Number', async () => {
                query.offset = -3;
                const { statusCode, body } = await request(server)
                    .get(`${url}/c/${comments[0]}`)
                    .query(query)
                    .set('Authorization', `Bearer ${crewmateToken}`);
                
                expect(statusCode).toEqual(200);
                expect(body.subcomments).toEqual(
                    expect.any(Array)
                );
            });

            test('Float Number', async () => {
                query.offset = 2.1;
                const { statusCode, body } = await request(server)
                    .get(`${url}/c/${comments[0]}`)
                    .query(query)
                    .set('Authorization', `Bearer ${crewmateToken}`);
                
                expect(statusCode).toEqual(200);
                expect(body.subcomments).toEqual(
                    expect.any(Array)
                );
            });

            test('Empty', async () => {
                delete query.offset;
                const { statusCode, body } = await request(server)
                    .get(`${url}/c/${comments[0]}`)
                    .query(query)
                    .set('Authorization', `Bearer ${crewmateToken}`);
                
                expect(statusCode).toEqual(200);
                expect(body.subcomments).toEqual(
                    expect.any(Array)
                );
            });
        });

        describe('GOOD: sanitize SUBCOMMENT_LIMIT query', async () => {
            test('Wrong Type', async () => {
                query.SUBCOMMENT_LIMIT = 'string';
                const { statusCode, body } = await request(server)
                    .get(`${url}/c/${comments[0]}`)
                    .query(query)
                    .set('Authorization', `Bearer ${crewmateToken}`);
                
                expect(statusCode).toEqual(200);
                expect(body.subcomments).toEqual(
                    expect.any(Array)
                );
            });

            test('Zero', async () => {
                query.SUBCOMMENT_LIMIT = 0;
                const { statusCode, body } = await request(server)
                    .get(`${url}/c/${comments[0]}`)
                    .query(query)
                    .set('Authorization', `Bearer ${crewmateToken}`);
                
                expect(statusCode).toEqual(200);
                expect(body.subcomments).toEqual(
                    expect.any(Array)
                );
            });

            test('Negative Number', async () => {
                query.SUBCOMMENT_LIMIT = -3;
                const { statusCode, body } = await request(server)
                    .get(`${url}/c/${comments[0]}`)
                    .query(query)
                    .set('Authorization', `Bearer ${crewmateToken}`);
                
                expect(statusCode).toEqual(200);
                expect(body.subcomments).toEqual(
                    expect.any(Array)
                );
            });

            test('Float Number', async () => {
                query.SUBCOMMENT_LIMIT = 2.1;
                const { statusCode, body } = await request(server)
                    .get(`${url}/c/${comments[0]}`)
                    .query(query)
                    .set('Authorization', `Bearer ${crewmateToken}`);
                
                expect(statusCode).toEqual(200);
                expect(body.subcomments).toEqual(
                    expect.any(Array)
                );
            });

            test('Empty', async () => {
                delete query.SUBCOMMENT_LIMIT;
                const { statusCode, body } = await request(server)
                    .get(`${url}/c/${comments[0]}`)
                    .query(query)
                    .set('Authorization', `Bearer ${crewmateToken}`);
                
                expect(statusCode).toEqual(200);
                expect(body.subcomments).toEqual(
                    expect.any(Array)
                );
            });
        });

        describe('BAD: Invalid comment params', () => {
            test('Invalid format', async () => {
                const { statusCode, body } = await request(server)
                    .get(`${url}/c/asdf`)
                    .query(query);
            
                expect(statusCode).toEqual(403);
                expect(body.errors.comment).toEqual('pattern');
            });
        });
    });

    describe(`POST: ${url}/c/:comment`, () => {
        let subcomment;

        beforeEach(() => {
            subcomment = {
                post: 'paaaaaaaaaa1',
                text: 'Default Subcomment 1',
                station
            };
        });

        test('GOOD: Crewmate can subcomment on a comment', async () => {
            const { statusCode, body } = await request(server)
                .post(`${url}/c/${comments[0]}`)
                .set('Authorization', `Bearer ${crewmateToken}`)
                .send(subcomment);
            
            expect(body.subcomment).toEqual(
                expect.objectContaining({
                    comment_id: expect.any(String),
                    text: expect.any(String),
                    score: expect.any(Number),
                    author: expect.any(String),
                    timestamp_created: expect.any(String)
                })
            );
            expect(statusCode).toEqual(201);
            commentsDelete.push(body.subcomment.comment_id);
        });

        test('GOOD: Captain can subcomment on a comment', async () => {
            const { statusCode, body } = await request(server)
                .post(`${url}/c/${comments[0]}`)
                .set('Authorization', `Bearer ${captainToken}`)
                .send(subcomment);
            
            expect(body.subcomment).toEqual(
                expect.objectContaining({
                    comment_id: expect.any(String),
                    text: expect.any(String),
                    score: expect.any(Number),
                    author: expect.any(String),
                    timestamp_created: expect.any(String)
                })
            );
            expect(statusCode).toEqual(201);
            commentsDelete.push(body.subcomment.comment_id);
        });
    
        test('BAD: Parent Comment does not exist', async () => {
            const { statusCode, body } = await request(server)
                .post(`${url}/c/csample`)
                .set('Authorization', `Bearer ${crewmateToken}`)
                .send(subcomment);
            
            expect(statusCode).toEqual(403);
            expect(body).toEqual({ error: 'PRT_CMT_NONE' });
        });

        test('BAD: User is not a passenger of the station', async () => {
            const { statusCode, body } = await request(server)
                .post(`${url}/c/${comments[0]}`)
                .set('Authorization', `Bearer ${imposterToken}`)
                .send(subcomment);
            
            expect(statusCode).toEqual(403);
            expect(body).toEqual({ error: 'not_crew' });
        });

        test('BAD: Parent comment is not in the station', async () => {
            const { statusCode, body } = await request(server)
                .post(`${url}/c/${comments[3]}`)
                .set('Authorization', `Bearer ${crewmateToken}`)
                .send(subcomment);
            
            expect(statusCode).toEqual(403);
            expect(body).toEqual({ error: 'INV_PRT_CMT' });
        });

        test('BAD: Not Authenticated', async () => {
            const { statusCode } = await request(server)
                .post(`${url}/c/${comments[0]}`)
                .send(subcomment);
            
            expect(statusCode).toEqual(403);
        });

        describe('ERROR: comment params', () => {
            test('Wrong pattern', async () => {
                const { statusCode, body } = await request(server)
                    .post(`${url}/c/asdf`)
                    .set('Authorization', `Bearer ${crewmateToken}`)
                    .send(subcomment);
                
                expect(body).toEqual({
                    errors: {
                        comment: 'pattern'
                    }
                });
                expect(statusCode).toEqual(403);
            });

            test('Too long', async () => {
                const { statusCode, body } = await request(server)
                    .post(`${url}/c/caaaaaaaaaaaa`)
                    .set('Authorization', `Bearer ${crewmateToken}`)
                    .send(subcomment);
                
                expect(body).toEqual({
                    errors: {
                        comment: 'maxLength'
                    }
                });
                expect(statusCode).toEqual(403);
            });
        });
    
        describe('ERROR: text field', () => {
            test('Wrong type', async () => {
                subcomment.text = 1;
                const { statusCode, body } = await request(server)
                    .post(`${url}/c/${comments[0]}`)
                    .set('Authorization', `Bearer ${crewmateToken}`)
                    .send(subcomment);
                
                expect(statusCode).toEqual(403);
                expect(body).toEqual({
                    errors: {
                        text: 'type'
                    }
                });
            });

            test('Empty', async () => {
                subcomment.text = '';
                const { statusCode, body } = await request(server)
                    .post(`${url}/c/${comments[0]}`)
                    .set('Authorization', `Bearer ${crewmateToken}`)
                    .send(subcomment);
                
                expect(statusCode).toEqual(403);
                expect(body).toEqual({
                    errors: {
                        text: 'minLength'
                    }
                });
            });

            test('Too long', async () => {
                // 1001 chars
                subcomment.text = 'ccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc';
                const { statusCode, body } = await request(server)
                    .post(`${url}/c/${comments[0]}`)
                    .set('Authorization', `Bearer ${crewmateToken}`)
                    .send(subcomment);
                
                expect(statusCode).toEqual(403);
                expect(body).toEqual({
                    errors: {
                        text: 'maxLength'
                    }
                });
            });

            test('No field', async () => {
                delete subcomment.text;

                const res = await request(server)
                    .post(`${url}/c/${comments[0]}`)
                    .set('Authorization', `Bearer ${crewmateToken}`)
                    .send(subcomment);
                
                const { statusCode, body } = res;

                expect(body).toEqual({
                    errors: {
                        text: 'type'
                    }
                });
                expect(statusCode).toEqual(403);
            });
        });

        describe('ERROR: station field', () => {
            test('Wrong type', async () => {
                subcomment.station = 1;
                const { statusCode, body } = await request(server)
                    .post(`${url}/c/${comments[0]}`)
                    .set('Authorization', `Bearer ${crewmateToken}`)
                    .send(subcomment);
                
                expect(statusCode).toEqual(403);
                expect(body).toEqual({
                    errors: {
                        station: 'type'
                    }
                });
            });

            test('Empty', async () => {
                subcomment.station = '';
                const { statusCode, body } = await request(server)
                    .post(`${url}/c/${comments[0]}`)
                    .set('Authorization', `Bearer ${crewmateToken}`)
                    .send(subcomment);
                
                expect(body).toEqual({
                    errors: {
                        station: 'minLength'
                    }
                });
                expect(statusCode).toEqual(403);
            });

            test('Too long', async () => {
                // 65 chars
                subcomment.station = 'ccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc';
                const { statusCode, body } = await request(server)
                    .post(`${url}/c/${comments[0]}`)
                    .set('Authorization', `Bearer ${crewmateToken}`)
                    .send(subcomment);
                
                expect(statusCode).toEqual(403);
                expect(body).toEqual({
                    errors: {
                        station: 'maxLength'
                    }
                });
            });

            test('No field', async () => {
                delete subcomment.station;
                const { statusCode, body } = await request(server)
                    .post(`${url}/c/${comments[0]}`)
                    .set('Authorization', `Bearer ${crewmateToken}`)
                    .send(subcomment);
                
                expect(body).toEqual({
                    errors: {
                        station: 'type'
                    }
                });
                expect(statusCode).toEqual(403);
            });
        });
    });

    describe(`PATCH: ${url}/:comment`, () => {
        let subcomment;

        beforeEach(() => {
            subcomment = {
                text: 'Editted Comment'
            };
        });

        test('GOOD: Author can edit a comment', async () => {
            const { statusCode, body } = await request(server)
                .patch(`${url}/${comments[0]}`)
                .set('Authorization', `Bearer ${crewmateToken}`)
                .send(subcomment);
            
            expect(body).toEqual({});
            expect(statusCode).toEqual(200);
        });

        test('BAD: Not existing comment', async () => {
            const { statusCode, body } = await request(server)
                .patch(`${url}/casdfadf`)
                .set('Authorization', `Bearer ${imposterToken}`)
                .send(subcomment);
            
            expect(body).toEqual({});
            expect(statusCode).toEqual(404);
        });

        test('BAD: Not the author', async () => {
            const { statusCode, body } = await request(server)
                .patch(`${url}/${comments[0]}`)
                .set('Authorization', `Bearer ${imposterToken}`)
                .send(subcomment);
            
            expect(body).toEqual({ errors: { author: 'NOT' } });
            expect(statusCode).toEqual(403);
        });

        test('BAD: No Auth', async () => {
            const { statusCode } = await request(server)
                .patch(`${url}/${comments[0]}`)
                .send(subcomment);
            
            expect(statusCode).toEqual(403);
        });

        test('BAD: Wrong comment pattern', async () => {
            const { statusCode, body } = await request(server)
                .patch(`${url}/not-patte`)
                .set('Authorization', `Bearer ${imposterToken}`)
                .send(subcomment);
            
            expect(body).toEqual({ errors: { comment: 'pattern' } });
            expect(statusCode).toEqual(403);
        });

        describe('BAD: text body', () => {
            test('Empty', async () => {
                subcomment.text = '';
                const { statusCode, body } = await request(server)
                    .patch(`${url}/casdfadf`)
                    .set('Authorization', `Bearer ${imposterToken}`)
                    .send(subcomment);
                
                expect(body).toEqual({
                    errors: {
                        text: 'minLength'
                    }
                });
                expect(statusCode).toEqual(403);
            });

            test('Invalid Type', async () => {
                subcomment.text = 1;
                const { statusCode, body } = await request(server)
                    .patch(`${url}/casdfadf`)
                    .set('Authorization', `Bearer ${imposterToken}`)
                    .send(subcomment);
                
                expect(body).toEqual({
                    errors: {
                        text: 'type'
                    }
                });
                expect(statusCode).toEqual(403);
            });

            test('Undefined', async () => {
                delete subcomment.text;
                const { statusCode, body } = await request(server)
                    .patch(`${url}/casdfadf`)
                    .set('Authorization', `Bearer ${imposterToken}`)
                    .send(subcomment);
                
                expect(body).toEqual({
                    errors: {
                        text: 'type'
                    }
                });
                expect(statusCode).toEqual(403);
            });

            test('Too Long', async () => {
                let text = '';
                for (let i = 0; i < 100; i++) {
                    text += 'aaaaaaaaaaa';
                }
                subcomment.text = text;
                const { statusCode, body } = await request(server)
                    .patch(`${url}/casdfadf`)
                    .set('Authorization', `Bearer ${imposterToken}`)
                    .send(subcomment);
                
                expect(body).toEqual({
                    errors: {
                        text: 'maxLength'
                    }
                });
                expect(statusCode).toEqual(403);
            });
        });
    });
});

afterAll(async () => {
    for (let i in commentsDelete) {
        const comment = commentsDelete[i];

        await db.query({
            text: `
                DELETE FROM subcomments
                WHERE       comment_id=$1;
            `,
            values: [ comment ]
        });
    
        await db.query({
            text: `
                DELETE FROM comments
                WHERE       comment_id=$1;
            `,
            values: [ comment ]
        });
    }
    await db.end();
    await server.close();
});