const express = require('express')
var mysql = require('mysql');
const dotenv = require('dotenv');
dotenv.config({ path: './.env' })
const app = express();
app.use("/assets",express.static("assets"));

const con = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });
  
  con.connect( (err) => {
    if (err){
      console.log(err)
    }else{
    console.log("Connected!");

    }
  });

app.get('/p/secure_key=32/:user_hwid',function(req,res){
      var rq = req.params.user_hwid
      console.log(rq);
      con.query('SELECT * FROM user WHERE user_hwid = ?',[rq], async function(error, results){
        if (results.length > 0){
          res.send("success")
          }
          else{
            con.query('SELECT * FROM hwid_block WHERE blocked = ?',[rq], function(error, data){
              if (data.length > 0){
                res.send("error")
              }
              else{
                con.query(`insert into hwid_block (blocked) values (${rq})`,function(error, results){
                res.send("error2")
              })
              }
            })
      }
    })
})

app.get('/p/ss/secure_key=32/LADSU!HkjsNAQkhdj/:username/:password', function(req,res){
  var us = req.params.username
  var pa = req.params.password
  console.log(us,pa)
  con.query('SELECT * FROM kullanici WHERE username = ?',[us], function(error, hdata){
    if(hdata.length > 0){
      con.query('SELECT * FROM kullanici WHERE password = ?', [pa], function(error, psresult){
        if(psresult.length > 0){
          res.send(psresult)
        }
        else{
          res.send("wrong password")
        }
      })
    }
    else{
      res.send("wrong username")
    }
  })
})

app.get('/p/ss/secure_key=32/LADSU!HkjsNAQkhdj/delete/:id', function(req,res){
  console.log(req.params.id)
  con.query(`Delete from arac1 where id1=${req.params.id}`, function(error, hdata){
    console.log(hdata)
    //if(hdata.length > 0){
      res.send(hdata)
   // }
   //else{
      res.send("wrong id")
  //  }
  })
})

app.listen(80)