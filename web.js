var express   =    require("express");
var mysql     =    require('mysql');
var bodyParser=     require('body-parser');
var session =  require('express-session') ;
var path = require ('path');
var loadCSV = require('./loadCSV');
var runPython = require('./server_runpython2');
var schedule = require('node-schedule');
var runRecommendation = require('./run_recommendation');
var email = require('./email');

var app       =    express();

var pool      =    mysql.createPool({
    connectionLimit : 100, //important
    host: '127.0.0.1',
  	port	 : 3306,
    user     : 'root',
    password : 'password',
    database : 'JobPosts',
    debug    : false,
	acquireTimeout : 1000000
});

app.use(express.static('public'));

  var j = schedule.scheduleJob('* * /4 * * * ', function(){
    loadCSV.loadCSV();
 setTimeout(function () {
 fill_database();
  },300000); // waiting csv to be loaded in database
 });
 var j = schedule.scheduleJob('* * * /7 * * ', function(){
  runRecommendation.runRecommendation();
  setTimeout(function () {
   email.loadData();
  },260000); // waiting Recommendation script to be Done
 
  });
 

 function fill_database2(){//fill Skill and job_skills table 
  pool.getConnection(function(err,connection){
    if (err) {
      console.log(err);
       res.json({"code" : 100, "status" : "Error in connection database"});
      return;
    }
   connection.query("INSERT INTO Skill (Skill_name) SELECT distinct word_frequency.skill_name FROM word_frequency",function(error3,rows3){
     if(error3){
       console.log("error insert into skill");
       console.log(error3);
     }else{
       connection.query(" UPDATE Skill SET numberOfUsers = 0",function(error4,rows4){
         if(error4){
           console.log("error update skill");

         }else{

       console.log("done Skill insert");

       connection.query('INSERT INTO job_skills (Skill_id4, Job_id4) SELECT Skill.Skill_id , word_frequency.Job_id FROM Skill,word_frequency WHERE Skill.Skill_name = word_frequency.skill_name',function(error5,row5){
       if(error5){
         console.log("error in insert job_skill");
         console.log(error5);

       }else{
         console.log("done job_skills insert");

         connection.release();

     }
     });
     }
     });
   }
 });
});
 }
function fill_database()//fill vacancy and job table
{
  pool.getConnection(function(err,connection){
    if (err) {
      console.log(err);
       res.json({"code" : 100, "status" : "Error in connection database"});
      return;
    }
    connection.query("INSERT INTO Job(Job_name) SELECT DISTINCT job_title FROM wuzzuf",function(error,rows){
    if(error){
      console.log("error insert into job");
    }else{
              console.log("done job insert");

      connection.query(' ALTER TABLE Vacancy CONVERT TO CHARACTER SET utf8;',function(error1,row1){
      if(error1){
        console.log("error in alter vacancy");
      }else{
      connection.query("INSERT INTO Vacancy (city, job_category, job_description, Job_Date,salary_minimum,salary_maximum,num_vacancies,career_level,Job_id2)SELECT distinct wuzzuf.city,wuzzuf.job_category1,wuzzuf.job_description, wuzzuf.post_date ,wuzzuf.salary_minimum ,wuzzuf.salary_maximum ,wuzzuf.num_vacancies,wuzzuf.career_level,Job.Job_id FROM wuzzuf,Job WHERE wuzzuf.job_title= Job.Job_name",function(error2,rows2){
      if(error2){
        console.log(error2);
      }else{
        console.log("done vacancy insert");
        connection.release();
        runPython.runPython();
      }
      });
    }
    });
    }
    });


  });

 setTimeout(function () {
  fill_database2();
},160000); // waiting new frequency to br Done

}

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'html');
app.set('view engine', 'ejs');

var authenticateControllerPath =path.join(__dirname,'/public/authenticate-controller');
var authenticateController=require(authenticateControllerPath);
var registerControllerPath =path.join(__dirname,'/public/register-controller');
var registerController=require(registerControllerPath);
var skillControllerPath =path.join(__dirname,'/public/skills-controller');
var skillController=require(skillControllerPath);


function load_JobCategory(req,res) {

    pool.getConnection(function(err,connection){
        if (err) {
          console.log(err);
		  res.json({"code" : 100, "status" : "Error in connection database"});
          return;
        }

        console.log('handle Database connected as id ' + connection.threadId);

        connection.query("SELECT distinct(job_category) FROM JobPosts.Vacancy ", function(err, rows, fields) {
        connection.release();

            if(!err) {
              console.log('handle Database data is fetched from db');
             // console.log(rows);
                res.json(rows);
            }
            else if (err) throw err;

        });

        connection.on('error', function(err) {
              res.json({"code" : 100, "status" : "Error in connection database"});
              return;
        });
  });
}

function select_city(req,res) {

  pool.getConnection(function(err,connection){
      if (err) {
        console.log(err);
    res.json({"code" : 100, "status" : "Error in connection database"});
        return;
      }

      console.log('select_city connected as id ' + connection.threadId);

      connection.query("SELECT distinct(City) FROM JobPosts.Vacancy ", function(err, rows, fields) {
      connection.release();

          if(!err) {
            console.log('select_city data is fetched from db');
           // console.log(rows);
              res.json(rows);
          }
          else if (err) throw err;

      });

      connection.on('error', function(err) {
            res.json({"code" : 100, "status" : "Error in connection database"});
            return;
      });
});
}

function find_jobTitle_by_jobCategory(req,res, job_category) {

  pool.getConnection(function(err,connection){
    if (err) {
      console.log(err);
       res.json({"code" : 100, "status" : "Error in connection database"});
      return;
    }

    console.log('find_jobTitle_by_jobCategory connected as id ' + connection.threadId);

    connection.query("SELECT distinct job_category, Job_name FROM  JobPosts.Vacancy,JobPosts.Job WHERE (Job_id=Job_id2) AND job_category = ?",job_category, function(err, rows, fields) {
      connection.release();

      if(!err) {
        console.log('find_jobTitle_by_jobCategory data is fetched from db');
        //console.log(rows);
          res.json(rows);
      }
      else if (err) throw err;

  }

  );
  });
}


function chart1_query(req,res, jobtitle) {

  pool.getConnection(function(err,connection){
    if (err) {
      console.log(err);
       res.json({"code" : 100, "status" : "Error in connection database"});
      return;
    }

    console.log('chart1_query connected as id ' + connection.threadId);
    connection.query("SELECT avg((salary_minimum+salary_maximum)/2) as salary,\
    career_level,YEAR(Job_Date) as job_year\
   FROM JobPosts.Vacancy \
   where (SELECT Distinct Job_name FROM JobPosts.Job WHERE  JobPosts.Vacancy.Job_id2=Job.Job_id)=?\
   GROUP BY career_level,YEAR(Job_Date)",jobtitle ,function(err, rows, fields) {
      connection.release();

      if(!err) {
        console.log('chart1_query data is fetched from db');
          res.json(rows);
      }
      else if (err) throw err;

  }

  );

  });
}


function chart2_query(req,res, jobtitle) {

  pool.getConnection(function(err,connection){
    if (err) {
      console.log(err);
       res.json({"code" : 100, "status" : "Error in connection database"});
      return;
    }

    console.log('chart2_query connected as id ' + connection.threadId);
    connection.query("SELECT city, sum(num_vacancies) FROM JobPosts.Vacancy WHERE (SELECT Distinct Job_name FROM JobPosts.Job WHERE  JobPosts.Vacancy.Job_id2=Job.Job_id)=? group by city",jobtitle ,function(err, rows, fields) {
      connection.release();

      if(!err) {
        console.log('chart2_query  data is fetched from db');
          res.json(rows);
      }
      else if (err) throw err;

    }

    );

    });
  }


  function chart3_query(req,res, jobtitle) {

    pool.getConnection(function(err,connection){
      if (err) {
        console.log(err);
         res.json({"code" : 100, "status" : "Error in connection database"});
        return;
      }
  
      console.log('chart3_query connected as id ' + connection.threadId);
      connection.query("SELECT Skill_name,Freq,Job.Job_name FROM JobPosts.word_frequency,Job \
      where Job.Job_id=word_frequency.Job_id\
      And Job.Job_name=?",jobtitle ,function(err, rows, fields) {
                    connection.release();
  
        if(!err) {
          console.log('chart3_query  data is fetched from db');
            res.json(rows);
        }
        else if (err) throw err;
  
      }
  
      );
  
      });
    }
  
  
function find_Skills_by_jobTitle(req,res,job_title){
  pool.getConnection(function(err,connection){
    if (err) {
      console.log(err);
       res.json({"code" : 100, "status" : "Error in connection database"});
      return;
    }

    console.log('find_Skills_by_jobTitle connected as id ' + connection.threadId+'  '+job_title);
    connection.query("SELECT Skill_name FROM JobPosts.Skill,JobPosts.Job,JobPosts.job_skills where (Job.Job_id=job_skills.Job_id4) AND (job_skills.Skill_id4=Skill.Skill_id) AND Job_name = ?",job_title, function(err, rows, fields) {
      connection.release();

      if(!err) {
        console.log('find_Skills_by_jobTitle data is fetched from db');
        console.log(rows);
        res.json(rows);
      }
      else if (err) throw err;

  }

  );
  });
  }


  function find_jobPosts(req,res){
    pool.getConnection(function(err,connection){
      if (err) {
        console.log(err);
         res.json({"code" : 100, "status" : "Error in connection database"});
        return;
      }

      console.log('find_jobPosts connected as id ' + connection.threadId+'  ');
      connection.query("SELECT Vacancy.Vacancy_id ,Vacancy.City , Job.Job_name ,Vacancy.job_category , Vacancy.job_description ,Vacancy.Job_Date, \
      Vacancy.num_vacancies, Vacancy.salary_maximum , Vacancy.salary_minimum , Vacancy.career_level \
      from Vacancy,Job where Vacancy.Job_id2 = Job.Job_id \
      order by Vacancy.Job_Date desc LIMIT 100", function(err, rows, fields) {

        connection.release();

        if(!err) {
          console.log('find_jobPosts data is fetched from db');
          //console.log(rows);
          res.json(rows);
        }
        else if (err) {
          console.log("error in find_jobPosts");
          throw err;
    }
  }

    );
    });
    }

    function  user_veiwed_vacancy(req,res,vacancy_id,user_id){
        pool.getConnection(function(err,connection){
          if (err) {
            console.log(err);
             res.json({"code" : 100, "status" : "Error in connection database"});
            return;
          }
          console.log('user_id'+user_id);

          console.log('view'+vacancy_id);

           user_veiw = {
            User_id3 : user_id ,
            Vacancy_id3: Number(vacancy_id)
             };
          console.log('user_veiwed_vacancy connected as id ' + connection.threadId);
          console.log(user_veiw);
          connection.query('INSERT INTO has_viewed SET ?',user_veiw, function(err, rows, fields) {
            connection.release();
            if(!err) {
              console.log('user_veiwed_vacancy data is fetched from db');
              console.log(rows);
              res.json(rows);
            }
            else if (err) {
              console.log("error in user_veiwed_vacancy insert");
              throw err;
        }
      });
        });
  }




function find_carerLevel_for_jobTitle(req,res, job_title) {

  pool.getConnection(function(err,connection){
    if (err) {
      console.log(err);
       res.json({"code" : 100, "status" : "Error in connection database"});
      return;
    }   

    console.log('find_carerLevel_for_jobTitle connected as id ' + connection.threadId);

    connection.query("SELECT distinct career_level, Job_name FROM  JobPosts.Vacancy,JobPosts.Job WHERE (Job_id=Job_id2) AND Job_name = ?",job_title, function(err, rows, fields) {
      connection.release();

      if(!err) {
        console.log('find_carerLevel_for_jobTitle data is fetched from db');
        //console.log(rows);
          res.json(rows);
      }
      else if (err) throw err;
        
  }

  );
  });
}


function salary_reccomendation(req,res,city, jobtitle,career_level) {

  pool.getConnection(function(err,connection){
    if (err) {
      console.log(err);
       res.json({"code" : 100, "status" : "Error in connection database"});
      return;
    }   

    console.log('chart1_query connected as id ' + connection.threadId);
    connection.query("SELECT Vacancy.City , Job.Job_name , Vacancy.career_level ,\
    avg((salary_minimum+salary_maximum)/2) as average_salary ,\
    avg(salary_minimum) as minimum_salary,\
     max(salary_maximum) as maximum_salary\
         from Vacancy,Job where Vacancy.Job_id2 = Job.Job_id And city=? And Job.Job_name=? And career_level=?\
         GROUP BY career_level,city,Job.Job_name",[city,jobtitle,career_level] ,function(err, rows, fields) {
      connection.release();

      if(!err) {
        console.log('chart1_query data is fetched from db');
          res.json(rows);
      }
      else if (err) throw err;
        
  }

  );

  });
}


var chart_jobtitle;
app.get("/home",function(req,res){
        load_JobCategory(req,res);
});

app.get('/home/:job_category', function(req, res, next) {
  var job_category = req.params.job_category;
  find_jobTitle_by_jobCategory(req,res,job_category);
});

app.get('/jobtitle/:jobtitle', function(req, res, next) {
  var jobtitle = req.params.jobtitle;
  chart2_query(req,res,jobtitle);
});

app.get('/jobtitle2/:jobtitle', function(req, res, next) {
  var jobtitle = req.params.jobtitle;
  chart1_query(req,res,jobtitle);
});

app.get('/jobtitle3/:jobtitle', function(req, res, next) {
  var jobtitle = req.params.jobtitle;
 chart3_query(req,res,jobtitle);
});

app.get('/registration.html', function (req, res) {
  res.sendFile( __dirname + "/public/" + "registration.html" );
});

app.get('/registration/:jobtitle', function(req, res, next) {
  var jobtitle = req.params.jobtitle;
  console.log(jobtitle);
  find_Skills_by_jobTitle(req,res,jobtitle);
});

app.get('/login.html', function (req, res) {
    res.sendFile( __dirname + "/public/" + "login.html" );
});

app.post('/home/:jobtitle1', function(req, res, next) {
   chart_jobtitle = req.params.jobtitle1;
  res.sendFile(__dirname + "/public/" + "chart1.html");
});

app.post('/home/:jobtitle2', function(req, res, next) {
  chart_jobtitle = req.params.jobtitle2;
  res.sendFile(__dirname + "/public/" + "chart2.html");
});

app.post('/home/:jobtitle3', function(req, res, next) {
  chart_jobtitle = req.params.jobtitle3;
  res.sendFile(__dirname + "/public/" + "chart3.html");
});
app.get('/jobtitle', function (req, res) {
    res.json({job_title : chart_jobtitle});
});

app.get('/wall' ,function (req, res) {
  if (!req.session.user_id) {
    res.redirect('/login.html');
  }
  res.sendFile( __dirname + "/public/" + "wall.html",{user_id :req.session.user_id} );
});
app.get('/wall/:vacancy_id' ,function (req, res) {
 var vacancy_id= req.params.vacancy_id;
 var user_id = req.session.user_id;
 user_veiwed_vacancy(req,res,vacancy_id,user_id);
});
app.get('/jobPosts', function(req, res, next) {
    find_jobPosts(req,res);
});

app.get('/city', function(req, res, next) {
  select_city(req,res);
});


app.get('/salary_recommendation/:job_title', function(req, res, next) {
  var job_title = req.params.job_title;
  find_carerLevel_for_jobTitle(req,res,job_title);
});
app.get('/salary_recommendation', function(req, res, next) {
  res.sendFile(__dirname + "/public/" + "chart3.html");
});

app.get('/salary_recommendation/:city/:job_title/:career_level', function(req, res, next) {
  var job_title = req.params.job_title;
  var career_level = req.params.career_level;
  var city = req.params.city;

  salary_reccomendation(req,res,city,job_title,career_level);
});


app.post('/register-controller', registerController.register);
app.post('/authenticate-controller', authenticateController.authenticate);
app.post('/skills-controller', skillController.addSkills);

app.listen(3000);