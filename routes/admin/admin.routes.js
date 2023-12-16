import { Router } from 'express'
export const adminRouter = Router()
import adminController from '../../controllers/admin.js'
import auth from '../../middleware/auth.js'

adminRouter.get('/', auth.checkAuth, adminController.getRoot)