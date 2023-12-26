import { Router } from 'express'
export const adminRouter = Router()
import {GET_admin, GET_roster} from '../../controllers/admin.js'

adminRouter.get('/', GET_admin)
adminRouter.get('/roster', GET_roster)