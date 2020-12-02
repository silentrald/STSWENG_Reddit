const {
    validateSubcomment
} = require('../../middlewares/subcommentMw');

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


describe('Unit Testing: subcommentMw', () => {
    describe('Middleware: validateSubcomment', () => {
        let subcomment = {};

        beforeEach(() => {
            subcomment = {
                parentComment: 'cdummydummy',
                text: 'Sample Text',
                station: 'SampleStation'
            };
        });

        test('GOOD', async () => {
            const req = mockRequest({
                body: subcomment
            });
            const res = mockResponse();
            const next = mockNext();
            
            await validateSubcomment(req, res, next);

            expect(next).toHaveBeenCalledTimes(1);
        });

        describe('BAD: parentComment', () => {
            test('Wrong Type', async () => {
                subcomment.parentComment = 1;

                const req = mockRequest({
                    body: subcomment
                });
                const res = mockResponse();
                const next = mockNext();
                
                await validateSubcomment(req, res, next);
    
                expect(next).toHaveBeenCalledTimes(0);
                expect(res.status).toHaveBeenCalledWith(403);
                expect(res.send).toHaveBeenCalledWith({
                    errors: {
                        parentComment: 'type'
                    }
                });
            });

            test('Empty', async () => {
                subcomment.parentComment = '';

                const req = mockRequest({
                    body: subcomment
                });
                const res = mockResponse();
                const next = mockNext();
                
                await validateSubcomment(req, res, next);
    
                expect(next).toHaveBeenCalledTimes(0);
                expect(res.status).toHaveBeenCalledWith(403);
                expect(res.send).toHaveBeenCalledWith({
                    errors: {
                        parentComment: 'minLength'
                    }
                });
            });

            test('Too Long', async () => {
                subcomment.parentComment = 'caaaaaaaaaaaaaa';

                const req = mockRequest({
                    body: subcomment
                });
                const res = mockResponse();
                const next = mockNext();
                
                await validateSubcomment(req, res, next);
    
                expect(next).toHaveBeenCalledTimes(0);
                expect(res.status).toHaveBeenCalledWith(403);
                expect(res.send).toHaveBeenCalledWith({
                    errors: {
                        parentComment: 'maxLength'
                    }
                });
            });

            test('Wrong Pattern', async () => {
                subcomment.parentComment = 'aaaaaaaaaaa';

                const req = mockRequest({
                    body: subcomment
                });
                const res = mockResponse();
                const next = mockNext();
                
                await validateSubcomment(req, res, next);
    
                expect(next).toHaveBeenCalledTimes(0);
                expect(res.status).toHaveBeenCalledWith(403);
                expect(res.send).toHaveBeenCalledWith({
                    errors: {
                        parentComment: 'pattern'
                    }
                });
            });
        });

        describe('BAD: text', () => {
            test('Wrong Type', async () => {
                subcomment.text = 1;

                const req = mockRequest({
                    body: subcomment
                });
                const res = mockResponse();
                const next = mockNext();
                
                await validateSubcomment(req, res, next);
    
                expect(next).toHaveBeenCalledTimes(0);
                expect(res.status).toHaveBeenCalledWith(403);
                expect(res.send).toHaveBeenCalledWith({
                    errors: {
                        text: 'type'
                    }
                });
            });

            test('Empty', async () => {
                subcomment.text = '';

                const req = mockRequest({
                    body: subcomment
                });
                const res = mockResponse();
                const next = mockNext();
                
                await validateSubcomment(req, res, next);
    
                expect(next).toHaveBeenCalledTimes(0);
                expect(res.status).toHaveBeenCalledWith(403);
                expect(res.send).toHaveBeenCalledWith({
                    errors: {
                        text: 'minLength'
                    }
                });
            });

            test('Empty Whitespace', async () => {
                subcomment.text = '     ';

                const req = mockRequest({
                    body: subcomment
                });
                const res = mockResponse();
                const next = mockNext();
                
                await validateSubcomment(req, res, next);
    
                expect(next).toHaveBeenCalledTimes(0);
                expect(res.status).toHaveBeenCalledWith(403);
                expect(res.send).toHaveBeenCalledWith({
                    errors: {
                        text: 'minLength'
                    }
                });
            });

            test('Too Long', async () => {
                subcomment.text = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';

                const req = mockRequest({
                    body: subcomment
                });
                const res = mockResponse();
                const next = mockNext();
                
                await validateSubcomment(req, res, next);
    
                expect(next).toHaveBeenCalledTimes(0);
                expect(res.status).toHaveBeenCalledWith(403);
                expect(res.send).toHaveBeenCalledWith({
                    errors: {
                        text: 'maxLength'
                    }
                });
            });
        });

        describe('BAD: station', () => {
            test('Wrong Type', async () => {
                subcomment.station = 1;

                const req = mockRequest({
                    body: subcomment
                });
                const res = mockResponse();
                const next = mockNext();
                
                await validateSubcomment(req, res, next);
    
                expect(next).toHaveBeenCalledTimes(0);
                expect(res.status).toHaveBeenCalledWith(403);
                expect(res.send).toHaveBeenCalledWith({
                    errors: {
                        station: 'type'
                    }
                });
            });

            test('Empty', async () => {
                subcomment.station = '';

                const req = mockRequest({
                    body: subcomment
                });
                const res = mockResponse();
                const next = mockNext();
                
                await validateSubcomment(req, res, next);
    
                expect(next).toHaveBeenCalledTimes(0);
                expect(res.status).toHaveBeenCalledWith(403);
                expect(res.send).toHaveBeenCalledWith({
                    errors: {
                        station: 'minLength'
                    }
                });
            });

            test('Too Long', async () => {
                subcomment.station = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';

                const req = mockRequest({
                    body: subcomment
                });
                const res = mockResponse();
                const next = mockNext();
                
                await validateSubcomment(req, res, next);
    
                expect(next).toHaveBeenCalledTimes(0);
                expect(res.status).toHaveBeenCalledWith(403);
                expect(res.send).toHaveBeenCalledWith({
                    errors: {
                        station: 'maxLength'
                    }
                });
            });

            test('With Space', async () => {
                subcomment.station = 'asdf asdf';

                const req = mockRequest({
                    body: subcomment
                });
                const res = mockResponse();
                const next = mockNext();
                
                await validateSubcomment(req, res, next);
    
                expect(next).toHaveBeenCalledTimes(0);
                expect(res.status).toHaveBeenCalledWith(403);
                expect(res.send).toHaveBeenCalledWith({
                    errors: {
                        station: 'pattern'
                    }
                });
            });
        });
    });
});