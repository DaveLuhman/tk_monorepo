import { Router } from 'express'
export const adminRouter = Router()
import {GET_admin, GET_roster,  GET_updateTimecard, POST_updateTimecard} from '../../controllers/admin.js'

adminRouter.get('/', GET_admin)
adminRouter.get('/roster', GET_roster)
adminRouter.get('/edit/:id', GET_updateTimecard)
adminRouter.post('/edit/:id', POST_updateTimecard)