//middleware to check if user is loggeg-in. 
exports.checkLogin = function(req, res, next) {

 var login = req.query.login;
 console.log("Login status is " + login);
 req.login = login;

 if (login == 1) {
  console.log('User is logged in.');
  next();
 } else {
  console.log('User is not logged in.');
  res.send("You are not allowed to access this link. Please login first");
 }
}