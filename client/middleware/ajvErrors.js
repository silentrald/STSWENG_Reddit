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
