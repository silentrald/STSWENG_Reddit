process.env.JWT_SECRET = 'test-value'; // set the jwt token

const {
    getAuth,
    getUserNames,
    postLogin,
    postRegisterUser
} = require('../../api/userAPI');

jest.mock('../../db', () => {
    /**
     * Converts a multiline queryText to a single line query
     * 
     * @param {string} queryText
     */
    const oneLineQuery = (queryText) => queryText.trim().replace(/\n/g, ' ').replace(/ {2,}/g, ' ');

    return {
        connect: jest.fn(),
        query: jest.fn().mockImplementation(query => {
            const result = {
                rows: [],
                rowCount: 0
            };

            query.text = oneLineQuery(query.text);

            if (query.text === 'SELECT * FROM users WHERE username=$1 LIMIT 1;' && query.values[0] && query.values[0] === 'username') {
                result.rows = [
                    {
                        username: 'username',
                        password: '$2b$10$aQAt7KKZZVllvFulEDKhBOqLWxk0iBZad98BNr5xtdYSLbQ/Y0c1O'
                    }
                ];
                result.rowCount = 1;
            } else if (query.text === 'INSERT INTO users(username, password, email) VALUES($1, $2, $3);'
                        && query.values[0] && query.values[1] && query.values[2]) {
                if (query.values[0] === 'username') {
                    throw { 
                        code: '23505',
                        constraint: 'users_pkey'
                    };
                } else if (query.values[2] === 'username@gmail.com') {
                    throw { 
                        code: '23505',
                        constraint: 'users_email_key'
                    };
                }
                result.rowCount = 1;
            } else if (query.text === 'SELECT username FROM users WHERE username ILIKE $1 OFFSET $2 LIMIT $3;') {
                result.rows = [{}];
                result.rowCount = 1;
            }

            return result;
        }),
        end: jest.fn(),
    };
});
const db = require('../../db');

const mockRequest = (data) => {
    return data;
};

const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    return res;
};

const oneLineQuery = (queryText) => queryText.trim().replace(/\n/g, ' ').replace(/ {2,}/g, ' ');

describe('Unit test: userAPI.js', () => {
    describe('API: getAuth', () => {
        test('When there is a req.user is supplied', async () => {
            const user = {
                username: 'username',
                email: 'username@gmail.com'
            };
            const req = mockRequest({ user });
            const res = mockResponse();
            
            await getAuth(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.send).toHaveBeenCalledWith({ user });
        });

        test('When there is no req.user is supplied', async () => {
            const req = mockRequest({ user: undefined });
            const res = mockResponse();

            await getAuth(req, res);

            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.send).toHaveBeenCalledWith();
        });
    });

    describe('API: getUserNames', () => {
        let query = {};

        beforeEach(() => {
            query = {};
        });

        test('GOOD: no search', async () => {
            const req = mockRequest({ query });
            const res = mockResponse();

            await getUserNames(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
        });

        test('GOOD: search', async () => {
            query.search = 'valid';
            const req = mockRequest({ query });
            const res = mockResponse();

            await getUserNames(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
        });

        
    });

    describe('API: postRegisterUser', () => {
        let body, db, queryText;

        beforeAll(() => {
            queryText = oneLineQuery(`
                INSERT INTO users(username, password, email)
                    VALUES($1, $2, $3);
            `);
        });

        beforeEach(() => {
            db = require('../../db');
            body = {
                username: 'new-username',
                password: 'password',
                email: 'new-username@gmail.com'
            };
        });

        test('GOOD: Register with correct credentials', async () => {
            const req = mockRequest({ body });
            const res = mockResponse();

            await postRegisterUser(req, res);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(db.query).toHaveBeenCalledWith(
                expect.objectContaining({
                    text: queryText,
                    values: expect.arrayContaining([
                        body.username,
                        body.email
                    ])
                })
            );
        });

        test('BAD: Existing username', async () => {
            body.username = 'username';
            const req = mockRequest({ body });
            const res = mockResponse();

            await postRegisterUser(req, res);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.send).toHaveBeenCalledWith({ 
                errors: { 
                    username: 'used'
                }
            });

            expect(db.query).toHaveBeenCalledWith(
                expect.objectContaining({
                    text: queryText,
                    values: expect.arrayContaining([
                        body.username,
                        body.email
                    ])
                })
            );
        });

        test('BAD: Existing email', async () => {
            body.email = 'username@gmail.com';
            const req = mockRequest({ body });
            const res = mockResponse();

            await postRegisterUser(req, res);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.send).toHaveBeenCalledWith({ 
                errors: { 
                    email: 'used'
                }
            });

            expect(db.query).toHaveBeenCalledWith(
                expect.objectContaining({
                    text: queryText,
                    values: expect.arrayContaining([
                        body.username,
                        body.email
                    ])
                })
            );
        });
    });

    describe('API: postLogin', () => {
        let body;

        beforeEach(() => {
            jest.clearAllMocks();
            body = {
                username: 'username',
                password: 'password'
            };
        });

        test('GOOD: correct credentials', async () => {
            const req = mockRequest({ body });
            const res = mockResponse();

            await postLogin(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.send).toHaveBeenCalledWith(
                expect.objectContaining({
                    token: expect.any(String)
                })
            );

            expect(db.query).toHaveBeenCalledTimes(1);
        });

        test('BAD: wrong username', async () => {
            body.username = 'not-username';
            const req = mockRequest({ body });
            const res = mockResponse();

            await postLogin(req, res);
            
            expect(res.status).toHaveBeenCalledWith(401);

            expect(db.query).toHaveBeenCalledTimes(1);
        });

        test('BAD: Existing username, wrong password', async () => {
            body.password = 'wrong-password';
            const req = mockRequest({ body });
            const res = mockResponse();

            await postLogin(req, res);
            
            expect(res.status).toHaveBeenCalledWith(401);

            expect(db.query).toHaveBeenCalledTimes(1);
        });
    });
});