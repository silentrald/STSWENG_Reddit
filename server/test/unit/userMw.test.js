const { 
    validateRegisterUser,
    validateUserParam,
    validateUserProfile
} = require('../../middlewares/userMw');

const mockRequest = (data) => {
    return data;
};

const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    return res;
};

const mockNext = () => {
    return jest.fn();
};

describe('Unit test: userMw.js', () => {
    describe('Middleware: getAuth', () => {
        let body;
        beforeEach(() => {
            body = {
                username: 'username',
                password: 'V4lid-password',
                email: 'username@gmail.com'
            };   
        });

        test('GOOD', async () => {
            const req = mockRequest({ body });
            const res = mockResponse();
            const next = mockNext();
            
            await validateRegisterUser(req, res, next);

            expect(next).toHaveBeenCalledTimes(1);
        });

        test('GOOD with extra whitespaces', async () => {
            body.username += '     ';
            const req = mockRequest({ body });
            const res = mockResponse();
            const next = mockNext();
            
            await validateRegisterUser(req, res, next);

            expect(next).toHaveBeenCalledTimes(1);
        });

        describe('BAD: Invalid username', () => {
            test('Username wrong type', async () => {
                body.username = 1;
                const req = mockRequest({ body });
                const res = mockResponse();
                const next = mockNext();
                
                await validateRegisterUser(req, res, next);
                
                expect(res.status).toHaveBeenCalledWith(401);
                expect(res.send).toHaveBeenCalledWith({
                    errors: {
                        username: 'type'
                    }
                });
                expect(next).toHaveBeenCalledTimes(0);
            });

            test('Username is too short', async () => {
                body.username = 'short';
                const req = mockRequest({ body });
                const res = mockResponse();
                const next = mockNext();
                
                await validateRegisterUser(req, res, next);
                
                expect(res.status).toHaveBeenCalledWith(401);
                expect(res.send).toHaveBeenCalledWith({
                    errors: {
                        username: 'minLength'
                    }
                });
                expect(next).toHaveBeenCalledTimes(0);
            });

            test('Username is too long', async () => {
                // 65 chars
                body.username = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
                const req = mockRequest({ body });
                const res = mockResponse();
                const next = mockNext();
                
                await validateRegisterUser(req, res, next);
                
                expect(res.status).toHaveBeenCalledWith(401);
                expect(res.send).toHaveBeenCalledWith({
                    errors: {
                        username: 'maxLength'
                    }
                });
                expect(next).toHaveBeenCalledTimes(0);
            });

            test('No username property', async () => {
                delete body.username;
                const req = mockRequest({ body });
                const res = mockResponse();
                const next = mockNext();
                
                await validateRegisterUser(req, res, next);
                
                expect(res.status).toHaveBeenCalledWith(401);
                expect(res.send).toHaveBeenCalledWith({
                    errors: {
                        username: 'required'
                    }
                });
                expect(next).toHaveBeenCalledTimes(0);
            });
        });

        describe('BAD: Invalid password', () => {
            test('Password wrong type', async () => {
                body.password = 1;
                const req = mockRequest({ body });
                const res = mockResponse();
                const next = mockNext();
                
                await validateRegisterUser(req, res, next);
                
                expect(res.status).toHaveBeenCalledWith(401);
                expect(res.send).toHaveBeenCalledWith({
                    errors: {
                        password: 'type'
                    }
                });
                expect(next).toHaveBeenCalledTimes(0);
            });

            test('Password is too short', async () => {
                body.password = 'short';
                const req = mockRequest({ body });
                const res = mockResponse();
                const next = mockNext();
                
                await validateRegisterUser(req, res, next);
                
                expect(res.status).toHaveBeenCalledWith(401);
                expect(res.send).toHaveBeenCalledWith({
                    errors: {
                        password: 'minLength'
                    }
                });
                expect(next).toHaveBeenCalledTimes(0);
            });

            test('Password is too long', async () => {
                // 270 chars
                body.password = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
                const req = mockRequest({ body });
                const res = mockResponse();
                const next = mockNext();
                
                await validateRegisterUser(req, res, next);
                
                expect(res.status).toHaveBeenCalledWith(401);
                expect(res.send).toHaveBeenCalledWith({
                    errors: {
                        password: 'maxLength'
                    }
                });
                expect(next).toHaveBeenCalledTimes(0);
            });

            test('No username property', async () => {
                delete body.password;
                const req = mockRequest({ body });
                const res = mockResponse();
                const next = mockNext();
                
                await validateRegisterUser(req, res, next);
                
                expect(res.status).toHaveBeenCalledWith(401);
                expect(res.send).toHaveBeenCalledWith({
                    errors: {
                        password: 'required'
                    }
                });
                expect(next).toHaveBeenCalledTimes(0);
            });
        });

        describe('BAD: Invalid email', () => {
            test('Email wrong type', async () => {
                body.email = 1;
                const req = mockRequest({ body });
                const res = mockResponse();
                const next = mockNext();
                
                await validateRegisterUser(req, res, next);
                
                expect(res.status).toHaveBeenCalledWith(401);
                expect(res.send).toHaveBeenCalledWith({
                    errors: {
                        email: 'type'
                    }
                });
                expect(next).toHaveBeenCalledTimes(0);
            });

            test('Invalid email format', async () => {
                body.email = 'not-a-valid-email';
                const req = mockRequest({ body });
                const res = mockResponse();
                const next = mockNext();
                
                await validateRegisterUser(req, res, next);
                
                expect(res.status).toHaveBeenCalledWith(401);
                expect(res.send).toHaveBeenCalledWith({
                    errors: {
                        email: 'format'
                    }
                });
                expect(next).toHaveBeenCalledTimes(0);
            });

            test('Email is too long', async () => {
                // 270 chars
                body.email = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@gmail.com';
                const req = mockRequest({ body });
                const res = mockResponse();
                const next = mockNext();
                
                await validateRegisterUser(req, res, next);
                
                expect(res.status).toHaveBeenCalledWith(401);
                expect(res.send).toHaveBeenCalledWith({
                    errors: {
                        email: 'maxLength'
                    }
                });
                expect(next).toHaveBeenCalledTimes(0);
            });

            test('No email property', async () => {
                delete body.email;
                const req = mockRequest({ body });
                const res = mockResponse();
                const next = mockNext();
                
                await validateRegisterUser(req, res, next);
                
                expect(res.status).toHaveBeenCalledWith(401);
                expect(res.send).toHaveBeenCalledWith({
                    errors: {
                        email: 'required'
                    }
                });
                expect(next).toHaveBeenCalledTimes(0);
            });
        });
    });

    describe('Middleware: validateUserParam', () => {
        let params;
        beforeEach(() => {
            params = {
                username: 'valid_example'
            };
        });

        test('GOOD', async () => {
            const req = mockRequest({ params });
            const res = mockResponse();
            const next = mockNext();

            await validateUserParam(req, res, next);
            
            expect(next).toHaveBeenCalledTimes(1);
        });

        test('ERROR: Empty Username', async () => {
            params.username = '';

            const req = mockRequest({ params });
            const res = mockResponse();
            const next = mockNext();

            await validateUserParam(req, res, next);
            
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith({
                errors: {
                    username: 'pattern'
                }
            });
            expect(next).toHaveBeenCalledTimes(0);
        });

        test('ERROR: Username too short', async () => {
            params.username = 'short';

            const req = mockRequest({ params });
            const res = mockResponse();
            const next = mockNext();

            await validateUserParam(req, res, next);
            
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith({
                errors: {
                    username: 'pattern'
                }
            });
            expect(next).toHaveBeenCalledTimes(0);
        });

        test('ERROR: Username too long', async () => {
            params.username = 'aaaa aaaa aaaa aaaa aaaa aaaa aaaa aaaa aaaa aaaa aaaa aaaa aaaa a';
            console.log(params);
            const req = mockRequest({ params });
            const res = mockResponse();
            const next = mockNext();

            await validateUserParam(req, res, next);
            
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith({
                errors: {
                    username: 'pattern'
                }
            });
            expect(next).toHaveBeenCalledTimes(0);
        });
    });

    describe('Middleware: validateUserProfile', () => {
        let body;
        beforeEach(() => {
            body = {
                fname: 'Test First Name',
                lname: 'Test Last Name',
                bio: 'Test Bio',
                birthday: '2000-03-03',
                gender: 'm'
            };
        });

        test('GOOD: All values filled', async () => {
            const req = mockRequest({ body });
            const res = mockResponse();
            const next = mockNext();

            await validateUserProfile(req, res, next);

            expect(next).toHaveBeenCalledTimes(1);
        });

        describe('ERROR: Missing values',  () => {
            test('Missing fname', async () => {
                delete body.fname;

                const req = mockRequest({ body });
                const res = mockResponse();
                const next = mockNext();
    
                await validateUserProfile(req, res, next);
    
                expect(res.status).toHaveBeenCalledWith(401);
                expect(res.send).toHaveBeenCalledWith({
                    errors: {
                        fname: 'required'
                    }
                });
                expect(next).toHaveBeenCalledTimes(0);
            });

            test('Missing lname', async () => {
                delete body.lname;

                const req = mockRequest({ body });
                const res = mockResponse();
                const next = mockNext();
    
                await validateUserProfile(req, res, next);
    
                expect(res.status).toHaveBeenCalledWith(401);
                expect(res.send).toHaveBeenCalledWith({
                    errors: {
                        lname: 'required'
                    }
                });
                expect(next).toHaveBeenCalledTimes(0);
            });

            test('Missing bio', async () => {
                delete body.bio;

                const req = mockRequest({ body });
                const res = mockResponse();
                const next = mockNext();
    
                await validateUserProfile(req, res, next);
    
                expect(res.status).toHaveBeenCalledWith(401);
                expect(res.send).toHaveBeenCalledWith({
                    errors: {
                        bio: 'required'
                    }
                });
                expect(next).toHaveBeenCalledTimes(0);
            });

            test('Missing birthday', async () => {
                delete body.birthday;

                const req = mockRequest({ body });
                const res = mockResponse();
                const next = mockNext();
    
                await validateUserProfile(req, res, next);
    
                expect(res.status).toHaveBeenCalledWith(401);
                expect(res.send).toHaveBeenCalledWith({
                    errors: {
                        birthday: 'required'
                    }
                });
                expect(next).toHaveBeenCalledTimes(0);
            });

            test('Missing gender', async () => {
                delete body.gender;

                const req = mockRequest({ body });
                const res = mockResponse();
                const next = mockNext();
    
                await validateUserProfile(req, res, next);
    
                expect(res.status).toHaveBeenCalledWith(401);
                expect(res.send).toHaveBeenCalledWith({
                    errors: {
                        gender: 'required'
                    }
                });
                expect(next).toHaveBeenCalledTimes(0);
            });
        });

        describe('ERROR: Invalid format',  () => {
            describe('fname', () => {
                test('Too long', async () => {
                    body.fname = 'aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa TOO LONG';

                    const req = mockRequest({ body });
                    const res = mockResponse();
                    const next = mockNext();

                    await validateUserProfile(req, res, next);

                    expect(res.status).toHaveBeenCalledWith(401);
                    expect(res.send).toHaveBeenCalledWith({
                        errors: {
                            fname: 'maxLength'
                        }
                    });
                });

                test('Invalid type', async () => {
                    body.fname = 0;

                    const req = mockRequest({ body });
                    const res = mockResponse();
                    const next = mockNext();

                    await validateUserProfile(req, res, next);

                    expect(res.status).toHaveBeenCalledWith(401);
                    expect(res.send).toHaveBeenCalledWith({
                        errors: {
                            fname: 'type'
                        }
                    });
                });
            });

            describe('lname', () => {
                test('Too long', async () => {
                    body.lname = 'aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa TOO LONG';

                    const req = mockRequest({ body });
                    const res = mockResponse();
                    const next = mockNext();

                    await validateUserProfile(req, res, next);

                    expect(res.status).toHaveBeenCalledWith(401);
                    expect(res.send).toHaveBeenCalledWith({
                        errors: {
                            lname: 'maxLength'
                        }
                    });
                });

                test('Invalid type', async () => {
                    body.lname = 0;

                    const req = mockRequest({ body });
                    const res = mockResponse();
                    const next = mockNext();

                    await validateUserProfile(req, res, next);

                    expect(res.status).toHaveBeenCalledWith(401);
                    expect(res.send).toHaveBeenCalledWith({
                        errors: {
                            lname: 'type'
                        }
                    });
                });
            });

            describe('bio', () => {
                test('Too long', async () => {
                    body.bio = `
                        aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa TOO LONG
                        aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa TOO LONG
                        aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa TOO LONG
                        aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa TOO LONG
                    `;

                    const req = mockRequest({ body });
                    const res = mockResponse();
                    const next = mockNext();

                    await validateUserProfile(req, res, next);

                    expect(res.status).toHaveBeenCalledWith(401);
                    expect(res.send).toHaveBeenCalledWith({
                        errors: {
                            bio: 'maxLength'
                        }
                    });
                });

                test('Invalid type', async () => {
                    body.bio = 0;

                    const req = mockRequest({ body });
                    const res = mockResponse();
                    const next = mockNext();

                    await validateUserProfile(req, res, next);

                    expect(res.status).toHaveBeenCalledWith(401);
                    expect(res.send).toHaveBeenCalledWith({
                        errors: {
                            bio: 'type'
                        }
                    });
                });
            });
        });
    });
});