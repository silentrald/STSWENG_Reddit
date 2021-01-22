require('dotenv').config();
const request = require('supertest');
const server = require('../../app');

const db = require('../../db');

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
let token;

describe('User API', () => {
    describe(`GET: ${url}`, () => {
        test('GOOD: no search', async () => {
            const {
                statusCode,
                // body
            } = await request(server)
                .get(url);
            
            expect(statusCode).toEqual(200);
        });

        test('GOOD: search', async () => {
            const {
                statusCode,
                // body
            } = await request(server)
                .get(url)
                .query({
                    search: 's'
                });
            
            expect(statusCode).toEqual(200);
        });

        test('GOOD: invalid search', async () => {
            const {
                statusCode,
                // body
            } = await request(server)
                .get(url)
                .query({
                    search: 'SuP3R4Nd0m'
                });
            
            expect(statusCode).toEqual(404);
        });

        test('GOOD: Invalid Type', async () => {
            const {
                statusCode
            } = await request(server)
                .get(url)
                .query({
                    'search[]': 'hello'
                });

            expect(statusCode).toEqual(200);
        });

        describe('GOOD: sanitize query offset', () => {
            test('Valid', async () => {
                const {
                    statusCode
                } = await request(server)
                    .get(`${url}`)
                    .query({
                        offset: 2
                    });
                
                expect(statusCode).toEqual(200);
            });

            test('Invalid Type', async () => {
                const {
                    statusCode
                } = await request(server)
                    .get(`${url}`)
                    .query({
                        offset: 'NotGood'
                    });
                
                expect(statusCode).toEqual(200);
            });

            test('Negative Number', async () => {
                const {
                    statusCode
                } = await request(server)
                    .get(`${url}`)
                    .query({
                        offset: -2
                    });
                
                expect(statusCode).toEqual(200);
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
                expect(body.users.length).toEqual(3);
            });

            test('Invalid type', async () => {
                const {
                    statusCode
                } = await request(server)
                    .get(`${url}`)
                    .query({
                        limit: 'NotGood'
                    });
                
                expect(statusCode).toEqual(200);
            });

            test('Zero', async () => {
                const {
                    statusCode
                } = await request(server)
                    .get(`${url}`)
                    .query({
                        limit: 0
                    });
                
                expect(statusCode).toEqual(200);
            });

            test('Negative Number', async () => {
                const {
                    statusCode
                } = await request(server)
                    .get(`${url}`)
                    .query({
                        limit: 'NotGood'
                    });
                
                expect(statusCode).toEqual(200);
            });
        });
    });

    // TODO: Integration tests for getUser
    describe(`GET: ${url}/profile/:username`, () => {
        let username = 'crewmate';

        test('GOOD: User exists', async () => {
            const res = await request(server)
                .get(`${url}/profile/${username}`);

            expect(res.statusCode).toEqual(200);
            expect(res.body).toMatchObject({
                user: expect.objectContaining({
                    username,
                    fname: expect.any(String),
                    lname: expect.any(String),
                    bio: expect.any(String),
                    fame: expect.any(Number)
                })
            });
            expect(res.body.user.gender === null || res.body.user.gender instanceof Boolean).toBeTruthy();
            expect(res.body.user.birthday === null || res.body.user.birthday instanceof Boolean).toBeTruthy();
        });

        test('ERROR: User does not exist', async () => {
            username = 'missingPerson';

            const res = await request(server)
                .get(`${url}/profile/${username}`);

            expect(res.statusCode).toEqual(404);
        });

        test('ERROR: Username supplied is too short', async () => {
            username = 'short';
            const res = await request(server)
                .get(`${url}/profile/${username}`);

            expect(res.statusCode).toEqual(400);
            expect(res.body).toEqual(
                expect.objectContaining({
                    errors: {
                        username: 'pattern'
                    }
                })
            );
        });

        test('ERROR: Username supplied is too long', async () => {
            username = 'aaaa aaaa aaaa aaaa aaaa aaaa aaaa aaaa aaaa aaaa aaaa aaaa aaaa a';
            const res = await request(server)
                .get(`${url}/profile/${username}`);

            expect(res.statusCode).toEqual(400);
            expect(res.body).toEqual(
                expect.objectContaining({
                    errors: {
                        username: 'pattern'
                    }
                })
            );
        });
    });

    describe(`POST: ${url}/create`, () => {
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

        test('GOOD: Register & Login', async () => {
            let statusCode, body;
            const res1 = await request(server)
                .post(`${url}/create`)
                .send(user);

            statusCode = res1.statusCode;

            expect(statusCode).toEqual(201);

            let loginUser = {};
            loginUser.username = user.username;
            loginUser.password = user.password;

            const res2 = await request(server)
                .post(`${url}/login`)
                .send(loginUser);

            statusCode = res2.statusCode;
            body = res2.body;

            expect(statusCode).toEqual(200);
            expect(body).toEqual(
                expect.objectContaining({
                    token: expect.stringMatching(JWT_REGEX)
                })
            );

            token = body.token;
        });

        test('There is already a user login', async () => {
            let loginUser = {};
            loginUser.username = user.username;
            loginUser.password = user.password;

            const {
                statusCode
            } = await request(server).post(`${url}/create`)
                .send(loginUser)
                .set('Authorization', `Bearer ${token}`);
            
            expect(statusCode).toEqual(403);
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
                        errors: expect.objectContaining({
                            username: 'used'
                        })
                    })
                );
            });

            test('Username wrong type', async () => {
                failUser.username = 1;
                
                const { 
                    statusCode,
                    body
                } = await request(server).post(`${url}/create`)
                    .send(failUser);
    
                expect(statusCode).toEqual(401);
                expect(body).toEqual(
                    expect.objectContaining({
                        errors: expect.objectContaining({
                            username: 'type'
                        })
                    })
                );
            });

            test('Register with an invalid username format (short string with spaces)', async () => {
                failUser.username = 'aaa        ';
    
                const { 
                    statusCode,
                    body
                } = await request(server).post(`${url}/create`)
                    .send(failUser);
    
                expect(statusCode).toEqual(401);
                expect(body).toEqual(
                    expect.objectContaining({
                        errors: expect.objectContaining({
                            username: 'minLength'
                        })
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
                        errors: expect.objectContaining({
                            username: 'maxLength'
                        })
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
                        errors: expect.objectContaining({
                            username: 'minLength'
                        })
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
                        errors: expect.objectContaining({
                            username: 'required'
                        })
                    })
                );
            });
        });
        
        describe('ERROR: password field', () => {
            test('Register with wrong password type', async () => {
                failUser.password = 1;

                const {
                    statusCode,
                    body
                } = await request(server).post(`${url}/create`)
                    .send(failUser);
    
                expect(statusCode).toEqual(401);
                expect(body).toEqual(
                    expect.objectContaining({
                        errors: expect.objectContaining({
                            password: 'type'
                        })
                    })
                );
            });

            test('Register with short password', async () => {
                failUser.password = 'Sh0r+';

                const {
                    statusCode,
                    body
                } = await request(server).post(`${url}/create`)
                    .send(failUser);
    
                expect(statusCode).toEqual(401);
                expect(body).toEqual(
                    expect.objectContaining({
                        errors: expect.objectContaining({
                            password: 'minLength'
                        })
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
                            errors: expect.objectContaining({
                                password: 'pattern'
                            })
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
                            errors: expect.objectContaining({
                                password: 'pattern'
                            })
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
                            errors: expect.objectContaining({
                                password: 'pattern'
                            })
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
                            errors: expect.objectContaining({
                                password: 'pattern'
                            })
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
                            errors: expect.objectContaining({
                                password: 'pattern'
                            })
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
                            errors: expect.objectContaining({
                                password: 'pattern'
                            })
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
                        errors: expect.objectContaining({
                            password: 'required'
                        })
                    })
                );
            });
        });

        describe('ERROR: email field', () => {
            test('Register with wrong email type', async () => {
                failUser.email = 0;

                const { 
                    statusCode,
                    body
                } = await request(server).post(`${url}/create`)
                    .send(failUser);
    
                expect(statusCode).toEqual(401);
                expect(body).toEqual(
                    expect.objectContaining({
                        errors: expect.objectContaining({
                            email: 'type'
                        })
                    })
                );
            });

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
                        errors: expect.objectContaining({
                            email: 'used'
                        })
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
                        errors: expect.objectContaining({
                            email: 'format'
                        })
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
                        errors: expect.objectContaining({
                            email: 'maxLength'
                        })
                    })
                );
            });

            test('Register with no email property', async () => {
                delete failUser.email;

                const {
                    statusCode,
                    body
                } = await request(server).post(`${url}/create`)
                    .send(failUser);
    
                expect(statusCode).toEqual(401);
                expect(body).toEqual(
                    expect.objectContaining({
                        errors: expect.objectContaining({
                            email: 'required'
                        })
                    })
                );
            });
        });

        //         describe('ERROR: fname field', () => {
        //             test('Register with empty fname', async () => {
        //                 failUser.fname = '';

        //                 const {
        //                     statusCode,
        //                     body
        //                 } = await request(server).post(`${url}/create`)
        //                     .send(failUser);
    
        //                 expect(statusCode).toEqual(401);
        //                 expect(body).toEqual(
        //                     expect.objectContaining({
        //                         errors: expect.objectContaining({
        //                             fname: 'minLength'
        //                         })
        //                     })
        //                 );
        //             });

        //             test('Register with whitespace fname', async () => {
        //                 failUser.fname = '      ';

        //                 const {
        //                     statusCode,
        //                     body
        //                 } = await request(server).post(`${url}/create`)
        //                     .send(failUser);
    
        //                 expect(statusCode).toEqual(401);
        //                 expect(body).toEqual(
        //                     expect.objectContaining({
        //                         errors: expect.objectContaining({
        //                             fname: 'minLength'
        //                         })
        //                     })
        //                 );
        //             });

        //             test('Register with long fname', async () => {
        //                 // 60 chars
        //                 failUser.fname = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';

        //                 const {
        //                     statusCode,
        //                     body
        //                 } = await request(server).post(`${url}/create`)
        //                     .send(failUser);
    
        //                 expect(statusCode).toEqual(401);
        //                 expect(body).toEqual(
        //                     expect.objectContaining({
        //                         errors: expect.objectContaining({
        //                             fname: 'maxLength'
        //                         })
        //                     })
        //                 );
        //             });


        //             test('Register with no fname property', async () => {
        //                 delete failUser.fname;

        //                 const {
        //                     statusCode,
        //                     body
        //                 } = await request(server).post(`${url}/create`)
        //                     .send(failUser);
    
        //                 expect(statusCode).toEqual(401);
        //                 expect(body).toEqual(
        //                     expect.objectContaining({
        //                         errors: expect.objectContaining({
        //                             fname: 'required'
        //                         })
        //                     })
        //                 );
        //             });
        //         });
    
        //         describe('ERROR: lname field', () => {
        //             test('Register with empty lname', async () => {
        //                 failUser.lname = '';

        //                 const {
        //                     statusCode,
        //                     body
        //                 } = await request(server).post(`${url}/create`)
        //                     .send(failUser);
    
        //                 expect(statusCode).toEqual(401);
        //                 expect(body).toEqual(
        //                     expect.objectContaining({
        //                         errors: expect.objectContaining({
        //                             lname: 'minLength'
        //                         })
        //                     })
        //                 );
        //             });

        //             test('Register with whitespace lname', async () => {
        //                 failUser.lname = '      ';

        //                 const {
        //                     statusCode,
        //                     body
        //                 } = await request(server).post(`${url}/create`)
        //                     .send(failUser);
    
        //                 expect(statusCode).toEqual(401);
        //                 expect(body).toEqual(
        //                     expect.objectContaining({
        //                         errors: expect.objectContaining({
        //                             lname: 'minLength'
        //                         })
        //                     })
        //                 );
        //             });

        //             test('Register with long lname', async () => {
        //                 // 60 chars
        //                 failUser.lname = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';

        //                 const {
        //                     statusCode,
        //                     body
        //                 } = await request(server).post(`${url}/create`)
        //                     .send(failUser);
    
        //                 expect(statusCode).toEqual(401);
        //                 expect(body).toEqual(
        //                     expect.objectContaining({
        //                         errors: expect.objectContaining({
        //                             lname: 'maxLength'
        //                         })
        //                     })
        //                 );
        //             });


        //             test('Register with no lname property', async () => {
        //                 delete failUser.lname;

        //                 const {
        //                     statusCode,
        //                     body
        //                 } = await request(server).post(`${url}/create`)
        //                     .send(failUser);
    
        //                 expect(statusCode).toEqual(401);
        //                 expect(body).toEqual(
        //                     expect.objectContaining({
        //                         errors: expect.objectContaining({
        //                             lname: 'required'
        //                         })
        //                     })
        //                 );
        //             });
        //         });
    
        //         describe('ERROR: gender field', () => {
        //             test('Register with empty gender', async () => {
        //                 failUser.gender = '';

        //                 const {
        //                     statusCode,
        //                     body
        //                 } = await request(server).post(`${url}/create`)
        //                     .send(failUser);
    
        //                 expect(statusCode).toEqual(401);
        //                 expect(body).toEqual(
        //                     expect.objectContaining({
        //                         errors: expect.objectContaining({
        //                             gender: 'pattern'
        //                         })
        //                     })
        //                 );
        //             });

        //             test('Register with invalid gender (pattern check of m/f)', async () => {
        //                 failUser.gender = 'x';

        //                 const {
        //                     statusCode,
        //                     body
        //                 } = await request(server).post(`${url}/create`)
        //                     .send(failUser);
    
        //                 expect(statusCode).toEqual(401);
        //                 expect(body).toEqual(
        //                     expect.objectContaining({
        //                         errors: expect.objectContaining({
        //                             gender: 'pattern'
        //                         })
        //                     })
        //                 );
        //             });
        
        //             test('Register with no gender property', async () => {
        //                 delete failUser.gender;

        //                 const {
        //                     statusCode,
        //                     body
        //                 } = await request(server).post(`${url}/create`)
        //                     .send(failUser);
    
        //                 expect(statusCode).toEqual(401);
        //                 expect(body).toEqual(
        //                     expect.objectContaining({
        //                         errors: expect.objectContaining({
        //                             gender: 'required'
        //                         })
        //                     })
        //                 );
        //             });
        //         });

        //         describe('ERROR: birthday field', () => {
        //             test('Register with empty birthday', async () => {
        //                 failUser.birthday = '';

        //                 const {
        //                     statusCode,
        //                     body
        //                 } = await request(server).post(`${url}/create`)
        //                     .send(failUser);
    
        //                 expect(statusCode).toEqual(401);
        //                 expect(body).toEqual(
        //                     expect.objectContaining({
        //                         errors: expect.objectContaining({
        //                             birthday: 'format'
        //                         })
        //                     })
        //                 );
        //             });

        //             test('Register with invalid birthday', async () => {
        //                 failUser.birthday = 'not-birtday';

        //                 const {
        //                     statusCode,
        //                     body
        //                 } = await request(server).post(`${url}/create`)
        //                     .send(failUser);
    
        //                 expect(statusCode).toEqual(401);
        //                 expect(body).toEqual(
        //                     expect.objectContaining({
        //                         errors: expect.objectContaining({
        //                             birthday: 'format'
        //                         })
        //                     })
        //                 );
        //             });

        //             test('Register with no birthday property', async () => {
        //                 delete failUser.birthday;

        //                 const {
        //                     statusCode,
        //                     body
        //                 } = await request(server).post(`${url}/create`)
        //                     .send(failUser);
    
        //                 expect(statusCode).toEqual(401);
        //                 expect(body).toEqual(
        //                     expect.objectContaining({
        //                         errors: expect.objectContaining({
        //                             birthday: 'required'
        //                         })
        //                     })
        //                 );
        //             });
        //         });

        //         describe('ERROR: bio field', () => {
        //             test('Register with empty bio', async () => {
        //                 failUser.bio = '';

        //                 const {
        //                     statusCode,
        //                     body
        //                 } = await request(server).post(`${url}/create`)
        //                     .send(failUser);
    
        //                 expect(statusCode).toEqual(401);
        //                 expect(body).toEqual(
        //                     expect.objectContaining({
        //                         errors: expect.objectContaining({
        //                             bio: 'minLength'
        //                         })
        //                     })
        //                 );
        //             });

        //             test('Register with whitespace bio', async () => {
        //                 failUser.bio = '      ';

        //                 const {
        //                     statusCode,
        //                     body
        //                 } = await request(server).post(`${url}/create`)
        //                     .send(failUser);
    
        //                 expect(statusCode).toEqual(401);
        //                 expect(body).toEqual(
        //                     expect.objectContaining({
        //                         errors: expect.objectContaining({
        //                             bio: 'minLength'
        //                         })
        //                     })
        //                 );
        //             });

        //             test('Register with long bio', async () => {
        //                 // 240 chars + 3
        //                 failUser.bio = `
        // aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
        // aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
        // aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
        // aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
        //                 `;

        //                 const {
        //                     statusCode,
        //                     body
        //                 } = await request(server).post(`${url}/create`)
        //                     .send(failUser);
    
        //                 expect(statusCode).toEqual(401);
        //                 expect(body).toEqual(
        //                     expect.objectContaining({
        //                         errors: expect.objectContaining({
        //                             bio: 'maxLength'
        //                         })
        //                     })
        //                 );
        //             });

        //             test('Register with no bio property', async () => {
        //                 delete failUser.bio;

        //                 const {
        //                     statusCode,
        //                     body
        //                 } = await request(server).post(`${url}/create`)
        //                     .send(failUser);
    
        //                 expect(statusCode).toEqual(401);
        //                 expect(body).toEqual(
        //                     expect.objectContaining({
        //                         errors: expect.objectContaining({
        //                             bio: 'required'
        //                         })
        //                     })
        //                 );
        //             });
        //         });
    
    });
    
    describe(`POST: ${url}/login`, () => {
        let loginUser = {};
        beforeEach(() => {
            loginUser.username = user.username;
            loginUser.password = user.password;
        });

        test('GOOD: Login', async () => {
            const {
                statusCode,
                body
            } = await request(server).post(`${url}/login`)
                .send(loginUser);

            expect(statusCode).toEqual(200);
            expect(body).toEqual(
                expect.objectContaining({
                    token: expect.stringMatching(JWT_REGEX)
                })
            );

            token = body.token;
        });

        test('There is already a user login', async () => {
            const {
                statusCode
            } = await request(server).post(`${url}/login`)
                .send(loginUser)
                .set('Authorization', `Bearer ${token}`);
            
            expect(statusCode).toEqual(403);
        });

        test('GOOD: Username exist with whitespace', async () => {
            loginUser.username += '   ';

            const {
                statusCode,
                body
            } = await request(server).post(`${url}/login`)
                .send(loginUser);
            
            expect(statusCode).toEqual(200);
            expect(body).toEqual(
                expect.objectContaining({
                    token: expect.stringMatching(JWT_REGEX)
                })
            );
        });

        describe('ERROR: username field', () => {
            test('Username does not exist', async () => {
                loginUser.username = 'sample-username';
    
                const {
                    statusCode
                } = await request(server).post(`${url}/login`)
                    .send(loginUser);
                
                expect(statusCode).toEqual(401);
            });

            test('Username too long', async () => {
                // 70 chars
                loginUser.username = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
    
                const {
                    statusCode
                } = await request(server).post(`${url}/login`)
                    .send(loginUser);
                
                expect(statusCode).toEqual(401);
            });

            test('Username too short', async () => {
                // 4 chars
                loginUser.username = 'aaaa';
    
                const {
                    statusCode
                } = await request(server).post(`${url}/login`)
                    .send(loginUser);
                
                expect(statusCode).toEqual(401);
            });

            test('No username property', async () => {
                delete loginUser.username;
    
                const {
                    statusCode
                } = await request(server).post(`${url}/login`)
                    .send(loginUser);
                
                expect(statusCode).toEqual(401);
            });
        });
        
        describe('ERROR: password field', () => {
            test('Wrong Password', async () => {
                loginUser.password = 'Not-his-password';
                
                const {
                    statusCode
                } = await request(server).post(`${url}/login`)
                    .send(loginUser);
                
                expect(statusCode).toEqual(401);
            });

            test('Password too long', async () => {
                // ~300 chars
                loginUser.password = `
                    Asdf1234
                    aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
                    aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
                    aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
                    aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
                    aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
                `;
    
                const {
                    statusCode
                } = await request(server).post(`${url}/login`)
                    .send(loginUser);
                
                expect(statusCode).toEqual(401);
            });

            test('Password too short', async () => {
                loginUser.password = '$hoRt';
    
                const {
                    statusCode
                } = await request(server).post(`${url}/login`)
                    .send(loginUser);
                
                expect(statusCode).toEqual(401);
            });

            test('No password property', async () => {
                delete loginUser.username;
    
                const {
                    statusCode
                } = await request(server).post(`${url}/login`)
                    .send(loginUser);
                
                expect(statusCode).toEqual(401);
            });
        });
    });

    describe(`POST: ${url}/auth`, () => {
        test('GOOD: Valid token', async () => {
            const {
                statusCode,
                body
            } = await request(server).get(`${url}/auth`)
                .set('Authorization', `Bearer ${token}`);
            
            expect(statusCode).toEqual(200);
            expect(body).toEqual(
                expect.objectContaining({
                    user: expect.objectContaining({
                        username: user.username,
                        email: user.email,
                        fame: expect.any(Number),
                        iat: expect.any(Number)
                    })
                })
            );
        });

        test('ERROR: Invalid token', async () => {
            const {
                statusCode
            } = await request(server).get(`${url}/auth`)
                .set('Authorization', 'Bearer just-a-random-token');
            
            expect(statusCode).toEqual(403);
        });
    });
});

afterAll(async () => {
    await db.query({ 
        text: 'DELETE FROM users WHERE username=$1;',
        values: [ user.username ]
    });
    await db.end();

    await server.close();
});