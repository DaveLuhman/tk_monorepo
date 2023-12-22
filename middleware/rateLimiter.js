import Customer from '../models/customer.js'
import Timecard from '../models/timecard.js'

function getRootDomain(url) {
    return String(url.substring(5))
}
function confirmTimeSubdomain(hostname) {
    try {
        if (hostname.substring(0, 5) !== 'time.') return new Error('Invalid Source. Requests must come from time.domain.tld URL')
        return
    } catch (err) {
        return err.message
    }
}
async function getThisMonthsEntriesBySourceURL(hostname) {  // gets this months entries and filters them by the hostname
    try {
        const entries = await Timecard.getThisMonthsEntries()
        entries.filter((entry) => { entry.sourceURL != hostname })
        return entries
    } catch (err) {
        return err.message
    }
}

async function identifyOrCreateCustomer(hostname) {  // gets customer record from MongoDB or creates one if none exists
    try {
        let customer = undefined //init customer variable mutably
        confirmTimeSubdomain(hostname) //throws error if req not from time.* url
        customer = await Customer.findOne({ rootDomain: { $eq: getRootDomain(hostname) } }) // find the customer if they exist in the db
        if (!customer) {
            customer = await Customer.create({ rootDomain: getRootDomain(hostname), paymentTier: 0 }) //create new customer in DB with req's hostname, trimmed for 'time.'
        }
        return customer
    } catch (err) {
        return err.message
    }
}
async function checkEntriesCountAgainstPaymentTier(customer, hostname) {
    let entriesLimit = new Number() //TODO: Fix this long-term problem-causing bullshit
    let entries = await getThisMonthsEntriesBySourceURL(hostname)
    console.log(`${customer.businessName} has submitted ${entries.length} time entries this month.`)
    switch (customer.paymentTier) {
        case 0:  // limit to 10 reports per month
            entriesLimit = 10
            break
        case 1:  // limit to 50 reports per month
            entriesLimit = 50
            break
        case 2:  // unlimited entries
            //no limit, just here to catch this case
            break
    }
    if (entriesLimit <= entries.length) throw new Error('You have exceeded your entry limit for this calendar month.')
    return
}
const rateLimiter = async function rateLimiterWrapper(req, res, next) {
    try {
        const hostname = req.body.sourceURL
        const customer = await identifyOrCreateCustomer(hostname)
        await checkEntriesCountAgainstPaymentTier(customer, hostname)
        next()
    } catch (err) {
        return res.status(429).send(err.message)
    }
}

export default rateLimiter