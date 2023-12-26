export async function GET_authLogin (req, res) {
    req.flash('error', "")
    res.render('auth/login.hbs', { layout: 'main' })
}

export async function GET_authRegister (req, res) {
    res.render('auth/register.hbs', { layout: 'main', user: req.user, message: req.flash('error')})
}

export async function POST_authLogout (req, res) {
    res.redirect('/auth/logout')
}