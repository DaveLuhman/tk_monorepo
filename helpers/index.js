import moment from "moment"
export function getApiUrl() {
    return process.env.BACKEND_URL
}

export function formatDate(date) {
    return moment(date).format('MM-DD-YYYY')
}