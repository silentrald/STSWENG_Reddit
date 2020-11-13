const Ajv = require('ajv');
const { ajvErrors } = require('../middlewares/ajvHelper');

const ajv = new Ajv({ allErrors: true, jsonPointers: true });

ajv.addSchema({
    type: 'object',
    properties: {
        int: { type: 'integer' },
        string: {
            type: 'string',
            maxLength: 10
        }
    },
    required: [
        'int'
    ]
}, 'SAMPLE');

describe('UNIT TEST: ajvErrors Function', () => {
    test('Test Format', () => {
        ajv.validate('SAMPLE', {
            int: 'wrong',
            string: 'aaaaaaaaaaa'
        });

        const errors = ajvErrors(ajv);
        
        expect(errors).toEqual(
            expect.objectContaining({
                int: 'type',
                string: 'maxLength'
            })
        );
    });

    test('Test Required', () => {
        ajv.validate('SAMPLE', {
            string: 'aaaaaaaaaa'
        });

        const errors = ajvErrors(ajv);
        
        expect(errors).toEqual(
            expect.objectContaining({
                int: 'required'
            })
        );
    });
});