function addCsrfToken(req,res,next) {
    res.locals.addCsrfToken = req.addCsrfToken();
    next();
}


module.exports = addCsrfToken;