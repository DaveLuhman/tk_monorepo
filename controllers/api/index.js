import sanitizer from './sanitizer.js'
import createMongoDocument from './mongo.js'
import { sendgridTemplateAPICall as sendEmail } from './sendgrid.js'
const controller = {}

// route terminator that sanitizes input, creates the doc in the database, then sends the email and returns 202 Accepted
controller.submit = async (req, res) => {
    try {
        const doc = sanitizer(req.body)
        await createMongoDocument(doc)
        sendEmail(doc)
        res.status(202).send('Accepted');
    }
    catch (err) {
        console.log(err.message)
    }
}


export default controller
