import TimeEntry from '../models/timeEntry.js'
import User from '../models/user.js'
import Customer from '../models/customer.js'

const adminController = {}
export default adminController

adminController.getRoot = async (req, res) => {
    console.log(req.user)
    const { id } = req.user
    const user = await User.findById(id)
    const userCompany = await Customer.findById(user.company)
    const timeEntries = await TimeEntry.find({sourceURL: {$eq: 'time.'+userCompany.rootDomain}})
    res.render('admin/dashboard', { timeEntries, userCompany, user })
}