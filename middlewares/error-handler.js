module.exports = {
  generalErrorHandler: (err, req, res, next) => {
    if (err instanceof Error) {
      req.flash('error', `${err.name}: ${err.message}`)
    } else {
      req.flash('error', `${err}`)
    }
    res.redirect('back')
    next(err)
  },
  apiErrorHandler: (err, req, res, next) => {
    const status = err instanceof Error && err.status ? err.status : 500
    const message = err instanceof Error ? `${err.name}: ${err.message}` : `${err}`

    console.error(err)

    res.status(status).json({
      status: 'error',
      message
    })
  }
}
