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
        rawTimeEntries = await TimeEntry.find({ sourceURL: { $eq: 'time.' + userCompany.rootDomain } }).sort({dateSubmitted: -1})
    }
    // switch(req.params.view){
    //     case('weekly'): groupByWeek(rawTimeEntries)
    //     case('name'): groupByName(rawTimeEntries)
    // }
    const { trimmedData: timeEntries, targetPage:page, pageCount } = paginate(rawTimeEntries, req.query.p || 1, 10)
    res.locals.pagination = { page, pageCount }
    res.locals.timeEntries = timeEntries
    res.render('admin/dashboard')
}

function collectYearsFromEntries([entries]){
    const yearsCollection = new Set()
    entries.forEach((entry)=>{
        yearsCollection.add(moment(entry.dateSubmitted).year())
    })
    return yearsCollection
}

function filterEntriesByYear(year,entry) {
    return moment(entry.dateSubmitted).year() = year
}

function groupByWeek(entries){
    const yearArray = []
    const yearsList =  collectYearsFromEntries(entries)
    yearsList.forEach(function(year) {
        yearArray.push(entries.filter((moment(this.dateSubmitted)).year() === year))
    })
    const weekArray = [] // init array
    for(i=0;i<52;i++){ // create 52 empty child arrays
        weekArray.push([])
    }
    entries.forEach(function (entry){ //iterate through entries
        weekArray[this.week].push(entry)  // add each entry to week array where index=weekOfYear
    })
}