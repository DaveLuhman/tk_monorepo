import TimeEntry from '../models/timeEntry.js'
import User from '../models/user.js'
import Customer from '../models/customer.js'
import { paginate } from '../middleware/util.js'

const adminController = {}
export default adminController

adminController.getRoot = async (req, res) => {
    const { id } = req.user
    const user = await User.findById(id)
    const userCompany = await Customer.findById(user.company)
    let timeEntries = await TimeEntry.find({sourceURL: {$eq: 'time.'+userCompany.rootDomain}})
    const { trimmedData, page, pageCount  } = paginate(timeEntries, req.query.page || 1, 10)
    res.locals.pagination = {page, pageCount}
    res.render('admin/dashboard', { timeEntries })
}