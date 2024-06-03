/**
 * Controller for handling root route requests.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
const indexController = {}

indexController.getRoot = (req, res) => {
  try {
    if (req.hostname.substring(0, 5) === 'time.')
      res.render('timeEntry', { layout: 'timeEntry.hbs' })
    else res.render('index')
  } catch (err) {
    res.send(err.message).status(500)
  }
}

export default indexController
