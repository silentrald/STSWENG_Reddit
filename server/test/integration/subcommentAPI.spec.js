require('dotenv').config();
const request = require('supertest');
const server = require('../../app');

const db = require('../../db');

const url = '/api/subcomment';

// DATA
const station = 'SampleStation';
// const station2 = 'Sample Station2';
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
let captainToken, crewmateToken, imposterToken;

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

describe('Subcomment API', () => {
    describe(`POST: ${url}/create`, () => {
        let subcomment;

        beforeEach(() => {
            subcomment = {
                parentPost: 'paaaaaaaaaa1',
                parentComment: comments[0],
                text: 'Default Subcomment 1',
                station
            };
        });

        test('GOOD: Crewmate can subcomment on a comment', async () => {
            const { statusCode, body } = await request(server)
                .post(`${url}/create`)
                .set('Authorization', `Bearer ${crewmateToken}`)
                .send(subcomment);
            
            expect(statusCode).toEqual(201);
            expect(body).toEqual(
                expect.objectContaining({
                    comment: expect.any(String)
                })
            );
            commentsDelete.push(body.comment);
        });

        test('GOOD: Captain can subcomment on a comment', async () => {
            const { statusCode, body } = await request(server)
                .post(`${url}/create`)
                .set('Authorization', `Bearer ${captainToken}`)
                .send(subcomment);
            
            expect(statusCode).toEqual(201);
            expect(body).toEqual(
                expect.objectContaining({
                    comment: expect.any(String)
                })
            );
            commentsDelete.push(body.comment);
        });
    
        test('BAD: Parent Comment does not exist', async () => {
            subcomment.parentComment = 'csample';
            const { statusCode, body } = await request(server)
                .post(`${url}/create`)
                .set('Authorization', `Bearer ${crewmateToken}`)
                .send(subcomment);
            
            expect(statusCode).toEqual(403);
            expect(body).toEqual({ error: 'PRT_CMT_NONE' });
        });

        test('BAD: User is not a passenger of the station', async () => {
            const { statusCode, body } = await request(server)
                .post(`${url}/create`)
                .set('Authorization', `Bearer ${imposterToken}`)
                .send(subcomment);
            
            expect(statusCode).toEqual(403);
            expect(body).toEqual({ error: 'NOT_PSNGR' });
        });

        test('BAD: Parent comment is not in the station', async () => {
            subcomment.parentComment = comments[3]; // another station
            const { statusCode, body } = await request(server)
                .post(`${url}/create`)
                .set('Authorization', `Bearer ${crewmateToken}`)
                .send(subcomment);
            
            expect(statusCode).toEqual(403);
            expect(body).toEqual({ error: 'INV_PRT_CMT' });
        });

        test('BAD: Not Authenticated', async () => {
            const { statusCode } = await request(server)
                .post(`${url}/create`)
                .send(subcomment);
            
            expect(statusCode).toEqual(403);
        });

        describe('ERROR: parentComment field', () => {
            test('Wrong pattern', async () => {
                subcomment.parentComment = 'adsf';
                const { statusCode, body } = await request(server)
                    .post(`${url}/create`)
                    .set('Authorization', `Bearer ${crewmateToken}`)
                    .send(subcomment);
                
                expect(statusCode).toEqual(403);
                expect(body).toEqual({
                    errors: {
                        parentComment: 'pattern'
                    }
                });
            });

            test('Wrong type', async () => {
                subcomment.parentComment = 1;
                const { statusCode, body } = await request(server)
                    .post(`${url}/create`)
                    .set('Authorization', `Bearer ${crewmateToken}`)
                    .send(subcomment);
                
                expect(statusCode).toEqual(403);
                expect(body).toEqual({
                    errors: {
                        parentComment: 'type'
                    }
                });
            });

            test('Empty', async () => {
                subcomment.parentComment = '';
                const { statusCode, body } = await request(server)
                    .post(`${url}/create`)
                    .set('Authorization', `Bearer ${crewmateToken}`)
                    .send(subcomment);
                
                expect(statusCode).toEqual(403);
                expect(body).toEqual({
                    errors: {
                        parentComment: 'minLength'
                    }
                });
            });

            test('Too long', async () => {
                subcomment.parentComment = 'caaaaaaaaaaaa';
                const { statusCode, body } = await request(server)
                    .post(`${url}/create`)
                    .set('Authorization', `Bearer ${crewmateToken}`)
                    .send(subcomment);
                
                expect(statusCode).toEqual(403);
                expect(body).toEqual({
                    errors: {
                        parentComment: 'maxLength'
                    }
                });
            });

            test('No field', async () => {
                delete subcomment.parentComment;
                const { statusCode, body } = await request(server)
                    .post(`${url}/create`)
                    .set('Authorization', `Bearer ${crewmateToken}`)
                    .send(subcomment);
                
                expect(statusCode).toEqual(403);
                expect(body).toEqual({
                    errors: {
                        parentComment: 'required'
                    }
                });
            });
        });
    
        describe('ERROR: text field', () => {
            test('Wrong type', async () => {
                subcomment.text = 1;
                const { statusCode, body } = await request(server)
                    .post(`${url}/create`)
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
                    .post(`${url}/create`)
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
                    .post(`${url}/create`)
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
                    .post(`${url}/create`)
                    .set('Authorization', `Bearer ${crewmateToken}`)
                    .send(subcomment);
                
                const { statusCode, body } = res;

                expect(statusCode).toEqual(403);
                expect(body).toEqual({
                    errors: {
                        text: 'required'
                    }
                });
            });
        });

        describe('ERROR: station field', () => {
            test('Wrong type', async () => {
                subcomment.station = 1;
                const { statusCode, body } = await request(server)
                    .post(`${url}/create`)
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
                    .post(`${url}/create`)
                    .set('Authorization', `Bearer ${crewmateToken}`)
                    .send(subcomment);
                
                expect(statusCode).toEqual(403);
                expect(body).toEqual({
                    errors: {
                        station: 'minLength'
                    }
                });
            });

            test('Too long', async () => {
                // 65 chars
                subcomment.station = 'ccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc';
                const { statusCode, body } = await request(server)
                    .post(`${url}/create`)
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
                    .post(`${url}/create`)
                    .set('Authorization', `Bearer ${crewmateToken}`)
                    .send(subcomment);
                
                expect(statusCode).toEqual(403);
                expect(body).toEqual({
                    errors: {
                        station: 'required'
                    }
                });
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