/**
 * Handles the GET request for the login page.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves when the rendering is complete.
 */
export async function GET_authLogin(req, res) {
  res.locals.message = req.flash('error')
  console.log(res.locals.message)
  res.render('auth/login.hbs', { layout: 'main'  })
}

/**
* Renders the registration page.
*
* @param {Object} req - The request object.
* @param {Object} res - The response object.
* @returns {Promise<void>} - A promise that resolves when the rendering is complete.
*/
export async function GET_authRegister(req, res) {
  res.render('auth/register.hbs', { layout: 'main', user: req.user, message: req.flash('error') })
}
