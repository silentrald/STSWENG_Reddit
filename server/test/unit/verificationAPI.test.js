const {
    postSendVerification,
    postVerification
} = require('../../api/verificationAPI');

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
            if (query.text.endsWith('RETURNING token;')) {
                result.rows = [{
                    token: 'token'
                }];
                result.rowCount = 1;
            } else if (query.text === 'SELECT verified FROM users WHERE username=$1 LIMIT 1;') {
                result.rows = [{
                    verified: false
                }];
                result.rowCount = 1;
            } else if (query.text === 'SELECT * FROM verifications WHERE username=$1 LIMIT 1;') {
                result.rows = [{
                    username: 'username',
                    token: 'token',
                    expires_at: new Date(Date.now() + 60000)
                }];
                result.rowCount = 1;
            }

            return result;
        }),
        end: jest.fn(),
    };
});

jest.mock('../../modules/mailer', () => {
    return {
        sendMail: jest.fn()
    };
});

const mockRequest = (data) => {
    return data;
};

const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    return res;
};

describe('Unit Test: verification API', () => {
    describe('API: postSendVerification', () => {
        let user = {};

        beforeEach(() => {
            jest.clearAllMocks();
            user = {
                username: 'username'
            };
        });
        
        test('GOOD', async () => {
            const req = mockRequest({
                user
            });
            const res = mockResponse();
            
            await postSendVerification(req, res);

            expect(res.send).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledWith(200);
        });
    });

    describe('API: postVerification', () => {
        let body = {};

        beforeEach(() => {
            jest.clearAllMocks();
            body = {
                username: 'sel-username',
                token: 'token'
            };
        });
        
        test('GOOD', async () => {
            const req = mockRequest({
                body
            });
            const res = mockResponse();
            
            await postVerification(req, res);
        });
    });
});