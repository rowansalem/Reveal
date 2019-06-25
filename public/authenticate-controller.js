
var path = require ('path');
var configPath = path.join(__dirname,'../config.js');
var connection = require(configPath);
module.exports.authenticate=function(req,res){
    var email=req.body.email;
    var password=req.body.password;
   
    connection.query('SELECT * FROM User WHERE email = ?',[email], function (error, results, fields) {
      if (error) {
          res.json({
            status:false,
            message:'there are some error with query'
            });
      }else{
       
        if(results.length >0){
            if(password==results[0].password){
              req.session.user_id = results[0].User_id;
              console.log(results[0]);
              connection.query('SELECT Job_name FROM Job WHERE Job_id = ?',results[0].Job_id3, function (error1, results1, fields1) {
               if(error1){
                 console.log("error in selecting job_title by job_id");
               }else{
                req.session.Job_title = results1[0].Job_name;
               // console.log("Authentication job name =");
               // console.log(results1[0].Job_name);
                res.redirect('/home.html');
               }
              });

            }else{
                res.json({
                  status:false,
                  message:"Email and password does not match"
                 });
            }
          
        }
        else{
          res.json({
              status:false,    
            message:"Email does not exits"
          });
        }
      }
    });
};
