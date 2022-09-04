const Login = require("../models/LoginModel");

exports.index = (req, res) => {
  if (req.session.user) return res.render("logged");
  return res.render("login");
};

exports.register = async function (req, res) {
  try {
    const login = new Login(req.body);
    await login.regiter();

    if (login.errors.length > 0) {
      req.flash("errors", login.errors);
      req.session.save(function () {
        return res.redirect("/login/index");
      });
      return;
    }

    if (login.errors.length === 0) {
      req.flash("success", "Account created with success!");
      req.session.save(function () {
        return res.redirect("/login/index");
      });
    }
  } catch (e) {
    console.log(e);
    return res.render("404");
  }
};

exports.login = async function (req, res) {
  try {
    const login = new Login(req.body);
    await login.login();

    if (login.errors.length > 0) {
      req.flash("errors", login.errors);
      req.session.save(function () {
        return res.redirect("/login/index");
      });
      return;
    }

    req.flash("success", "Login Done!");
    req.session.user = login.user;
    req.session.save(function () {
      return res.redirect("/login/index");
    });
  } catch (e) {
    console.log(e);
    return res.render("404");
  }
};

exports.logout = function (req, res) {
  req.session.destroy();
  res.redirect("/");
};
