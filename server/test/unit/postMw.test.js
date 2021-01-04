const {
    validateStationParam,
    validatePostParam,
    validateStationPost,
    sanitizePostsQuery
} = require('../../middlewares/postMw');

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

describe('Unit Testing: postMw', () => {
    describe('Middleware: validateStationParam', () => {
        test('GOOD', async () => {
            const req = mockRequest({
                params: {
                    station: 'SampleStation'
                }
            });
            const res = mockResponse();
            const next = mockNext();

            await validateStationParam(req, res, next);

            expect(next).toHaveBeenCalledTimes(1);
        });

        test('BAD: pattern', async () => {
            const req = mockRequest({
                params: {
                    station: 'Sample Station'
                }
            });
            const res = mockResponse();
            const next = mockNext();

            await validateStationParam(req, res, next);

            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.send).toHaveBeenCalledWith({
                errors: {
                    station: 'pattern'
                }
            });
        });
    });

    describe('Middleware: validatePostParam', () => {
        test('GOOD', async () => {
            const req = mockRequest({
                params: {
                    post: 'pdummydummy'
                }
            });
            const res = mockResponse();
            const next = mockNext();

            await validatePostParam(req, res, next);

            expect(next).toHaveBeenCalledTimes(1);
        });

        test('BAD: pattern', async () => {
            const req = mockRequest({
                params: {
                    post: 'Sample-post'
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

    describe('Middleware: sanitizePostsQuery', () => {
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

            await sanitizePostsQuery(req, res, next);

            expect(next).toHaveBeenCalledTimes(1);
            expect(req.query).toEqual({
                offset: 0,
                limit: LIMIT,
                sort: 'DESC'
            });
        });

        test('GOOD: Valid query', async () => {
            query = {
                offset: 1,
                limit: 8,
                sort: 'ASC'
            };
            const req = mockRequest({
                query
            });
            const res = mockResponse();
            const next = mockNext();

            await sanitizePostsQuery(req, res, next);

            expect(next).toHaveBeenCalledTimes(1);
            expect(req.query).toEqual(query);
        });

        describe('GOOD: sanitize offset', () => {
            test('Invalid type', async () => {
                query.offset = 'hello';
                const req = mockRequest({
                    query
                });
                const res = mockResponse();
                const next = mockNext();
    
                await sanitizePostsQuery(req, res, next);
    
                expect(next).toHaveBeenCalledTimes(1);
                expect(req.query).toEqual({
                    offset: 0,
                    limit: LIMIT,
                    sort: 'DESC'
                });
            });

            test('Negative Number', async () => {
                query.offset = -2;
                const req = mockRequest({
                    query
                });
                const res = mockResponse();
                const next = mockNext();
    
                await sanitizePostsQuery(req, res, next);
    
                expect(next).toHaveBeenCalledTimes(1);
                expect(req.query).toEqual({
                    offset: 0,
                    limit: LIMIT,
                    sort: 'DESC'
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
    
                await sanitizePostsQuery(req, res, next);
    
                expect(next).toHaveBeenCalledTimes(1);
                expect(req.query).toEqual({
                    offset: 0,
                    limit: LIMIT,
                    sort: 'DESC'
                });
            });

            test('Zero', async () => {
                query.limit = 0;
                const req = mockRequest({
                    query
                });
                const res = mockResponse();
                const next = mockNext();
    
                await sanitizePostsQuery(req, res, next);
    
                expect(next).toHaveBeenCalledTimes(1);
                expect(req.query).toEqual({
                    offset: 0,
                    limit: LIMIT,
                    sort: 'DESC'
                });
            });

            test('Negative Number', async () => {
                query.limit = -2;
                const req = mockRequest({
                    query
                });
                const res = mockResponse();
                const next = mockNext();
    
                await sanitizePostsQuery(req, res, next);
    
                expect(next).toHaveBeenCalledTimes(1);
                expect(req.query).toEqual({
                    offset: 0,
                    limit: LIMIT,
                    sort: 'DESC'
                });
            });
        });

        describe('GOOD: sanitize sort', () => {
            test('Valid (ASC)', async () => {
                query.sort = 'ASC';
                const req = mockRequest({
                    query
                });
                const res = mockResponse();
                const next = mockNext();
    
                await sanitizePostsQuery(req, res, next);
    
                expect(next).toHaveBeenCalledTimes(1);
                expect(req.query).toEqual({
                    offset: 0,
                    limit: LIMIT,
                    sort: 'ASC'
                });
            });

            test('Valid (DESC)', async () => {
                query.sort = 'DESC';
                const req = mockRequest({
                    query
                });
                const res = mockResponse();
                const next = mockNext();
    
                await sanitizePostsQuery(req, res, next);
    
                expect(next).toHaveBeenCalledTimes(1);
                expect(req.query).toEqual({
                    offset: 0,
                    limit: LIMIT,
                    sort: 'DESC'
                });
            });

            test('Invalid String', async () => {
                query.sort = 'asdf';
                const req = mockRequest({
                    query
                });
                const res = mockResponse();
                const next = mockNext();
    
                await sanitizePostsQuery(req, res, next);
    
                expect(next).toHaveBeenCalledTimes(1);
                expect(req.query).toEqual({
                    offset: 0,
                    limit: LIMIT,
                    sort: 'DESC'
                });
            });

            test('Invalid type', async () => {
                query.sort = 0;
                const req = mockRequest({
                    query
                });
                const res = mockResponse();
                const next = mockNext();
    
                await sanitizePostsQuery(req, res, next);
    
                expect(next).toHaveBeenCalledTimes(1);
                expect(req.query).toEqual({
                    offset: 0,
                    limit: LIMIT,
                    sort: 'DESC'
                });
            });
        });

        describe('GOOD: sanitize topsort', () => {
            test('Valid (hour)', async () => {
                query.top = 'hour';
                const req = mockRequest({
                    query
                });
                const res = mockResponse();
                const next = mockNext();
    
                await sanitizePostsQuery(req, res, next);
    
                expect(next).toHaveBeenCalledTimes(1);
                expect(req.query).toEqual({
                    offset: 0,
                    limit: LIMIT,
                    sort: 'DESC',
                    top: 'hour'
                });
            });

            test('Valid (day)', async () => {
                query.top = 'day';
                const req = mockRequest({
                    query
                });
                const res = mockResponse();
                const next = mockNext();
    
                await sanitizePostsQuery(req, res, next);
    
                expect(next).toHaveBeenCalledTimes(1);
                expect(req.query).toEqual({
                    offset: 0,
                    limit: LIMIT,
                    sort: 'DESC',
                    top: 'day'
                });
            });

            test('Valid (week)', async () => {
                query.top = 'week';
                const req = mockRequest({
                    query
                });
                const res = mockResponse();
                const next = mockNext();
    
                await sanitizePostsQuery(req, res, next);
    
                expect(next).toHaveBeenCalledTimes(1);
                expect(req.query).toEqual({
                    offset: 0,
                    limit: LIMIT,
                    sort: 'DESC',
                    top: 'week'
                });
            });

            test('Valid (month)', async () => {
                query.top = 'month';
                const req = mockRequest({
                    query
                });
                const res = mockResponse();
                const next = mockNext();
    
                await sanitizePostsQuery(req, res, next);
    
                expect(next).toHaveBeenCalledTimes(1);
                expect(req.query).toEqual({
                    offset: 0,
                    limit: LIMIT,
                    sort: 'DESC',
                    top: 'month'
                });
            });

            test('Valid (year)', async () => {
                query.top = 'year';
                const req = mockRequest({
                    query
                });
                const res = mockResponse();
                const next = mockNext();
    
                await sanitizePostsQuery(req, res, next);
    
                expect(next).toHaveBeenCalledTimes(1);
                expect(req.query).toEqual({
                    offset: 0,
                    limit: LIMIT,
                    sort: 'DESC',
                    top: 'year'
                });
            });

            test('Valid (all)', async () => {
                query.top = 'all';
                const req = mockRequest({
                    query
                });
                const res = mockResponse();
                const next = mockNext();
    
                await sanitizePostsQuery(req, res, next);
    
                expect(next).toHaveBeenCalledTimes(1);
                expect(req.query).toEqual({
                    offset: 0,
                    limit: LIMIT,
                    sort: 'DESC',
                    top: 'all'
                });
            });

            test('Invalid String', async () => {
                query.top = 'not';
                const req = mockRequest({
                    query
                });
                const res = mockResponse();
                const next = mockNext();
    
                await sanitizePostsQuery(req, res, next);
    
                expect(next).toHaveBeenCalledTimes(1);
                expect(req.query).toEqual({
                    offset: 0,
                    limit: LIMIT,
                    sort: 'DESC'
                });
            });

            test('Invalid type', async () => {
                query.top = 100;
                const req = mockRequest({
                    query
                });
                const res = mockResponse();
                const next = mockNext();
    
                await sanitizePostsQuery(req, res, next);
    
                expect(next).toHaveBeenCalledTimes(1);
                expect(req.query).toEqual({
                    offset: 0,
                    limit: LIMIT,
                    sort: 'DESC'
                });
            });
        });
    });

    describe('Middleware: validateStationPost', () => {
        let body, user, params;
        beforeEach(() => {
            body = {
                title: 'sample-title',
                text: 'sample-text',
            };
            user = {
                username: 'crewmate'
            };
            params = {
                station: 'SampleStation'
            };
        });

        test('GOOD', async () => {
            const req = mockRequest({ body, user, params });
            const res = mockResponse();
            const next = mockNext();

            await validateStationPost(req, res, next);

            expect(next).toHaveBeenCalledTimes(1);
        });

        test('GOOD with extra whitespaces', async () => {
            body.title += '   ';
            body.text += '     ';
            const req = mockRequest({ body, user, params });
            const res = mockResponse();
            const next = mockNext();

            await validateStationPost(req, res, next);

            expect(next).toHaveBeenCalledTimes(1);
        });

        describe('BAD: Invalid title', () => {
            test('Title wrong type', async () => {
                body.title = 0;
                const req = mockRequest({ body, user, params });
                const res = mockResponse();
                const next = mockNext();

                await validateStationPost(req, res, next);

                expect(res.status).toHaveBeenCalledWith(401);
                expect(res.send).toHaveBeenCalledWith({
                    errors: {
                        title: 'type'
                    }
                });
                expect(next).toHaveBeenCalledTimes(0);
            });

            test('Empty string title', async () => {
                body.title = '';
                const req = mockRequest({ body, user, params });
                const res = mockResponse();
                const next = mockNext();

                await validateStationPost(req, res, next);

                expect(res.status).toHaveBeenCalledWith(401);
                expect(res.send).toHaveBeenCalledWith({
                    errors: {
                        title: 'minLength'
                    }
                });
                expect(next).toHaveBeenCalledTimes(0);
            });

            test('Title is too long', async () => {
                // 65 chars
                body.title = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
                const req = mockRequest({ body, user, params });
                const res = mockResponse();
                const next = mockNext();

                await validateStationPost(req, res, next);

                expect(res.status).toHaveBeenCalledWith(401);
                expect(res.send).toHaveBeenCalledWith({
                    errors: {
                        title: 'maxLength'
                    }
                });
                expect(next).toHaveBeenCalledTimes(0);
            });

            test('No title property', async () => {
                // 65 chars
                delete body.title;
                const req = mockRequest({ body, user, params });
                const res = mockResponse();
                const next = mockNext();

                await validateStationPost(req, res, next);

                expect(res.status).toHaveBeenCalledWith(401);
                expect(res.send).toHaveBeenCalledWith({
                    errors: {
                        title: 'required'
                    }
                });
                expect(next).toHaveBeenCalledTimes(0);
            });
        });

        describe('BAD: Invalid text', () => {
            test('Text wrong type', async () => {
                body.text = 0;
                const req = mockRequest({ body, user, params });
                const res = mockResponse();
                const next = mockNext();

                await validateStationPost(req, res, next);

                expect(res.status).toHaveBeenCalledWith(401);
                expect(res.send).toHaveBeenCalledWith({
                    errors: {
                        text: 'type'
                    }
                });
                expect(next).toHaveBeenCalledTimes(0);
            });

            test('Empty string text', async () => {
                body.text = '';
                const req = mockRequest({ body, user, params });
                const res = mockResponse();
                const next = mockNext();

                await validateStationPost(req, res, next);

                expect(res.status).toHaveBeenCalledWith(401);
                expect(res.send).toHaveBeenCalledWith({
                    errors: {
                        text: 'minLength'
                    }
                });
                expect(next).toHaveBeenCalledTimes(0);
            });

            test('Text is too long', async () => {
                // more than 1000 (1027) chars, tell me if this is too inappropriate please :)
                body.text = `
                    According to all known laws of aviation, there is no way a bee should be 
                    able to fly. Its wings are too small to get its fat little body off the 
                    ground. The bee, of course, flies anyway because bees don't care what humans 
                    think is impossible. Yellow, black. Yellow, black. Yellow, black. Yellow, black. 
                    Ooh, black and yellow! Let's shake it up a little. Barry! Breakfast is ready! 
                    Ooming! Hang on a second. Hello? - Barry? - Adam? - Oan you believe this is 
                    happening? - I can't. I'll pick you up. Looking sharp. Use the stairs. Your father 
                    paid good money for those. Sorry. I'm excited. Here's the graduate. We're very 
                    proud of you, son. A perfect report card, all B's. Very proud. Ma! I got a thing 
                    going here. - You got lint on your fuzz. - Ow! That's me! - Wave to us! We'll be in 
                    row 118,000. - Bye! Barry, I told you, stop flying in the house! - Hey, Adam. - Hey, 
                    Barry. - Is that fuzz gel? - A little. Special day, graduation. Never thought I'd make 
                    it. Three days grade school, three days high school.
                `;
                const req = mockRequest({ body, user, params });
                const res = mockResponse();
                const next = mockNext();

                await validateStationPost(req, res, next);

                expect(res.status).toHaveBeenCalledWith(401);
                expect(res.send).toHaveBeenCalledWith({
                    errors: {
                        text: 'maxLength'
                    }
                });
                expect(next).toHaveBeenCalledTimes(0);
            });

            test('No text property', async () => {
                // 65 chars
                delete body.text;
                const req = mockRequest({ body, user, params });
                const res = mockResponse();
                const next = mockNext();

                await validateStationPost(req, res, next);

                expect(res.status).toHaveBeenCalledWith(401);
                expect(res.send).toHaveBeenCalledWith({
                    errors: {
                        text: 'required'
                    }
                });
                expect(next).toHaveBeenCalledTimes(0);
            });
        });
    });
});