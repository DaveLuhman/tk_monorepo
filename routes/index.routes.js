import { Router } from 'express'
import { weeklyDayShift } from '../middleware/util.js'
import indexController from '../controllers/index.js'
export const indexRouter = Router()

// Render Public Landing Page
indexRouter.get('/', weeklyDayShift, indexController.getRoot)

indexRouter.post('/timeEntry', (_req, res) => { res.redirect('/api/timeEntry') })

indexRouter.get('/login', (_req, res) => { res.redirect('/auth/login') })

indexRouter.get('/register', (_req, res) => { res.redirect('/auth/register') })

indexRouter.post('/logout', (_req, res) => { res.redirect('/auth/logout') })
