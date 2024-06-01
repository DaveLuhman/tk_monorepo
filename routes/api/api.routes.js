import { Router } from 'express'

export const apiRouter = new Router()
import apiController from '../../controllers/api/index.js'
import validator from '../../middleware/validator.js'
import rateLimiter from '../../middleware/rateLimiter.js'

apiRouter.post('/timeEntry', validator, apiController.submit)


