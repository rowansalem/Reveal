var express=require("express");
var path = require ('path')
var configPath = path.join(__dirname,'../config.js')
var connection = require(configPath);
const app = express();
var user_id=-1;
module.exports.register=function(req,res){
    var user={
        "First_name":req.body.firstName,
        "Last_name":req.body.lastName,
        "User_password":req.body.password,
        "Phone_number":req.body.phonenumber,
        "Email":req.body.email,
        "Gender":req.body.gender,
        "Birthdate":req.body.birthday,
        "PPURL":req.body.profilePicture,
        "Hometown":req.body.hometown
          };

    connection.query('INSERT INTO User SET ?',user, function (error, results, fields) {
      if (error) {
        console.log("error ocurred",error);
        res.send({
          "code":400,
          "failed":"error ocurred"
        });
      }else{
        user_id=results.insertId;
        // module.exports.user_id= user_id;
        req.session.user_id = user_id;
        console.log('The solution is: ', user_id);
        res.sendFile( path.join(__dirname,'/skills.html')); 
      }
    });

}
