require('dotenv').config();
const request = require('supertest');
const server = require('../app');

const db = require('../db');

const url = '/api/user';
const JWT_REGEX = /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/;

const user = {
    username: 'test-user',
    password: 'Hello-p4ssword',
    email: 'test@gmail.com',
    fname: 'Test',
    lname: 'User',
    gender: 'm',
    birthday: '1999-12-16',
    bio: 'I like math'
};

let failUser;

describe('User API', () => {
    describe(`Route: ${url}/create`, () => {
        beforeEach(() => {
            failUser = {
                username: 'sample-user',
                password: 'Hello-p4ssword',
                email: 'sample@gmail.com',
                fname: 'Sample',
                lname: 'User',
                gender: 'f',
                birthday: '1999-12-17',
                bio: 'I like english'
            };
        });

        test('GOOD: Register', async () => {
            const { 
                statusCode,
                body
            } = await request(server).post(`${url}/create`)
                .send(user);

            expect(statusCode).toEqual(201);
            expect(body).toEqual(
                expect.objectContaining({
                    token: expect.stringMatching(JWT_REGEX)
                })
            );
        });
        
        describe('ERROR: username field', () => {
            test('Register with an existing username', async () => {
                failUser.username = user.username;
                
                const { 
                    statusCode,
                    body
                } = await request(server).post(`${url}/create`)
                    .send(failUser);
    
                expect(statusCode).toEqual(401);
                expect(body).toEqual(
                    expect.objectContaining({
                        error: `User ${user.username} is already used`
                    })
                );
            });
            
            test('Register with an invalid username format (long string)', async () => {
                failUser.username = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'; // 65 chars
    
                const { 
                    statusCode,
                    body
                } = await request(server).post(`${url}/create`)
                    .send(failUser);
    
                expect(statusCode).toEqual(401);
                expect(body).toEqual(
                    expect.objectContaining({
                        errors: expect.arrayContaining([{
                            field: 'username',
                            keyword: 'maxLength'
                        }])
                    })
                );
            });
    
            test('Register with an invalid username format (short string)', async () => {
                failUser.username = 'aaaaaaa'; // < 8 chars
    
                const {
                    statusCode,
                    body
                } = await request(server).post(`${url}/create`)
                    .send(failUser);
    
                expect(statusCode).toEqual(401);
                expect(body).toEqual(
                    expect.objectContaining({
                        errors: expect.arrayContaining([
                            expect.objectContaining({
                                field: 'username',
                                keyword: 'minLength'
                            })
                        ])
                    })
                );
            });
    
            test('Register with no username property', async () => {
                delete failUser.username;
    
                const {
                    statusCode,
                    body
                } = await request(server).post(`${url}/create`)
                    .send(failUser);
    
                expect(statusCode).toEqual(401);
                expect(body).toEqual(
                    expect.objectContaining({
                        errors: expect.arrayContaining([
                            expect.objectContaining({
                                field: 'username',
                                keyword: 'required'
                            })
                        ])
                    })
                );
            });
        });
        
        describe('ERROR: password field', () => {
            test('Register with short password', async () => {
                failUser.password = '$h0rt';

                const {
                    statusCode,
                    body
                } = await request(server).post(`${url}/create`)
                    .send(failUser);
    
                expect(statusCode).toEqual(401);
                expect(body).toEqual(
                    expect.objectContaining({
                        errors: expect.arrayContaining([
                            expect.objectContaining({
                                field: 'password',
                                keyword: 'minLength'
                            })
                        ])
                    })
                );
            });

            describe('Weak Password Check', () => {
                test('Register with only lowercase password', async () => {
                    failUser.password = 'justanormalpassword';

                    const {
                        statusCode,
                        body
                    } = await request(server).post(`${url}/create`)
                        .send(failUser);
        
                    expect(statusCode).toEqual(401);
                    expect(body).toEqual(
                        expect.objectContaining({
                            errors: expect.arrayContaining([
                                expect.objectContaining({
                                    field: 'password',
                                    keyword: 'pattern'
                                })
                            ])
                        })
                    );
                });

                test('Register with only uppercase password', async () => {
                    failUser.password = 'JUSTANORMALPASSWORD';
        
                    const {
                        statusCode,
                        body
                    } = await request(server).post(`${url}/create`)
                        .send(failUser);
        
                    expect(statusCode).toEqual(401);
                    expect(body).toEqual(
                        expect.objectContaining({
                            errors: expect.arrayContaining([
                                expect.objectContaining({
                                    field: 'password',
                                    keyword: 'pattern'
                                })
                            ])
                        })
                    );
                });

                test('Register with only numbers password', async () => {
                    failUser.password = '1234567890';
        
                    const {
                        statusCode,
                        body
                    } = await request(server).post(`${url}/create`)
                        .send(failUser);
        
                    expect(statusCode).toEqual(401);
                    expect(body).toEqual(
                        expect.objectContaining({
                            errors: expect.arrayContaining([
                                expect.objectContaining({
                                    field: 'password',
                                    keyword: 'pattern'
                                })
                            ])
                        })
                    );
                });

                test('Register with only lower and uppercase password', async () => {
                    failUser.password = 'helloPASSWORD';
        
                    const {
                        statusCode,
                        body
                    } = await request(server).post(`${url}/create`)
                        .send(failUser);
        
                    expect(statusCode).toEqual(401);
                    expect(body).toEqual(
                        expect.objectContaining({
                            errors: expect.arrayContaining([
                                expect.objectContaining({
                                    field: 'password',
                                    keyword: 'pattern'
                                })
                            ])
                        })
                    );
                });

                test('Register with only lowercase and numbers password', async () => {
                    failUser.password = 'hello12345678';
        
                    const {
                        statusCode,
                        body
                    } = await request(server).post(`${url}/create`)
                        .send(failUser);
        
                    expect(statusCode).toEqual(401);
                    expect(body).toEqual(
                        expect.objectContaining({
                            errors: expect.arrayContaining([
                                expect.objectContaining({
                                    field: 'password',
                                    keyword: 'pattern'
                                })
                            ])
                        })
                    );
                });

                test('Register with only uppercase and numbers password', async () => {
                    failUser.password = 'HELLO12345678';
        
                    const {
                        statusCode,
                        body
                    } = await request(server).post(`${url}/create`)
                        .send(failUser);
        
                    expect(statusCode).toEqual(401);
                    expect(body).toEqual(
                        expect.objectContaining({
                            errors: expect.arrayContaining([
                                expect.objectContaining({
                                    field: 'password',
                                    keyword: 'pattern'
                                })
                            ])
                        })
                    );
                });
            });

            test('Register with no password property', async () => {
                delete failUser.password;
    
                const {
                    statusCode,
                    body
                } = await request(server).post(`${url}/create`)
                    .send(failUser);
    
                expect(statusCode).toEqual(401);
                expect(body).toEqual(
                    expect.objectContaining({
                        errors: expect.arrayContaining([
                            expect.objectContaining({
                                field: 'password',
                                keyword: 'required'
                            })
                        ])
                    })
                );
            });
        });

        describe('ERROR: email field', () => {
            test('Register with an existing email', async () => {
                failUser.email = user.email;

                const { 
                    statusCode,
                    body
                } = await request(server).post(`${url}/create`)
                    .send(failUser);
    
                expect(statusCode).toEqual(401);
                expect(body).toEqual(
                    expect.objectContaining({
                        error: `Email ${user.email} is already used`
                    })
                );
            });

            test('Register with an invalid email', async () => {
                failUser.email = 'invalidemail';

                const {
                    statusCode,
                    body
                } = await request(server).post(`${url}/create`)
                    .send(failUser);
    
                expect(statusCode).toEqual(401);
                expect(body).toEqual(
                    expect.objectContaining({
                        errors: expect.arrayContaining([
                            expect.objectContaining({
                                field: 'email',
                                keyword: 'format'
                            })
                        ])
                    })
                );
            });
        
            test('Register with a long email', async () => {
                // 256 characters
                failUser.email = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@gmail.com';

                const {
                    statusCode,
                    body
                } = await request(server).post(`${url}/create`)
                    .send(failUser);
    
                expect(statusCode).toEqual(401);
                expect(body).toEqual(
                    expect.objectContaining({
                        errors: expect.arrayContaining([
                            expect.objectContaining({
                                field: 'email',
                                keyword: 'maxLength'
                            })
                        ])
                    })
                );
            });
        });

    });
});

afterAll(async () => {
    await db.query({ 
        text: 'DELETE FROM users WHERE username=$1',
        values: [ user.username ]
    });
    await db.end();

    await server.close();
});