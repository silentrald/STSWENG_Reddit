/**
 * Converts ajv.errors to a cleaner object errors
 *
 * @param {array} ajv
 * @return {object} returns a cleaner version of object errors
 */
export default function (ajv) {
  const errors = ajv.errors.reduce((obj, { keyword, dataPath, params }) => {
    if (keyword === 'required') {
      obj[params.missingProperty] = keyword
    } else {
      obj[dataPath.substr(1)] = keyword
    }
    return obj
  }, {})

  return errors
}
