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
const crewmateUser = {
    username: 'crewmate',
    password: 'password'
};
// const imposterUser = {
//     username: 'imposter',
//     password: 'password'
// };
let crewmateToken;
let startingPost;
let failStation;

const POST_REGEX = /^p[A-Za-z0-9]{0,11}$/;
const LIMIT = 10;

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
    describe(`GET ${url}`, () => {
        test('GOOD: without query', async () => {
            const {
                statusCode,
                body
            } = await request(server).get(`${url}`);
            
            expect(statusCode).toEqual(200);
            expect(body.posts).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        post_id: expect.stringMatching(POST_REGEX),
                        title: expect.any(String),
                        text: expect.any(String),
                        author: expect.any(String),
                        deleted: expect.any(Boolean),
                        timestamp_created: expect.any(String)
                    })
                ])
            );
            expect(body.posts.length).toEqual(LIMIT);

            startingPost = body.posts[0];
        });

        test('GOOD: without query while user is login', async () => {
            const {
                statusCode,
                body
            } = await request(server)
                .get(`${url}`)
                .set('Authorization', crewmateToken);
            
            expect(statusCode).toEqual(200);
            expect(body.posts).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        post_id: expect.stringMatching(POST_REGEX),
                        title: expect.any(String),
                        text: expect.any(String),
                        author: expect.any(String),
                        deleted: expect.any(Boolean),
                        timestamp_created: expect.any(String)
                    })
                ])
            );
            expect(body.posts.length).toEqual(LIMIT);
        });

        describe('GOOD: sanitize query offset', () => {
            test('Valid', async () => {
                const {
                    statusCode,
                    body
                } = await request(server)
                    .get(`${url}`)
                    .query({
                        offset: 2
                    });
                
                expect(statusCode).toEqual(200);
                expect(body.posts).toEqual(
                    expect.arrayContaining([
                        expect.objectContaining({
                            post_id: expect.stringMatching(POST_REGEX),
                            title: expect.any(String),
                            text: expect.any(String),
                            author: expect.any(String),
                            deleted: expect.any(Boolean),
                            timestamp_created: expect.any(String)
                        })
                    ])
                );
                expect(body.posts[0]).not.toEqual(startingPost);
                expect(body.posts.length).toEqual(LIMIT);
            });

            test('Invalid Type', async () => {
                const {
                    statusCode,
                    body
                } = await request(server)
                    .get(`${url}`)
                    .query({
                        offset: 'NotGood'
                    });
                
                expect(statusCode).toEqual(200);
                expect(body.posts).toEqual(
                    expect.arrayContaining([
                        expect.objectContaining({
                            post_id: expect.stringMatching(POST_REGEX),
                            title: expect.any(String),
                            text: expect.any(String),
                            author: expect.any(String),
                            deleted: expect.any(Boolean),
                            timestamp_created: expect.any(String)
                        })
                    ])
                );
                expect(body.posts[0]).toEqual(startingPost);
                expect(body.posts.length).toEqual(LIMIT);
            });

            test('Negative Number', async () => {
                const {
                    statusCode,
                    body
                } = await request(server)
                    .get(`${url}`)
                    .query({
                        offset: -2
                    });
                
                expect(statusCode).toEqual(200);
                expect(body.posts).toEqual(
                    expect.arrayContaining([
                        expect.objectContaining({
                            post_id: expect.stringMatching(POST_REGEX),
                            title: expect.any(String),
                            text: expect.any(String),
                            author: expect.any(String),
                            deleted: expect.any(Boolean),
                            timestamp_created: expect.any(String)
                        })
                    ])
                );
                expect(body.posts[0]).toEqual(startingPost);
                expect(body.posts.length).toEqual(LIMIT);
            });
        });

        describe('GOOD: sanitize query limit', () => {
            test('Valid', async () => {
                const {
                    statusCode,
                    body
                } = await request(server)
                    .get(`${url}`)
                    .query({
                        limit: 3
                    });
                
                expect(statusCode).toEqual(200);
                expect(body.posts).toEqual(
                    expect.arrayContaining([
                        expect.objectContaining({
                            post_id: expect.stringMatching(POST_REGEX),
                            title: expect.any(String),
                            text: expect.any(String),
                            author: expect.any(String),
                            deleted: expect.any(Boolean),
                            timestamp_created: expect.any(String)
                        })
                    ])
                );
                expect(body.posts.length).toEqual(3);
            });

            test('Invalid type', async () => {
                const {
                    statusCode,
                    body
                } = await request(server)
                    .get(`${url}`)
                    .query({
                        limit: 'NotGood'
                    });
                
                expect(statusCode).toEqual(200);
                expect(body.posts).toEqual(
                    expect.arrayContaining([
                        expect.objectContaining({
                            post_id: expect.stringMatching(POST_REGEX),
                            title: expect.any(String),
                            text: expect.any(String),
                            author: expect.any(String),
                            deleted: expect.any(Boolean),
                            timestamp_created: expect.any(String)
                        })
                    ])
                );
                expect(body.posts.length).toEqual(LIMIT);
            });

            test('Zero', async () => {
                const {
                    statusCode,
                    body
                } = await request(server)
                    .get(`${url}`)
                    .query({
                        limit: 0
                    });
                
                expect(statusCode).toEqual(200);
                expect(body.posts).toEqual(
                    expect.arrayContaining([
                        expect.objectContaining({
                            post_id: expect.stringMatching(POST_REGEX),
                            title: expect.any(String),
                            text: expect.any(String),
                            author: expect.any(String),
                            deleted: expect.any(Boolean),
                            timestamp_created: expect.any(String)
                        })
                    ])
                );
                expect(body.posts.length).toEqual(LIMIT);
            });

            test('Negative Number', async () => {
                const {
                    statusCode,
                    body
                } = await request(server)
                    .get(`${url}`)
                    .query({
                        limit: 'NotGood'
                    });
                
                expect(statusCode).toEqual(200);
                expect(body.posts).toEqual(
                    expect.arrayContaining([
                        expect.objectContaining({
                            post_id: expect.stringMatching(POST_REGEX),
                            title: expect.any(String),
                            text: expect.any(String),
                            author: expect.any(String),
                            deleted: expect.any(Boolean),
                            timestamp_created: expect.any(String)
                        })
                    ])
                );
                expect(body.posts.length).toEqual(LIMIT);
            });
        });

        describe('GOOD: sanitize query sort', () => {
            test('Valid (ASC)', async () => {
                const {
                    statusCode,
                    body
                } = await request(server)
                    .get(`${url}`)
                    .query({
                        sort: 'ASC'
                    });
                
                expect(statusCode).toEqual(200);
                expect(body.posts).toEqual(
                    expect.arrayContaining([
                        expect.objectContaining({
                            post_id: expect.stringMatching(POST_REGEX),
                            title: expect.any(String),
                            text: expect.any(String),
                            author: expect.any(String),
                            deleted: expect.any(Boolean),
                            timestamp_created: expect.any(String)
                        })
                    ])
                );
                expect(body.posts.length).toEqual(LIMIT);
            });

            test('Valid (DESC)', async () => {
                const {
                    statusCode,
                    body
                } = await request(server)
                    .get(`${url}`)
                    .query({
                        sort: 'DESC'
                    });
                
                expect(statusCode).toEqual(200);
                expect(body.posts).toEqual(
                    expect.arrayContaining([
                        expect.objectContaining({
                            post_id: expect.stringMatching(POST_REGEX),
                            title: expect.any(String),
                            text: expect.any(String),
                            author: expect.any(String),
                            deleted: expect.any(Boolean),
                            timestamp_created: expect.any(String)
                        })
                    ])
                );
                expect(body.posts.length).toEqual(LIMIT);
            });

            test('Invalid String', async () => {
                const {
                    statusCode,
                    body
                } = await request(server)
                    .get(`${url}`)
                    .query({
                        sort: 'hello'
                    });
                
                expect(statusCode).toEqual(200);
                expect(body.posts).toEqual(
                    expect.arrayContaining([
                        expect.objectContaining({
                            post_id: expect.stringMatching(POST_REGEX),
                            title: expect.any(String),
                            text: expect.any(String),
                            author: expect.any(String),
                            deleted: expect.any(Boolean),
                            timestamp_created: expect.any(String)
                        })
                    ])
                );
                expect(body.posts.length).toEqual(LIMIT);
            });

            test('Invalid type', async () => {
                const {
                    statusCode,
                    body
                } = await request(server)
                    .get(`${url}`)
                    .query({
                        sort: 0
                    });
                
                expect(statusCode).toEqual(200);
                expect(body.posts).toEqual(
                    expect.arrayContaining([
                        expect.objectContaining({
                            post_id: expect.stringMatching(POST_REGEX),
                            title: expect.any(String),
                            text: expect.any(String),
                            author: expect.any(String),
                            deleted: expect.any(Boolean),
                            timestamp_created: expect.any(String)
                        })
                    ])
                );
                expect(body.posts.length).toEqual(LIMIT);
            });
        });

        describe('GOOD: sanitize query top', () => {
            test('Valid (hour)', async () => {
                const {
                    statusCode,
                    body
                } = await request(server)
                    .get(`${url}`)
                    .query({
                        top: 'hour'
                    });
                
                expect(statusCode).toEqual(200);
                expect(body.posts).toEqual(expect.anything());
            });

            test('Valid (day)', async () => {
                const {
                    statusCode,
                    body
                } = await request(server)
                    .get(`${url}`)
                    .query({
                        top: 'day'
                    });
                
                expect(statusCode).toEqual(200);
                expect(body.posts).toEqual(expect.anything());
            });

            test('Valid (week)', async () => {
                const {
                    statusCode,
                    body
                } = await request(server)
                    .get(`${url}`)
                    .query({
                        top: 'week'
                    });
                
                expect(statusCode).toEqual(200);
                expect(body.posts).toEqual(expect.anything());
            });

            test('Valid (month)', async () => {
                const {
                    statusCode,
                    body
                } = await request(server)
                    .get(`${url}`)
                    .query({
                        top: 'month'
                    });
                
                expect(statusCode).toEqual(200);
                expect(body.posts).toEqual(expect.anything());
            });

            test('Valid (year)', async () => {
                const {
                    statusCode,
                    body
                } = await request(server)
                    .get(`${url}`)
                    .query({
                        top: 'year'
                    });
                
                expect(statusCode).toEqual(200);
                expect(body.posts).toEqual(expect.anything());
            });

            test('Valid (all)', async () => {
                const {
                    statusCode,
                    body
                } = await request(server)
                    .get(`${url}`)
                    .query({
                        top: 'all'
                    });
                
                expect(statusCode).toEqual(200);
                expect(body.posts).toEqual(expect.anything());
            });

            test('Invalid type', async () => {
                const {
                    statusCode,
                    body
                } = await request(server)
                    .get(`${url}`)
                    .query({
                        top: 1
                    });
                
                expect(statusCode).toEqual(200);
                expect(body.posts).toEqual(expect.anything());
            });

            test('Invalid String', async () => {
                const {
                    statusCode,
                    body
                } = await request(server)
                    .get(`${url}`)
                    .query({
                        top: 'notvalid'
                    });
                
                expect(statusCode).toEqual(200);
                expect(body.posts).toEqual(expect.anything());
            });
        });
    });

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
                        post_id: expect.stringMatching(POST_REGEX),
                        title: expect.any(String),
                        text: expect.any(String),
                        author: expect.any(String),
                        deleted: expect.any(Boolean),
                        timestamp_created: expect.any(String)
                    })
                ])
            );
            expect(body.posts.length).toEqual(LIMIT);

            startingPost = body.posts[0];
        });

        test('GOOD: without query while user is login', async () => {
            const {
                statusCode,
                body
            } = await request(server)
                .get(`${url}/station/${station}`)
                .set('Authorization', crewmateToken);
            
            expect(statusCode).toEqual(200);
            expect(body.posts).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        post_id: expect.stringMatching(POST_REGEX),
                        title: expect.any(String),
                        text: expect.any(String),
                        author: expect.any(String),
                        deleted: expect.any(Boolean),
                        timestamp_created: expect.any(String)
                    })
                ])
            );
            expect(body.posts.length).toEqual(LIMIT);
        });

        test('GOOD: Station does not exist', async() => {
            const {
                statusCode,
                body
            } = await request(server)
                .get(`${url}/station/NotAStation`);
            
            expect(statusCode).toEqual(200);
            expect(body.posts).toEqual([]);
        });

        describe('GOOD: sanitize query offset', () => {
            test('Valid', async () => {
                const {
                    statusCode,
                    body
                } = await request(server)
                    .get(`${url}/station/${station}`)
                    .query({
                        offset: 2
                    });
                
                expect(statusCode).toEqual(200);
                expect(body.posts).toEqual(
                    expect.arrayContaining([
                        expect.objectContaining({
                            post_id: expect.stringMatching(POST_REGEX),
                            title: expect.any(String),
                            text: expect.any(String),
                            author: expect.any(String),
                            deleted: expect.any(Boolean),
                            timestamp_created: expect.any(String)
                        })
                    ])
                );
                expect(body.posts[0]).not.toEqual(startingPost);
                expect(body.posts.length).toEqual(LIMIT);
            });

            test('Invalid Type', async () => {
                const {
                    statusCode,
                    body
                } = await request(server)
                    .get(`${url}/station/${station}`)
                    .query({
                        offset: 'NotGood'
                    });
                
                expect(statusCode).toEqual(200);
                expect(body.posts).toEqual(
                    expect.arrayContaining([
                        expect.objectContaining({
                            post_id: expect.stringMatching(POST_REGEX),
                            title: expect.any(String),
                            text: expect.any(String),
                            author: expect.any(String),
                            deleted: expect.any(Boolean),
                            timestamp_created: expect.any(String)
                        })
                    ])
                );
                expect(body.posts[0]).toEqual(startingPost);
                expect(body.posts.length).toEqual(LIMIT);
            });

            test('Negative Number', async () => {
                const {
                    statusCode,
                    body
                } = await request(server)
                    .get(`${url}/station/${station}`)
                    .query({
                        offset: -2
                    });
                
                expect(statusCode).toEqual(200);
                expect(body.posts).toEqual(
                    expect.arrayContaining([
                        expect.objectContaining({
                            post_id: expect.stringMatching(POST_REGEX),
                            title: expect.any(String),
                            text: expect.any(String),
                            author: expect.any(String),
                            deleted: expect.any(Boolean),
                            timestamp_created: expect.any(String)
                        })
                    ])
                );
                expect(body.posts[0]).toEqual(startingPost);
                expect(body.posts.length).toEqual(LIMIT);
            });
        });

        describe('GOOD: sanitize query limit', () => {
            test('Valid', async () => {
                const {
                    statusCode,
                    body
                } = await request(server)
                    .get(`${url}/station/${station}`)
                    .query({
                        limit: 3
                    });
                
                expect(statusCode).toEqual(200);
                expect(body.posts).toEqual(
                    expect.arrayContaining([
                        expect.objectContaining({
                            post_id: expect.stringMatching(POST_REGEX),
                            title: expect.any(String),
                            text: expect.any(String),
                            author: expect.any(String),
                            deleted: expect.any(Boolean),
                            timestamp_created: expect.any(String)
                        })
                    ])
                );
                expect(body.posts.length).toEqual(3);
            });

            test('Invalid type', async () => {
                const {
                    statusCode,
                    body
                } = await request(server)
                    .get(`${url}/station/${station}`)
                    .query({
                        limit: 'NotGood'
                    });
                
                expect(statusCode).toEqual(200);
                expect(body.posts).toEqual(
                    expect.arrayContaining([
                        expect.objectContaining({
                            post_id: expect.stringMatching(POST_REGEX),
                            title: expect.any(String),
                            text: expect.any(String),
                            author: expect.any(String),
                            deleted: expect.any(Boolean),
                            timestamp_created: expect.any(String)
                        })
                    ])
                );
                expect(body.posts.length).toEqual(LIMIT);
            });

            test('Zero', async () => {
                const {
                    statusCode,
                    body
                } = await request(server)
                    .get(`${url}/station/${station}`)
                    .query({
                        limit: 0
                    });
                
                expect(statusCode).toEqual(200);
                expect(body.posts).toEqual(
                    expect.arrayContaining([
                        expect.objectContaining({
                            post_id: expect.stringMatching(POST_REGEX),
                            title: expect.any(String),
                            text: expect.any(String),
                            author: expect.any(String),
                            deleted: expect.any(Boolean),
                            timestamp_created: expect.any(String)
                        })
                    ])
                );
                expect(body.posts.length).toEqual(LIMIT);
            });

            test('Negative Number', async () => {
                const {
                    statusCode,
                    body
                } = await request(server)
                    .get(`${url}/station/${station}`)
                    .query({
                        limit: 'NotGood'
                    });
                
                expect(statusCode).toEqual(200);
                expect(body.posts).toEqual(
                    expect.arrayContaining([
                        expect.objectContaining({
                            post_id: expect.stringMatching(POST_REGEX),
                            title: expect.any(String),
                            text: expect.any(String),
                            author: expect.any(String),
                            deleted: expect.any(Boolean),
                            timestamp_created: expect.any(String)
                        })
                    ])
                );
                expect(body.posts.length).toEqual(LIMIT);
            });
        });

        describe('GOOD: sanitize query sort', () => {
            test('Valid (ASC)', async () => {
                const {
                    statusCode,
                    body
                } = await request(server)
                    .get(`${url}/station/${station}`)
                    .query({
                        sort: 'ASC'
                    });
                
                expect(statusCode).toEqual(200);
                expect(body.posts).toEqual(
                    expect.arrayContaining([
                        expect.objectContaining({
                            post_id: expect.stringMatching(POST_REGEX),
                            title: expect.any(String),
                            text: expect.any(String),
                            author: expect.any(String),
                            deleted: expect.any(Boolean),
                            timestamp_created: expect.any(String)
                        })
                    ])
                );
                expect(body.posts.length).toEqual(LIMIT);
            });

            test('Valid (DESC)', async () => {
                const {
                    statusCode,
                    body
                } = await request(server)
                    .get(`${url}/station/${station}`)
                    .query({
                        sort: 'DESC'
                    });
                
                expect(statusCode).toEqual(200);
                expect(body.posts).toEqual(
                    expect.arrayContaining([
                        expect.objectContaining({
                            post_id: expect.stringMatching(POST_REGEX),
                            title: expect.any(String),
                            text: expect.any(String),
                            author: expect.any(String),
                            deleted: expect.any(Boolean),
                            timestamp_created: expect.any(String)
                        })
                    ])
                );
                expect(body.posts.length).toEqual(LIMIT);
            });

            test('Invalid String', async () => {
                const {
                    statusCode,
                    body
                } = await request(server)
                    .get(`${url}/station/${station}`)
                    .query({
                        sort: 'hello'
                    });
                
                expect(statusCode).toEqual(200);
                expect(body.posts).toEqual(
                    expect.arrayContaining([
                        expect.objectContaining({
                            post_id: expect.stringMatching(POST_REGEX),
                            title: expect.any(String),
                            text: expect.any(String),
                            author: expect.any(String),
                            deleted: expect.any(Boolean),
                            timestamp_created: expect.any(String)
                        })
                    ])
                );
                expect(body.posts.length).toEqual(LIMIT);
            });

            test('Invalid type', async () => {
                const {
                    statusCode,
                    body
                } = await request(server)
                    .get(`${url}/station/${station}`)
                    .query({
                        sort: 0
                    });
                
                expect(statusCode).toEqual(200);
                expect(body.posts).toEqual(
                    expect.arrayContaining([
                        expect.objectContaining({
                            post_id: expect.stringMatching(POST_REGEX),
                            title: expect.any(String),
                            text: expect.any(String),
                            author: expect.any(String),
                            deleted: expect.any(Boolean),
                            timestamp_created: expect.any(String)
                        })
                    ])
                );
                expect(body.posts.length).toEqual(LIMIT);
            });
        });

        describe('GOOD: sanitize query top', () => {
            test('Valid (hour)', async () => {
                const {
                    statusCode,
                    body
                } = await request(server)
                    .get(`${url}/station/${station}`)
                    .query({
                        top: 'hour'
                    });
                
                expect(statusCode).toEqual(200);
                expect(body.posts).toEqual(expect.anything());
            });

            test('Valid (day)', async () => {
                const {
                    statusCode,
                    body
                } = await request(server)
                    .get(`${url}/station/${station}`)
                    .query({
                        top: 'day'
                    });
                
                expect(statusCode).toEqual(200);
                expect(body.posts).toEqual(expect.anything());
            });

            test('Valid (week)', async () => {
                const {
                    statusCode,
                    body
                } = await request(server)
                    .get(`${url}/station/${station}`)
                    .query({
                        top: 'week'
                    });
                
                expect(statusCode).toEqual(200);
                expect(body.posts).toEqual(expect.anything());
            });

            test('Valid (month)', async () => {
                const {
                    statusCode,
                    body
                } = await request(server)
                    .get(`${url}/station/${station}`)
                    .query({
                        top: 'month'
                    });
                
                expect(statusCode).toEqual(200);
                expect(body.posts).toEqual(expect.anything());
            });

            test('Valid (year)', async () => {
                const {
                    statusCode,
                    body
                } = await request(server)
                    .get(`${url}/station/${station}`)
                    .query({
                        top: 'year'
                    });
                
                expect(statusCode).toEqual(200);
                expect(body.posts).toEqual(expect.anything());
            });

            test('Valid (all)', async () => {
                const {
                    statusCode,
                    body
                } = await request(server)
                    .get(`${url}/station/${station}`)
                    .query({
                        top: 'all'
                    });
                
                expect(statusCode).toEqual(200);
                expect(body.posts).toEqual(expect.anything());
            });

            test('Invalid type', async () => {
                const {
                    statusCode,
                    body
                } = await request(server)
                    .get(`${url}/station/${station}`)
                    .query({
                        top: 1
                    });
                
                expect(statusCode).toEqual(200);
                expect(body.posts).toEqual(expect.anything());
            });

            test('Invalid String', async () => {
                const {
                    statusCode,
                    body
                } = await request(server)
                    .get(`${url}/station/${station}`)
                    .query({
                        top: 'notvalid'
                    });
                
                expect(statusCode).toEqual(200);
                expect(body.posts).toEqual(expect.anything());
            });
        });

        describe('BAD: station params', () => {
            test('Invalid format', async() => {
                failStation = 'Hello World';

                const {
                    statusCode,
                    body
                } = await request(server)
                    .get(`${url}/station/${failStation}`);
                
                expect(statusCode).toEqual(403);
                expect(body).toEqual({
                    errors: {
                        station: 'pattern'
                    }
                });
            });
        });
    });
});

afterAll(async () => {
    await db.end();

    await server.close();
});
