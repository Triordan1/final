const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const session = require('express-session');
router.use(session({
  secret:"uDPZH0ZRe6"
}));
/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('login', { title: 'login',success: "false" });
    
});
router.get('/front', function(req, res, next){
    if (req.session && req.session.username && req.session.password) { //maybe fix later password123
        res.render('index', { layout: false, username: req.session.username, userId: req.session.userId });
    }
    else {
        delete req.session.password;
        delete req.session.username;
        res.redirect('/routes/');
    }
});
router.post('/login', function(req, res, next) {
    var success = false;
    var errorMessage = "";
    var username = req.body.username;
    var password = req.body.password;
    const connection = mysql.createConnection({
        host: 'mcldisu5ppkm29wf.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
        user: 'hjj9j8k3hg4vez58',
        password: 'wq66tam2usicvai5',
        database: 'a5d1v7oost97gtf1'
      });
    connection.connect();
    connection.query(`
SELECT *
FROM user_table
WHERE Username = "${username}"
`, function(error, results, fields){
        console.log(results);
        if (error) throw error;
        if (results.length === 0){
            delete req.session.username;
            console.log("username");
            res.json({
               error: "Incorrect username and/or password!"
            });
        }//else if (results[0].password !== password){
        //     delete req.session.username;
        //     console.log("password");
        //     console.log("why?");
        //     res.json({
        //         error: "Incorrect username and/or password!"
        //     });
        else {
            console.log(req.session.userId);
            req.session.username = username;
            req.session.password = "admin1";
            req.session.userId = results[0].userId;
            console.log("success");
            console.log(req.session.username);
            console.log(req.session.password);
            res.json({
                success: true,
                loggedIn: req.session.username,
                userId: req.session.userId
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
router.post("/getAppointments",function (req,res,next) {
    console.log(req.body);
    const dconnection = mysql.createConnection({
        host: 'mcldisu5ppkm29wf.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
        user: 'hjj9j8k3hg4vez58',
        password: 'wq66tam2usicvai5',
        database: 'a5d1v7oost97gtf1'
      });
      dconnection.connect();
      dconnection.query(`
SELECT *
FROM schedule_table;`,
function(error, results, fields){
        console.log("here are the timeSlots: ", results);
        console.log(error);
        if (error) throw error;
            res.json({
                response: "Successfully retrieved timeSlots",
                retrievedTimeSlots: results
            });
    });
    dconnection.end();
});
router.post("/deleteAppointment",function (req,res,next) {
    console.log(req.body);
    let reviewId = req.body.reviewid;
    console.log("js id", reviewId);
    const dconnection = mysql.createConnection({
        host: 'mcldisu5ppkm29wf.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
        user: 'hjj9j8k3hg4vez58',
        password: 'wq66tam2usicvai5',
        database: 'a5d1v7oost97gtf1'
      });
      dconnection.connect();
      dconnection.query(`
      DELETE
      FROM schedule_table
      WHERE ScheduleId = "${reviewId}"
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
router.post("/addAppointment",function (req,res,next) {
    console.log(req.body);
    let date = req.body.Date;
    let start = req.body.Start;
    let end = req.body.End;
    console.log(req.session.userid);
    console.log(date); 
    const dconnection = mysql.createConnection({
        host: 'mcldisu5ppkm29wf.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
        user: 'hjj9j8k3hg4vez58',
        password: 'wq66tam2usicvai5',
        database: 'a5d1v7oost97gtf1'
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