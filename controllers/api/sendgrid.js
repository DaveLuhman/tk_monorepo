import sgMail from '@sendgrid/mail'
import { classes } from '@sendgrid/helpers'
const Personalization = classes.Personalization
sgMail.setApiKey(process.env.SG_API_KEY)

function setEmailTarget(sourceURL) {

    return process.env.TO_EMAIL === undefined ? `time@${sourceURL.substring(5)}` : process.env.TO_EMAIL;
}
async function sendgridTemplateAPICall(jsonDoc) {
    const msg = {
        dynamic_template_data: jsonDoc,
        from: 'donotreply@ado.software',
        templateId: process.env.SG_SUBMISSION_TEMPLATE_ID,
        personalizations: [],
    }
    const personalization = new Personalization()
    const emailTarget = setEmailTarget(jsonDoc.sourceURL)
    personalization.setTo(emailTarget)
    console.log(emailTarget)
    if (jsonDoc.empEmail !== '') {
        personalization.addCc(jsonDoc.empEmail)
    }
    msg.personalizations.push(personalization)
    sgMail.send(msg)
        .then(() => console.info('Mail sent successfully'))
        .catch((error) => {
            console.error(error)

            if (error.response) {
                console.error(error.response.body)
            }
        })
}

export default sendgridTemplateAPICall