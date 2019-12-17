var express = require('express');
var router = express.Router();
const mysql = require('mysql');
const session = require('express-session');
const bcrypt = require('bcrypt');
const Rounds = 10;
var salted = bcrypt.genSaltSync(Rounds);
router.use(session({
  secret:"uDPZH0ZRe6"
}));
router.get('/', function(req, res, next) {
    res.render('login', { layout: false });
});

router.get('/front', function(req, res, next){
    if (req.session && req.session.username && req.session.password && req.session.password === "password") { //maybe fix later password123
        res.render('index', { layout: false });
    }
    else {
        delete req.session.password;
        delete req.session.username;
        res.redirect('/routes/');
    }
});
router.post('/', function(req, res, next) {
    console.log("test");
    var success = false;
    var errorMessage = "";
    var username = req.body.username;
    var password = req.body.password;
      const connection = mysql.createConnection({
        host: 'p2d0untihotgr5f6.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
        user: 'zsn9kncqtvumywkk',
        password: 'jrj24hhp4uchfj03',
        database: 'pvfhxur2aptwj0sr'
      });
      connection.connect();
      connection.query(`
SELECT *
FROM user_table
WHERE username = "${username}"
`, function(error, results, fields){
        console.log(results);
        console.log(bcrypt.compareSync(password,results[0].password));
        if (error) throw error;
        if (results.length === 0){
            delete req.session.username;
            console.log("username");
            res.json({
               error: "Incorrect username and/or password!"
            });
        }else if (!bcrypt.compareSync(password,results[0].password)){
            delete req.session.username;
            console.log("password");
            res.json({
                error: "Incorrect username and/or password!"
            });
        }else {
            req.session.username = username;
            req.session.userid = results[0].userId;
            console.log("success");
            console.log(req.session.username);
            console.log(req.session.userid);
            res.json({
                success: true
            });
        }


    });
    connection.end();

});
     router.get('/signOut', function(req, res, next) {
    var message = "";
    if (req.session && req.session.username) {
        delete req.session.username;
        delete req.session.id;
        if (req.session.password) {
            delete req.session.password;
        }
    }
    else {
        message = "Error, logout has failed! Please try again.";
    }

    res.json({
        successful: true,
        message: message
    });

});

module.exports = router;