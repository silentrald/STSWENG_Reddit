const ajvHelper = {
    /**
     * Converts the `ajv.errors()` array into a cleaner
     * object. Also consoles the errors to the server
     * logs.
     * 
     * @param {array} ajv ajv.errors()
     * @returns {object}
     */
    ajvErrors: (ajv) => {
        const errors = ajv.errors.reduce((obj, { keyword, dataPath, params }) => {
            if (keyword === 'if') {
                return obj;
            } else if (keyword === 'required') {
                obj[ params.missingProperty ] = keyword;
            } else {
                obj[ dataPath.substr(1) ] = keyword;
            }
            return obj;
        }, {});

        // console.log(ajv.errorsText());
        // console.log(ajv.errors);
        console.log(errors);

        return errors;
    }
};

module.exports = ajvHelper;