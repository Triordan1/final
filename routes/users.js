var express = require('express');
var router = express.Router();
var mysql = require("mysql");
const bcrypt = require('bcrypt');
const rounds = 10;
var salt = bcrypt.genSaltSync(rounds);

/* GET users listing. */
router.get('/', function(req, res, next) {
  
  if(req.session && req.session.username && req.session.username.length){
    res.render('user', {logged: req.session.username, loggedIn: true});
    return;
  }
  
  res.render('login', {layout: false});
});
router.post('/new', function (req, res, next) {
  console.log(req.body);
  let availability = false
  let username = req.body.username;
  const connection = mysql.createConnection({
    host: 'p2d0untihotgr5f6.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
    user: 'zsn9kncqtvumywkk',
    password: 'jrj24hhp4uchfj03',
    database: 'pvfhxur2aptwj0sr'
  });
  connection.connect();
  connection.query(`
SELECT username
FROM user_table
WHERE username = "${username}" 
`, function (error, results, fields) {
    console.log(results);
    if (error) throw error;
    //console.log('The quotes are: ', results);
    if (results.length != 0){
      res.json({
        success: false,
        message: "Username already in use"
      });
    }else{
      console.log("here");
      availability = true;
      let result = addUser(availability,req.body.username, req.body.fullname, req.body.password);
      res.json({
          success: true,
          message: "Account made"
        });
    }
  });
   connection.end();
  console.log("over");
});
let addUser = function(e,user,name,pass){
    if (e) {
                let password = bcrypt.hashSync(pass,salt);
                const nconnection = mysql.createConnection({
                    host: 'p2d0untihotgr5f6.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
                    user: 'zsn9kncqtvumywkk',
                    password: 'jrj24hhp4uchfj03',
                    database: 'pvfhxur2aptwj0sr'
            });
            nconnection.connect();
            nconnection.query(`
            INSERT INTO user_table(username,password,fullname) VALUES(?, ?, ?)
`, [user, password, name], (error, results, fields) => {
                    console.log(results);
                    if (error) throw error;
                });
                nconnection.end();
    }
};
router.post("/getbookings",function (req,res,next) {
    console.log(req.body);
    let OwnId = req.session.userid;
  
    const dconnection = mysql.createConnection({
        host: 'p2d0untihotgr5f6.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
        user: 'zsn9kncqtvumywkk',
        password: 'jrj24hhp4uchfj03',
        database: 'pvfhxur2aptwj0sr'
      });
    dconnection.connect();
    dconnection.query(`
    SELECT *
FROM schedule_table
LEFT JOIN user_table
ON user_table.userId = schedule_table.userid
WHERE user_table.userId = "${OwnId}";
`, function(error, results, fields){
        console.log("here are the reviews: ", results);
        console.log(error);
        if (error) throw error;
            res.json({
                response: "Retrieved reviews",
                retrievedReviews: results
            });
    });
    dconnection.end();
});
router.post("/getbooking",function (req,res,next) {
    console.log(req.body);
    let OwnId = req.body.slotId;
    const dconnection = mysql.createConnection({
        host: 'p2d0untihotgr5f6.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
        user: 'zsn9kncqtvumywkk',
        password: 'jrj24hhp4uchfj03',
        database: 'pvfhxur2aptwj0sr'
      });
      dconnection.connect();

    dconnection.query(`
    SELECT *
FROM schedule_table
WHERE sheduleId = "${OwnId}";
`, function(error, results, fields){
        console.log("here are the reviews: ", results);
        console.log(error);
        if (error) throw error;
        res.json({
            response: "Retrieved review",
            retrievedReviews: results
        });
    });
    dconnection.end();
});
router.post("/deleteApp",function (req,res,next) {
    console.log(req.body);
    let reviewId = req.body.reviewid;
    console.log("js id", reviewId);
    const dconnection = mysql.createConnection({
        host: 'p2d0untihotgr5f6.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
        user: 'zsn9kncqtvumywkk',
        password: 'jrj24hhp4uchfj03',
        database: 'pvfhxur2aptwj0sr'
      });
    dconnection.connect();
    dconnection.query(`
    DELETE
FROM schedule_table
WHERE sheduleId = "${reviewId}"
`, function(error, results, fields){
        console.log("reviews: ", results);
        console.log(error);
        if (error) throw error;
            res.json({
                 response: "review deleted"
            });
    });
    
    dconnection.end();
});
router.post("/bookApp", function(req, res, next) {
    console.log(req.body);
    let date = req.body.Date;
    let start = req.body.Start;
    let end = req.body.End;
    console.log(req.session.userid);
    console.log(date);
    const dconnection = mysql.createConnection({
        host: 'p2d0untihotgr5f6.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
        user: 'zsn9kncqtvumywkk',
        password: 'jrj24hhp4uchfj03',
        database: 'pvfhxur2aptwj0sr'
      });
    dconnection.connect();
    dconnection.query(`
    INSERT INTO schedule_table(Start,End,date,userid) VALUES(?, ?, ?, ?)
`, [start, end,date, req.session.userid], (error, results, fields) => {
        console.log(results);
        console.log(error);
        if (error) throw error;
        res.json({
            response: "Review Added"
        });
    });
    dconnection.end();
});

module.exports = router;