export async function GET_authLogin(req, res) {
    res.locals.message = req.flash('error')
    console.log('this is the flash value '+ res.locals.message)
    res.render('auth/login.hbs', { layout: 'main'  })
}

export async function GET_authRegister(req, res) {
    res.render('auth/register.hbs', { layout: 'main', user: req.user, message: req.flash('error') })
}

