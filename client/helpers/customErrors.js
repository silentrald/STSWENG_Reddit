/**
 * Sets the property(field) to a custom error
 * message found in custom object(param)
 *
 * @param {object} errors cleaned error of ajvErrors
 * @param {object} custom custom error message object
 * @returns {string} The custom error messsage
 */
export default function (errors, custom) {
  for (const field in errors) {
    errors[field] = custom[field]
      ? (
        custom[field][errors[field]]
          ? custom[field][errors[field]]
          : new Error(`Error Msg of ${errors} in field ${field} was not defined`)
      ) : new Error(`Field ${field} was not found in custom error msg`)
  }
  return errors
}
