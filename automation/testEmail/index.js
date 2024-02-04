import sgMail from '@sendgrid/mail'
sgMail.setApiKey(process.env.SG_API_KEY)

async function testEmail() {
  const msg = {
    from: 'donotreply@ado.software',
    to: ['reporting@ado.software', process.env.TO_EMAIL],
    subject: 'Timekeeper Test Submission Inc.',
    text: 'This is your notice of a weekly test about to trigger. If you do not receive an timecard from Johnny Test, please contact product support.',
  }
  sgMail
    .send(msg)
    .then(() =>
      console.info(
        'Weekly Test Notification sent successfully to ' + process.env.TO_EMAIL
      )
    )
    .catch((error) => {
      console.error(error)
    })
}

export default testEmail
