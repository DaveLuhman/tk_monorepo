import moment from 'moment'
/**
 *
 *
 * @param {*} doc
 * @return {*}
 */
function validateSubmission(req, res, next) {
  const doc = req.body
  try {
    const nameRegex = /^[a-zA-Z ,.'-]+$/iu
    const emailRegex =
      /(?:[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
    if (!nameRegex.test(doc.empName)) {
      throw new Error('Validation failed due to invalid employee name')
    }
    if (doc.empEmail != '' && !emailRegex.test(doc.empEmail))
      throw new Error('Validation failed due to invalid email address')
    if (doc.timeEntries.length <= 0)
      throw new Error('Validation failed due to no attached time entries.')
    doc.timeEntries.forEach((entry) => {
      const entryDateInSeconds = moment(entry.date).unix()
      const todaysDateInSeconds = moment().unix()
      if (todaysDateInSeconds < entryDateInSeconds)
        throw new Error(
          `Validation failed on entry ${entry.date} due to it being in the future`
        )
    })
    next()
  } catch (err) {
    return res.status(400).send(err.message)
  }
}

export default validateSubmission
