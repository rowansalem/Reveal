var nodemailer = require('nodemailer');
var path = require('path');
var configPath = path.join(__dirname,'/config.js');
var connection = require(configPath);
var handlebars = require('handlebars');
var fs = require('fs');

var transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
          // should be replaced with real sender's account
            user: 'rowan181.rs@gmail.com',
            pass: '********' // Password of sender 
            }
});


var readHTMLFile = function(path, callback) {
    fs.readFile(path, {encoding: 'utf-8'}, function (err, html) {
        if (err) {
            throw err;
            callback(err);
        }
        else {
            callback(null, html);
        }
    });
};


function sendMail(recipientEmail,replacements){
readHTMLFile(__dirname + '/public/email.html', function(err, html) {
    var template = handlebars.compile(html);
    var htmlToSend = template(replacements);
    var mailOptions = {
        from: 'reveal@gmail.com',
        to : recipientEmail,
        subject : 'Reveal Recommendation',
        html : htmlToSend
     };
    transporter.sendMail(mailOptions, function (error, response) {
        if (error) {
            console.log(error);
            callback(error);
        }
    });
});
}

function loadData(){
    connection.query('SELECT Recommended.Vacancy_id4, Recommended.user_id4, User.Email,Vacancy.City , Job.Job_name ,Vacancy.job_category ,\
     Vacancy.job_description ,Vacancy.Job_Date, Vacancy.num_vacancies, Vacancy.salary_maximum ,\
      Vacancy.salary_minimum , Vacancy.career_level from Vacancy,Job,Recommended,User \
      where Vacancy.Job_id2 = Job.Job_id AND Recommended.Vacancy_id4 = Vacancy.Vacancy_id \
    AND Recommended.sent_email=0 And User.User_id=Recommended.user_id4', function (error, results, fields) {
    if (error) {
    console.log(error);
    }else{ 
        for (var i = 2; i < 3 ; i++) {
           replacements={
            Job_name: results[i].Job_name,   //dynamic data for bind into the template
            job_category: results[i].job_category,
            job_description: results[i].job_description,
            City: results[i].City,
            career_level: results[i].career_level,
            salary_minimum: results[i].salary_minimum,
            salary_maximum:results[i].salary_maximum,
            num_vacancies: results[i].num_vacancies,
            Job_Date: results[i].Job_Date
           };
            sendMail(results[i].Email,replacements);
        
                     connection.query("update Recommended set Recommended.sent_email =1 \
                     where Recommended.user_id4= ? AND Recommended.Vacancy_id4 =?",
                     [results[i].user_id4,results[i].Vacancy_id4], function (error1, results1, fields1) {
                         if(error1){
                             console.log("error in set sent_email=1");
                             console.log(error1);
                         }
                     });
        }
       }
   });
   }
//    loadData();
module.exports = {
    loadData
}



