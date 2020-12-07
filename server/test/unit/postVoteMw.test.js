const {
    validatePostParam
} = require('../../middlewares/postVoteMw');

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

// REGEX
// const POST_REGEX = /^p[A-Za-z0-9]{0,11}$/;

// DATA
const posts = [
    'paaaaaaaaaa1',
    'paaaaaaaaaa2',
    'paaaaaaaaaa3'
];

describe('Unit Testing: postVoteMw', () => {
    describe('Middleware: validatePostParam', () => {
        test('GOOD', async () => {
            const req = mockRequest({
                params: {
                    post: posts[0]
                }
            });
            const res = mockResponse();
            const next = mockNext();

            await validatePostParam(req, res, next);

            expect(next).toHaveBeenCalledTimes(1);
        });

        test('BAD: Invalid format', async () => {
            const req = mockRequest({
                params: {
                    post: 'notagood'
                }
            });
            const res = mockResponse();
            const next = mockNext();

            await validatePostParam(req, res, next);

            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.send).toHaveBeenCalledWith({
                errors: {
                    post: 'pattern'
                }
            });
        });
    });
});