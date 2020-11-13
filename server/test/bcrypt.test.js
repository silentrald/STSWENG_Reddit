const { hashSalt, compare } = require('../modules/bcrypt');

const password = 'somepassword';
let hashed;

describe('UNIT TEST: bcrypt module', () => {
    test('FUNCTION: hashSalt', (done) => {
        hashSalt(password)
            .then((hash) => {
                const length = hash.length;

                expect(length).toBe(60);
                expect(hash).not.toEqual(password);
                
                hashed = hash;
                done();
            })
            .catch(done);
    });

    test('verify password', (done) => {
        compare(password, hashed)
            .then((result) => {
                expect(result).toEqual(true);
                done();
            })
            .catch(done);
    });

    test('wrong password', (done) => {
        compare('random_password', hashed)
            .then((result) => {
                expect(result).toEqual(false);
                done();
            })
            .catch(done);
    });
});