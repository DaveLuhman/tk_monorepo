import Timecard from '../../models/timecard.js'

/**
 *  creates a document in the database using the submitted doc from the frontend
 * @param {*} doc
 * @returns
 */
export default async function submitMongo(doc) {
    try {
        const document = await Timecard.create(doc)
        console.info('Time Entry Document added to database :' + document)
        return document
    } catch (err) {
        return console.error('Time Entry Document failed to save: ' + err.message)
    }
}
