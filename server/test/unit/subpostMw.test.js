const {
    sanitizeSubpostsQuery, validateComment
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
    
    describe('Middleware: validateComment', () => {
        let body = {};

        beforeEach(() => {
            body = { text: 'This comment is good!' };
        });
        
        test('GOOD: Text supplied', async () => {
            const req = mockRequest({
                body
            });
            const res = mockResponse();
            const next = mockNext();

            await validateComment(req, res, next);

            expect(next).toHaveBeenCalledTimes(1);
        });
        
        test('Text not a string', async () => {
            body = { text: 12345 };
            const req = mockRequest({
                body
            });
            const res = mockResponse();
            const next = mockNext();

            await validateComment(req, res, next);

            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.send).toHaveBeenCalledWith({
                errors: expect.objectContaining({
                    text: 'type'
                })
            });
        });
        
        test('Text not supplied', async () => {
            body = {};
            const req = mockRequest({
                body
            });
            const res = mockResponse();
            const next = mockNext();

            await validateComment(req, res, next);

            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.send).toHaveBeenCalledWith({
                errors: expect.objectContaining({
                    text: 'required'
                })
            });
        });
        
        test('Text empty', async () => {
            body = { text: '' };
            const req = mockRequest({
                body
            });
            const res = mockResponse();
            const next = mockNext();

            await validateComment(req, res, next);

            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.send).toHaveBeenCalledWith({
                errors: expect.objectContaining({
                    text: 'minLength'
                })
            });
        });
        
        test('Text too long', async () => {
            // dynamically create string because the comment will be too long
            let text = '';
            for (let i = 0; i < 101; i++) {
                text += 'abcdefghij';
            }

            body = { text };
            const req = mockRequest({
                body
            });
            const res = mockResponse();
            const next = mockNext();

            await validateComment(req, res, next);

            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.send).toHaveBeenCalledWith({
                errors: expect.objectContaining({
                    text: 'maxLength'
                })
            });
        });
    });
});