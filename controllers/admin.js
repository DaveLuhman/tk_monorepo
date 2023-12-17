import TimeEntry from '../models/timeEntry.js'
import User from '../models/user.js'
import Customer from '../models/customer.js'
import { paginate } from '../middleware/util.js'

const adminController = {}
export default adminController

adminController.getRoot = async (req, res) => {
    let rawTimeEntries = []
    const { id } = req.user
    const user = await User.findById(id)
    if (user.role === 'Admin') { rawTimeEntries = await TimeEntry.find() }
    else {
        const userCompany = await Customer.findById(user.company)
        rawTimeEntries = await TimeEntry.find({ sourceURL: { $eq: 'time.' + userCompany.rootDomain } })
    }
    const { trimmedData: timeEntries, targetPage:page, pageCount } = paginate(rawTimeEntries, req.query.p || 1, 10)
    res.locals.pagination = { page, pageCount }
    res.locals.timeEntries = timeEntries
    res.render('admin/dashboard')
}