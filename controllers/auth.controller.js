function getSignup(req, res) {
  res.render('customer/auth/singup');
}

function getLogin(req, res) {
  //..
}

module.exports = {
  getSignup: getSignup,
  getLogin: getLogin,
};
