const {
    validateStationParam,
    validateCreateStation
} = require('../../middlewares/stationMw');

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

describe('Unit Testing: stationMw', () => {
    describe('Middleware: validateStationParam', () => {
        test('GOOD', async () => {
            const req = mockRequest({
                params: {
                    stationName: 'SampleStation'
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
                    stationName: 'Sample Station'
                }
            });
            const res = mockResponse();
            const next = mockNext();

            await validateStationParam(req, res, next);

            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.send).toHaveBeenCalledWith({
                errors: {
                    stationName: 'pattern'
                }
            });
        });
    });

    describe('Middleware: validateCreateStation', () => {
        let body = {};

        beforeEach(() => {
            body = {
                name: 'SampleStation',
                description: 'This is a test station',
                rules: '1. Do not delete this'
            };
        });
        
        test('GOOD', async () => {
            const req = mockRequest({ body });
            const res = mockResponse();
            const next = mockNext();

            await validateCreateStation(req, res, next);

            expect(next).toHaveBeenCalledTimes(1);
            expect(req.body).toEqual({
                name: 'SampleStation',
                description: 'This is a test station',
                rules: '1. Do not delete this'
            });
        });
        
        test('GOOD: no description property', async () => {
            delete body.description;
            const req = mockRequest({ body });
            const res = mockResponse();
            const next = mockNext();

            await validateCreateStation(req, res, next);

            expect(next).toHaveBeenCalledTimes(1);
            expect(req.body).toEqual({
                name: 'SampleStation',
                rules: '1. Do not delete this'
            });
        });
        
        test('GOOD: no rules property', async () => {
            delete body.rules;
            const req = mockRequest({ body });
            const res = mockResponse();
            const next = mockNext();

            await validateCreateStation(req, res, next);

            expect(next).toHaveBeenCalledTimes(1);
            expect(req.body).toEqual({
                name: 'SampleStation',
                description: 'This is a test station'
            });
        });

        test('GOOD: extra whitespaces', async () => {
            body.name = '     ' + body.name + '     ';
            body.description = '     ' + body.description + '     ';
            body.rules = '     ' + body.rules + '     ';

            const req = mockRequest({ body });
            const res = mockResponse();
            const next = mockNext();

            await validateCreateStation(req, res, next);

            expect(next).toHaveBeenCalledTimes(1);
            expect(req.body).toEqual({
                name: 'SampleStation',
                description: 'This is a test station',
                rules: '1. Do not delete this'
            });
        });

        describe('BAD: invalid station name', () => {
            test('Invalid type', async () => {
                body.name = 123;
                const req = mockRequest({ body });
                const res = mockResponse();
                const next = mockNext();
                
                await validateCreateStation(req, res, next);
                
                expect(res.status).toHaveBeenCalledWith(401);
                expect(res.send).toHaveBeenCalledWith({
                    errors: {
                        name: 'type'
                    }
                });
                expect(next).toHaveBeenCalledTimes(0);
            });

            test('Station name is too short', async () => {
                body.name = 'ab';
                const req = mockRequest({ body });
                const res = mockResponse();
                const next = mockNext();
                
                await validateCreateStation(req, res, next);
                
                expect(res.status).toHaveBeenCalledWith(401);
                expect(res.send).toHaveBeenCalledWith({
                    errors: {
                        name: 'minLength'
                    }
                });
                expect(next).toHaveBeenCalledTimes(0);
            });

            test('Station name is too long', async () => {
                body.name = 'abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyz';
                const req = mockRequest({ body });
                const res = mockResponse();
                const next = mockNext();
                
                await validateCreateStation(req, res, next);
                
                expect(res.status).toHaveBeenCalledWith(401);
                expect(res.send).toHaveBeenCalledWith({
                    errors: {
                        name: 'maxLength'
                    }
                });
                expect(next).toHaveBeenCalledTimes(0);
            });

            test('No station name property', async () => {
                delete body.name;
                const req = mockRequest({ body });
                const res = mockResponse();
                const next = mockNext();
                
                await validateCreateStation(req, res, next);
                
                expect(res.status).toHaveBeenCalledWith(401);
                expect(res.send).toHaveBeenCalledWith({
                    errors: {
                        name: 'required'
                    }
                });
                expect(next).toHaveBeenCalledTimes(0);
            });

            test('Station name contains invalid characters', async () => {
                body.name = 'abc+++';
                const req = mockRequest({ body });
                const res = mockResponse();
                const next = mockNext();
                
                await validateCreateStation(req, res, next);
                
                expect(res.status).toHaveBeenCalledWith(401);
                expect(res.send).toHaveBeenCalledWith({
                    errors: {
                        name: 'pattern'
                    }
                });
                expect(next).toHaveBeenCalledTimes(0);
            });
        });

        describe('BAD: invalid description', () => {
            test('Invalid type', async () => {
                body.description = 123;
                const req = mockRequest({ body });
                const res = mockResponse();
                const next = mockNext();
                
                await validateCreateStation(req, res, next);
                
                expect(res.status).toHaveBeenCalledWith(401);
                expect(res.send).toHaveBeenCalledWith({
                    errors: {
                        description: 'type'
                    }
                });
                expect(next).toHaveBeenCalledTimes(0);
            });

            test('Station description is too long', async () => {
                body.description =
                    '01234567890123456789012345678901234567890123456789' +
                    '01234567890123456789012345678901234567890123456789' +
                    '01234567890123456789012345678901234567890123456789' +
                    '01234567890123456789012345678901234567890123456789' +
                    '01234567890123456789012345678901234567890123456789!';
                const req = mockRequest({ body });
                const res = mockResponse();
                const next = mockNext();
                
                await validateCreateStation(req, res, next);
                
                expect(res.status).toHaveBeenCalledWith(401);
                expect(res.send).toHaveBeenCalledWith({
                    errors: {
                        description: 'maxLength'
                    }
                });
                expect(next).toHaveBeenCalledTimes(0);
            });
        });

        describe('BAD: invalid rules', () => {
            test('Invalid type', async () => {
                body.rules = 123;
                const req = mockRequest({ body });
                const res = mockResponse();
                const next = mockNext();
                
                await validateCreateStation(req, res, next);
                
                expect(res.status).toHaveBeenCalledWith(401);
                expect(res.send).toHaveBeenCalledWith({
                    errors: {
                        rules: 'type'
                    }
                });
                expect(next).toHaveBeenCalledTimes(0);
            });

            test('Station rules is too long', async () => {
                body.rules =
                    '01234567890123456789012345678901234567890123456789' +
                    '01234567890123456789012345678901234567890123456789' +
                    '01234567890123456789012345678901234567890123456789' +
                    '01234567890123456789012345678901234567890123456789' +
                    '01234567890123456789012345678901234567890123456789' +
                    '01234567890123456789012345678901234567890123456789' +
                    '01234567890123456789012345678901234567890123456789' +
                    '01234567890123456789012345678901234567890123456789' +
                    '01234567890123456789012345678901234567890123456789' +
                    '01234567890123456789012345678901234567890123456789' +
                    '01234567890123456789012345678901234567890123456789' +
                    '01234567890123456789012345678901234567890123456789' +
                    '01234567890123456789012345678901234567890123456789' +
                    '01234567890123456789012345678901234567890123456789' +
                    '01234567890123456789012345678901234567890123456789' +
                    '01234567890123456789012345678901234567890123456789' +
                    '01234567890123456789012345678901234567890123456789' +
                    '01234567890123456789012345678901234567890123456789' +
                    '01234567890123456789012345678901234567890123456789' +
                    '01234567890123456789012345678901234567890123456789!';
                const req = mockRequest({ body });
                const res = mockResponse();
                const next = mockNext();
                
                await validateCreateStation(req, res, next);
                
                expect(res.status).toHaveBeenCalledWith(401);
                expect(res.send).toHaveBeenCalledWith({
                    errors: {
                        rules: 'maxLength'
                    }
                });
                expect(next).toHaveBeenCalledTimes(0);
            });
        });
    });
});