const {
    sanitizeSubpostsQuery
} = require('../../middlewares/subpostMw');

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

const LIMIT = 7;

describe('Unit Testing: subpostMw', () => {
    describe('Middleware: validateSubpostQuery', () => {
        let query = {};

        beforeEach(() => {
            query = {};
        });
        
        test('GOOD: No query', async () => {
            const req = mockRequest({
                query
            });
            const res = mockResponse();
            const next = mockNext();

            await sanitizeSubpostsQuery(req, res, next);

            expect(next).toHaveBeenCalledTimes(1);
            expect(req.query).toEqual({
                offset: 0,
                limit: LIMIT
            });
        });

        test('GOOD: With query', async () => {
            query = {
                offset: 1,
                limit: 2
            };
            const req = mockRequest({
                query
            });
            const res = mockResponse();
            const next = mockNext();

            await sanitizeSubpostsQuery(req, res, next);

            expect(next).toHaveBeenCalledTimes(1);
            expect(req.query).toEqual({
                offset: 1,
                limit: 2
            });
        });

        describe('GOOD: sanitize offset', () => {
            test('Invalid type', async () => {
                query.offset = 'hello';
                const req = mockRequest({
                    query
                });
                const res = mockResponse();
                const next = mockNext();
    
                await sanitizeSubpostsQuery(req, res, next);
    
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
    
                await sanitizeSubpostsQuery(req, res, next);
    
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
    
                await sanitizeSubpostsQuery(req, res, next);
    
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
    
                await sanitizeSubpostsQuery(req, res, next);
    
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
    
                await sanitizeSubpostsQuery(req, res, next);
    
                expect(next).toHaveBeenCalledTimes(1);
                expect(req.query).toEqual({
                    offset: 0,
                    limit: LIMIT
                });
            });
        });
    });
});