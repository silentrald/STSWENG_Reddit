const {
    validateUpvoteBody
} = require('../../middlewares/voteMw');

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

describe('', () => {
    describe('Middleware: validateUpvoteBody', () => {
        test('GOOD', async () => {
            const req = mockRequest({
                body: {
                    upvote: true
                }
            });
            const res = mockResponse();
            const next = mockNext();

            await validateUpvoteBody(req, res, next);

            expect(next).toHaveBeenCalledTimes(1);
        });

        test('BAD: Empty', async () => {
            const req = mockRequest({ body: {} });
            const res = mockResponse();
            const next = mockNext();

            await validateUpvoteBody(req, res, next);

            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.send).toHaveBeenCalledWith({
                errors: {
                    upvote: 'type'
                }
            });
        });

        test('BAD: Invalid format', async () => {
            const req = mockRequest({
                body: {
                    upvote: 100
                }
            });
            const res = mockResponse();
            const next = mockNext();

            await validateUpvoteBody(req, res, next);

            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.send).toHaveBeenCalledWith({
                errors: {
                    upvote: 'type'
                }
            });
        });
    });
});