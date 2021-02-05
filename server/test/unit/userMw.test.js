const { 
    validateRegisterUser,
    validateUserParam
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
});