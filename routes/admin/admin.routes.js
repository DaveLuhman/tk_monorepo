import { Router } from 'express'
export const adminRouter = Router()
import { GET_admin, GET_roster, GET_updateTimecard, POST_updateTimecard, POST_deleteTimecard, GET_generateTimecard } from '../../controllers/admin.js'

adminRouter.get('/', GET_admin)
adminRouter.get('/roster', GET_roster)
adminRouter.get('/edit/:id', GET_updateTimecard)
adminRouter.post('/update/:id', POST_updateTimecard)
adminRouter.post('/delete/:id', POST_deleteTimecard)
adminRouter.get('/generate/:id', GET_generateTimecard)