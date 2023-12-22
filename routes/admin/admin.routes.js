import { Router } from 'express'
export const adminRouter = Router()
import adminController from '../../controllers/admin.js'
adminRouter.get('/', adminController.getRoot)
adminRouter.get('/roster', adminController.getRoster)