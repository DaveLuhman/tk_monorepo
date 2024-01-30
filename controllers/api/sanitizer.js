import moment from 'moment';
/**
 *  converts string to titlecase
 * @param {string} str
 * @returns
 */
export function titleCaseAndTrim(str) {
    return str.toLowerCase().split(' ').map(function (word) {
        return (word.charAt(0).toUpperCase() + word.slice(1));
    }).join(' ').trim();
}

/**
 * takes in a document from the sanitizer and sorts the time entries by date ascending
 * @param {*} doc
 * @returns
 */
function sortSubmission(doc) {
    doc.timeEntries.sort((a, b) => new Date(a.date) - new Date(b.date))
    return doc
}

/**
 * Takes in a document and sanitizes the inputs for human readability and grammatical standards
 * @param {object} doc
 * @return {*}
 */
export default function sanitizeSubmission(doc) {
    try {
        doc.hoursCount = 0;
        doc.overtimeCount = 0;
        doc.punchCount = doc.timeEntries?.length;
        doc.empName = titleCaseAndTrim(doc.empName)    // empName to Title Case and trimmed for leading and trailing spaces
        if (doc.empEmail !== '') { doc.empEmail = doc.empEmail.toLowerCase() }     // if exists, empEmail to lowercase and trimmed for leading and trailing spaces
        doc.timeEntries = doc.timeEntries.filter((entry) => entry.jobName !== '') // remove empty job entries
        doc.timeEntries.forEach((entry) => {
            entry.jobName = titleCaseAndTrim(entry.jobName)
            entry.jobNum = entry.jobNum.toUpperCase()
            entry.date = moment(entry.date).format('MM-DD-yyyy')
            doc.hoursCount += entry.hours
            doc.overtimeCount  += entry.overtime
        })
        return sortSubmission(doc)
    } catch (error) {
        console.log(error)
    }
}