const indexController = {}

indexController.getRoot = (req, res) => {
    try {
        if (req.hostname.substring(0, 5) === 'time.') res.render('timecard', { layout: 'timecard.hbs' })
        else res.render('index')
    } catch (err) {
        res.send(err.message).status(500)
    }
}

export default indexController