const request = require('supertest');
const server = require('../app');

test('Test Example', done => {
    expect(1 + 1).toEqual(2);
    done();
});

test('HTTP Request', done => {
    request(server)
        .get('/api/index')
        .then(res => {
            expect(res.statusCode).toEqual(200);
            expect(res.text).toEqual('Hello World');
            done();
        })
        .catch(done);
});

afterAll(() => {
    server.close();
});