process.env.JWT_SECRET = 'test-value';
const jwt = require('../../modules/jwt');

const { 
    smartLogin, 
    isAuth,
    isNotAuth,
    validateLogin
} = require('../../middlewares/loginMw');

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

let token;
const user = {
    username: 'username',
    email: 'email@gmail.com'
};

describe('Unit Testing: loginMw', () => {
    beforeAll(async () => {
        token = await jwt.signPromise(user);
    });

    describe('Middleware: smartLogin', () => {
        test('GOOD: Authorization header is present', async () => {
            const req = mockRequest({
                headers: {
                    authorization: `Bearer ${token}`
                }
            });
            const res = mockResponse();
            const next = mockNext();

            await smartLogin(req, res, next);

            expect(next).toHaveBeenCalledTimes(1);
            expect(req.user).toEqual(
                expect.objectContaining({
                    username: user.username,
                    email: user.email
                })
            );
        });

        test('GOOD: No Authorization header', async () => {
            const req = mockRequest({ headers: {} });
            const res = mockResponse();
            const next = mockNext();

            await smartLogin(req, res, next);

            expect(next).toHaveBeenCalledTimes(1);
            expect(res.user).toEqual(undefined);
        });

        test('GOOD: Authorization header is invalid', async () => {
            const req = mockRequest({
                headers: {
                    authorization: 'Bearer some-random-token'
                }
            });
            const res = mockResponse();
            const next = mockNext();

            await smartLogin(req, res, next);

            expect(next).toHaveBeenCalledTimes(1);
            expect(res.user).toEqual(undefined);
        });
    });

    describe('Middleware: isAuth', () => {
        test('GOOD: Authorization header is present', async () => {
            const req = mockRequest({ user });
            const res = mockResponse();
            const next = mockNext();

            await isAuth(req, res, next);

            expect(next).toHaveBeenCalledTimes(1);
        });

        test('BAD: Authorization header is not present', async () => {
            const req = mockRequest({ });
            const res = mockResponse();
            const next = mockNext();

            await isAuth(req, res, next);

            expect(res.status).toHaveBeenCalledWith(403);
            expect(next).toHaveBeenCalledTimes(0);
        });
    });

    describe('Middleware: isNotAuth', () => {
        test('GOOD: Authorization header is not present', async () => {
            const req = mockRequest({ });
            const res = mockResponse();
            const next = mockNext();

            await isNotAuth(req, res, next);

            expect(next).toHaveBeenCalledTimes(1);
        });

        test('BAD: Authorization header is present', async () => {
            const req = mockRequest({ user });
            const res = mockResponse();
            const next = mockNext();

            await isNotAuth(req, res, next);

            expect(res.status).toHaveBeenCalledWith(403);
            expect(next).toHaveBeenCalledTimes(0);
        });
    });

    describe('Middleware: validateLogin', () => {
        let body;
        beforeAll(() => {
            body = {
                username: 'username',
                password: 'P4ssword'
            };
        });

        test('GOOD: Valid Credentials', async () => {
            const req = mockRequest({ body });
            const res = mockResponse();
            const next = mockNext();

            await validateLogin(req, res, next);

            expect(next).toHaveBeenCalledTimes(1);
        });

        test('GOOD: Valid Credentials with white spaces', async () => {
            body.username += '   ';
            const req = mockRequest({ body });
            const res = mockResponse();
            const next = mockNext();

            await validateLogin(req, res, next);

            expect(next).toHaveBeenCalledTimes(1);
        });

        describe('BAD: username field', () => {
            test('Username wrong type', async () => {
                body.username = 1;
                const req = mockRequest({ body });
                const res = mockResponse();
                const next = mockNext();
                
                await validateLogin(req, res, next);
                
                expect(res.status).toHaveBeenCalledWith(401);
            });

            test('Username is too short', async () => {
                body.username = 'aaaa';
                const req = mockRequest({ body });
                const res = mockResponse();
                const next = mockNext();
                
                await validateLogin(req, res, next);
                
                expect(res.status).toHaveBeenCalledWith(401);
            });

            test('Username is too long', async () => {
                body.username = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
                const req = mockRequest({ body });
                const res = mockResponse();
                const next = mockNext();
                
                await validateLogin(req, res, next);
                
                expect(res.status).toHaveBeenCalledWith(401);
            });

            test('No username property', async () => {
                delete body.username;
                const req = mockRequest({ body });
                const res = mockResponse();
                const next = mockNext();
                
                await validateLogin(req, res, next);
                
                expect(res.status).toHaveBeenCalledWith(401);
            });
        });

        describe('BAD: password field', () => {
            test('Password wrong type', async () => {
                body.password = 1;
                const req = mockRequest({ body });
                const res = mockResponse();
                const next = mockNext();
                
                await validateLogin(req, res, next);
                
                expect(res.status).toHaveBeenCalledWith(401);
            });

            test('Password is too short', async () => {
                body.password = 'P4ss';
                const req = mockRequest({ body });
                const res = mockResponse();
                const next = mockNext();
                
                await validateLogin(req, res, next);
                
                expect(res.status).toHaveBeenCalledWith(401);
            });

            test('Password is too long', async () => {
                body.password = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
                const req = mockRequest({ body });
                const res = mockResponse();
                const next = mockNext();
                
                await validateLogin(req, res, next);
                
                expect(res.status).toHaveBeenCalledWith(401);
            });

            test('No password property', async () => {
                delete body.password;
                const req = mockRequest({ body });
                const res = mockResponse();
                const next = mockNext();
                
                await validateLogin(req, res, next);
                
                expect(res.status).toHaveBeenCalledWith(401);
            });
        });
    });
});