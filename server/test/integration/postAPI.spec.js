require('dotenv').config();
const request = require('supertest');
const server = require('../../app');

const db = require('../../db');

// const userUrl = '/api/user';
const url = '/api/post';

// DATA
const station = 'SampleStation';
// const station2 = 'Sample Station2';
// const posts = [
//     'paaaaaaaaaa1',
//     'paaaaaaaaaa2',
//     'paaaaaaaaaa3'
// ];
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

let post;
let testPostIds = [];
let crewmateToken;
let startingPost;
let failStation, failUser;

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
            expect(statusCode).toEqual(200);
        
            startingPost = body.posts[0];
        });

        test('GOOD: without query while user is login', async () => {
            const {
                statusCode,
                body
            } = await request(server)
                .get(`${url}`)
                .set('Authorization', crewmateToken);
            
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
            expect(statusCode).toEqual(200);
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
        
        describe('GOOD: sanitize query search', () => {
            test('Valid search', async () => {
                const {
                    statusCode,
                    body
                } = await request(server)
                    .get(`${url}`)
                    .query({
                        search: 'valid'
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
                        'search[]': 'hello'
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

    describe(`GET ${url}/user/:username`, () => {
        test('GOOD: without query', async () => {
            const {
                statusCode,
                body
            } = await request(server).get(`${url}/user/${crewmateUser.username}`);
            
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

        describe('GOOD: sanitize query offset', () => {
            test('Valid', async () => {
                const {
                    statusCode,
                    body
                } = await request(server)
                    .get(`${url}/user/${crewmateUser.username}`)
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
                    .get(`${url}/user/${crewmateUser.username}`)
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
                    .get(`${url}/user/${crewmateUser.username}`)
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
                    .get(`${url}/user/${crewmateUser.username}`)
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
                    .get(`${url}/user/${crewmateUser.username}`)
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
                    .get(`${url}/user/${crewmateUser.username}`)
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
                    .get(`${url}/user/${crewmateUser.username}`)
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

        test('BAD: User does not exist', async() => {
            const {
                statusCode
            } = await request(server)
                .get(`${url}/user/NotAUser`);
            
            expect(statusCode).toEqual(404);
        });

        describe('BAD: username params', () => {
            test('Username too short', async() => {
                failUser = 'fake';

                const {
                    statusCode,
                    body
                } = await request(server)
                    .get(`${url}/user/${failUser}`);
                
                expect(statusCode).toEqual(400);
                expect(body).toEqual({
                    errors: {
                        username: 'pattern'
                    }
                });
            });

            test('Username too long', async() => {
                failUser = 'aaaa aaaa aaaa aaaa aaaa aaaa aaaa aaaa aaaa aaaa aaaa aaaa aaaa a';

                const {
                    statusCode,
                    body
                } = await request(server)
                    .get(`${url}/user/${failUser}`);
                
                expect(statusCode).toEqual(400);
                expect(body).toEqual({
                    errors: {
                        username: 'pattern'
                    }
                });
            });
        });
    });

    describe(`POST ${url}/station/:station`, () => {
        beforeEach(() => {
            post = {
                title: 'Sample Title',
                text: 'Sample Text'
            };
        });

        test('GOOD: Proper query while user is logged in', async() => {
            const { statusCode, body } = await request(server)
                .post(`${url}/station/${station}`)
                .set('Authorization', `Bearer ${crewmateToken}`)
                .send(post);

            let { postId } = body;
            testPostIds.push(postId);

            expect(statusCode).toEqual(201);
        });

        test('BAD: User is not logged in', async () => {
            const { statusCode } = await request(server)
                .post(`${url}/station/${station}`)
                .send(post);

            expect(statusCode).toEqual(403);
        });
        // TODO: test('ERROR: User is not part of station');

        describe('ERROR: Title field', () => {
            test('Title wrong type', async () => {
                post.title = 0;

                const {
                    statusCode,
                    body
                } = await request(server)
                    .post(`${url}/station/${station}`)
                    .set('Authorization', `Bearer ${crewmateToken}`)
                    .send(post);
                    
                expect(statusCode).toEqual(401);
                expect(body).toEqual(
                    expect.objectContaining({
                        errors: {
                            title: 'type'
                        }
                    })
                );
            });

            test('Empty string title', async () => {
                post.title = '';

                const {
                    statusCode,
                    body
                } = await request(server)
                    .post(`${url}/station/${station}`)
                    .set('Authorization', `Bearer ${crewmateToken}`)
                    .send(post);
                    
                expect(statusCode).toEqual(401);
                expect(body).toEqual(
                    expect.objectContaining({
                        errors: {
                            title: 'minLength'
                        }
                    })
                );
            });

            test('Title is too long', async () => {
                // 65 chars
                post.title = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';

                const {
                    statusCode,
                    body
                } = await request(server)
                    .post(`${url}/station/${station}`)
                    .set('Authorization', `Bearer ${crewmateToken}`)
                    .send(post);
                    
                expect(statusCode).toEqual(401);
                expect(body).toEqual(
                    expect.objectContaining({
                        errors: {
                            title: 'maxLength'
                        }
                    })
                );
            });

            test('No title property', async () => {
                delete post.title;

                const {
                    statusCode,
                    body
                } = await request(server)
                    .post(`${url}/station/${station}`)
                    .set('Authorization', `Bearer ${crewmateToken}`)
                    .send(post);
                    
                expect(statusCode).toEqual(401);
                expect(body).toEqual(
                    expect.objectContaining({
                        errors: {
                            title: 'required'
                        }
                    })
                );
            });
        });

        describe('ERROR: Text field', () => {
            test('Text wrong type', async () => {
                post.text = 0;

                const {
                    statusCode,
                    body
                } = await request(server)
                    .post(`${url}/station/${station}`)
                    .set('Authorization', `Bearer ${crewmateToken}`)
                    .send(post);
                    
                expect(statusCode).toEqual(401);
                expect(body).toEqual(
                    expect.objectContaining({
                        errors: {
                            text: 'type'
                        }
                    })
                );
            });

            test('Empty string text', async () => {
                post.text = '';

                const {
                    statusCode,
                    body
                } = await request(server)
                    .post(`${url}/station/${station}`)
                    .set('Authorization', `Bearer ${crewmateToken}`)
                    .send(post);
                    
                expect(statusCode).toEqual(401);
                expect(body).toEqual(
                    expect.objectContaining({
                        errors: {
                            text: 'minLength'
                        }
                    })
                );
            });

            test('Text is too long', async () => {
                post.text = `
                    According to all known laws of aviation, there is no way a bee should be 
                    able to fly. Its wings are too small to get its fat little body off the 
                    ground. The bee, of course, flies anyway because bees don't care what humans 
                    think is impossible. Yellow, black. Yellow, black. Yellow, black. Yellow, black. 
                    Ooh, black and yellow! Let's shake it up a little. Barry! Breakfast is ready! 
                    Ooming! Hang on a second. Hello? - Barry? - Adam? - Oan you believe this is 
                    happening? - I can't. I'll pick you up. Looking sharp. Use the stairs. Your father 
                    paid good money for those. Sorry. I'm excited. Here's the graduate. We're very 
                    proud of you, son. A perfect report card, all B's. Very proud. Ma! I got a thing 
                    going here. - You got lint on your fuzz. - Ow! That's me! - Wave to us! We'll be in 
                    row 118,000. - Bye! Barry, I told you, stop flying in the house! - Hey, Adam. - Hey, 
                    Barry. - Is that fuzz gel? - A little. Special day, graduation. Never thought I'd make 
                    it. Three days grade school, three days high school.
                `;

                const {
                    statusCode,
                    body
                } = await request(server)
                    .post(`${url}/station/${station}`)
                    .set('Authorization', `Bearer ${crewmateToken}`)
                    .send(post);
                    
                expect(statusCode).toEqual(401);
                expect(body).toEqual(
                    expect.objectContaining({
                        errors: {
                            text: 'maxLength'
                        }
                    })
                );
            });

            test('No text property', async () => {
                delete post.text;

                const {
                    statusCode,
                    body
                } = await request(server)
                    .post(`${url}/station/${station}`)
                    .set('Authorization', `Bearer ${crewmateToken}`)
                    .send(post);
                    
                expect(statusCode).toEqual(401);
                expect(body).toEqual(
                    expect.objectContaining({
                        errors: {
                            text: 'required'
                        }
                    })
                );
            });
        });
    });
});

afterAll(async () => {
    await db.query({
        text: 'DELETE FROM posts WHERE post_id = ANY($1)',
        values: [ testPostIds ]
    });

    await db.end();

    await server.close();
});
