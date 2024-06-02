const allowlist = process.env.ALLOW_LIST //allow any ADO subdomain and the env value
/**
 * Delegate function for determining CORS options.
 *
 * @param {Object} req - The request object.
 * @param {Function} callback - The callback function.
 */
const corsOptionsDelegate = function (req, callback) {
  let corsOptions
  if (allowlist.indexOf(req.header('Origin')) !== -1) {
    corsOptions = { origin: true } // reflect (enable) the requested origin in the CORS response
  } else {
    corsOptions = { origin: false } // disable CORS for this request
  }
  callback(null, corsOptions) // callback expects two parameters: error and options
}
export default corsOptionsDelegate
