const ajvHelper = {
    ajvErrors: (ajv) => {
        const errors = ajv.errors.map(({ keyword, dataPath, params }) => {
            if (keyword === 'required') {
                return { field: params.missingProperty, keyword };
            } else {
                return { field: dataPath.substr(1), keyword};
            }
        });

        console.log(`ajv.errorsText: ${ajv.errorsText()}`);
        console.log(`ajv.errors: ${ajv.errors}`);
        console.log(`clean errors: ${errors}`);

        return errors;
    }
};

module.exports = ajvHelper;