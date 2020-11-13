const ajvHelper = {
    ajvErrors: (ajv) => {
        const errors = ajv.errors.reduce((obj, { keyword, dataPath, params }) => {
            if (keyword === 'required') {
                obj[ params.missingProperty ] = keyword;
            } else {
                obj[ dataPath.substr(1) ] = keyword;
            }
            return obj;
        }, {});

        console.log(`ajv.errorsText: ${ajv.errorsText()}`);
        console.log(`ajv.errors: ${ajv.errors}`);
        console.log(`clean errors: ${errors}`);

        return errors;
    }
};

module.exports = ajvHelper;