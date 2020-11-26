require('dotenv').config();
const {
    signPromise,
    verifyPromise
} = require('../../modules/jwt');

const dummy = {
    username: 'test',
    email: 'test@gmail.com'
};

describe('UNIT TEST: jwt module', () => {
    test('signPromise & verifyPromise function', (done) => {
        signPromise(dummy)
            .then((token) => {
                return verifyPromise(token);
            })
            .then((data) => {
                expect(data).toEqual(
                    expect.objectContaining({
                        username: dummy.username,
                        email: dummy.email,
                        iat: expect.any(Number)
                    })
                );
                done();
            })
            .catch(done);
    });
});
