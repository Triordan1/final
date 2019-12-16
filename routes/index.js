var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    console.log("checking success", req.query.success);
if(req.session && req.session.username && req.session.username.length){
  res.render('user', { title: req.session.username, success: "true", loggedIn: req.session.username});
  return;
}
    res.render('login', { title: 'login',success: "false" });
    
});
module.exports;