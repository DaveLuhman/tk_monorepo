import moment from "moment"

/**
 * Formats a date into the 'MM-DD-YYYY' format.
 *
 * @param {Date} date - The date to be formatted.
 * @returns {string} The formatted date string.
 */
export function formatDate(date) {
    return moment(date).format('MM-DD-YYYY')
}