import { Router } from 'express'

/**
 * Express router for the admin routes.
 * @type {import('express').Router}
 */
export const adminRouter = Router()

import {
  GET_admin,
  GET_roster,
  GET_updateTimecard,
  POST_updateTimecard,
  POST_deleteTimecard,
} from '../../controllers/admin.js'

/**
 * Route for getting the admin page.
 * @name GET /
 * @function
 * @memberof module:routes/admin/admin.routes
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @returns {void}
 */
adminRouter.get('/', GET_admin)

/**
 * Route for getting the roster.
 * @name GET /roster
 * @function
 * @memberof module:routes/admin/admin.routes
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @returns {void}
 */
adminRouter.get('/roster', GET_roster)

/**
 * Route for getting the timecard update page.
 * @name GET /edit/:id
 * @function
 * @memberof module:routes/admin/admin.routes
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @returns {void}
 */
adminRouter.get('/edit/:id', GET_updateTimecard)

/**
 * Route for updating a timecard.
 * @name POST /update/:id
 * @function
 * @memberof module:routes/admin/admin.routes
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @returns {void}
 */
adminRouter.post('/update/:id', POST_updateTimecard)

/**
 * Route for deleting a timecard.
 * @name POST /delete/:id
 * @function
 * @memberof module:routes/admin/admin.routes
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @returns {void}
 */
adminRouter.post('/delete/:id', POST_deleteTimecard)
