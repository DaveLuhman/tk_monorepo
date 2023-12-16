import TimeEntry from '../models/timeEntry.js'
import User from '../models/user.js'

const adminController = {}
export default adminController

adminController.getRoot = (req, res) => {
    const { id } = req.user
    const company = User.findById(id)
    res.render('admin/dashboard')
}