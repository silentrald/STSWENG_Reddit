const {
    sanitizeSearch,
    sanitizeOffsetAndLimit
} = require('../../middlewares/queryStringMw');

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

const LIMIT = 10;

describe('Unit Testing: queryStringMw', () => {
    describe('Middleware: sanitizeSearch', () => {
        let query = {};

        beforeAll(() => {
            query = {
                search: 'valid'
            };
        });

        test('GOOD: no query', async () => {
            const req = mockRequest({ query: {} });
            const res = mockResponse();
            const next = mockNext();

            await sanitizeSearch(req, res, next);

            expect(req.query.search).toEqual(undefined);
            expect(next).toHaveBeenCalledTimes(1);
        });

        test('GOOD: valid string', async () => {
            const req = mockRequest({ query });
            const res = mockResponse();
            const next = mockNext();

            await sanitizeSearch(req, res, next);

            expect(req.query.search).toEqual('%valid%');
            expect(next).toHaveBeenCalledTimes(1);
        });
    });

    describe('Middleware: sanitizeOffsetAndLimit', () => {
        let query = {};

        beforeAll(() => {
            query = {
                offset: 0,
                limit: LIMIT
            };
        });

        test('GOOD: without query', async () => {
            const req = mockRequest({ query: {} });
            const res = mockResponse();
            const next = mockNext();

            await sanitizeOffsetAndLimit(req, res, next);

            expect(req.query.offset).toEqual(0);
            expect(req.query.limit).toEqual(LIMIT);
            expect(next).toHaveBeenCalledTimes(1);
        });

        test('GOOD: with query', async () => {
            const req = mockRequest({ query });
            const res = mockResponse();
            const next = mockNext();

            await sanitizeOffsetAndLimit(req, res, next);

            expect(req.query.offset).toEqual(0);
            expect(req.query.limit).toEqual(LIMIT);
            expect(next).toHaveBeenCalledTimes(1);
        });

        describe('GOOD: sanitize offset', () => {
            test('Invalid type', async () => {
                query.offset = 'hello';
                const req = mockRequest({
                    query
                });
                const res = mockResponse();
                const next = mockNext();
    
                await sanitizeOffsetAndLimit(req, res, next);
    
                expect(next).toHaveBeenCalledTimes(1);
                expect(req.query).toEqual({
                    offset: 0,
                    limit: LIMIT
                });
            });

            test('Negative Number', async () => {
                query.offset = -2;
                const req = mockRequest({
                    query
                });
                const res = mockResponse();
                const next = mockNext();
    
                await sanitizeOffsetAndLimit(req, res, next);
    
                expect(next).toHaveBeenCalledTimes(1);
                expect(req.query).toEqual({
                    offset: 0,
                    limit: LIMIT
                });
            });
        });

        describe('GOOD: sanitize limit', () => {
            test('Invalid type', async () => {
                query.limit = 'hello';
                const req = mockRequest({
                    query
                });
                const res = mockResponse();
                const next = mockNext();
    
                await sanitizeOffsetAndLimit(req, res, next);
    
                expect(next).toHaveBeenCalledTimes(1);
                expect(req.query).toEqual({
                    offset: 0,
                    limit: LIMIT
                });
            });

            test('Zero', async () => {
                query.limit = 0;
                const req = mockRequest({
                    query
                });
                const res = mockResponse();
                const next = mockNext();
    
                await sanitizeOffsetAndLimit(req, res, next);
    
                expect(next).toHaveBeenCalledTimes(1);
                expect(req.query).toEqual({
                    offset: 0,
                    limit: LIMIT
                });
            });

            test('Negative Number', async () => {
                query.limit = -2;
                const req = mockRequest({
                    query
                });
                const res = mockResponse();
                const next = mockNext();
    
                await sanitizeOffsetAndLimit(req, res, next);
    
                expect(next).toHaveBeenCalledTimes(1);
                expect(req.query).toEqual({
                    offset: 0,
                    limit: LIMIT
                });
            });
        });
    });
});