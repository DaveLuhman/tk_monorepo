import TimeEntry from '../models/timeEntry.js'
import User from '../models/user.js'
import Customer from '../models/customer.js'

const adminController = {}
export default adminController

adminController.getRoot = async (req, res) => {
    const { id } = req.user
    console.log(id)
    const loggedInUser = await User.findById(id, { company: 1 })
    console.log();
    const userCompany = await Customer.findById(loggedInUser.company, { rootDomain: 1 })
    console.log('root Domain' + userCompany)
    const timeEntries = await TimeEntry.find({sourceURL: {$eq: 'time.'+userCompany.rootDomain}})
    res.render('admin/dashboard', { timeEntries })
}