var express=require("express");
var path = require ('path')
var configPath = path.join(__dirname,'../config.js')
var connection = require(configPath);
 
module.exports.addSkills= function(req,res){
    var email=req.body.email;
    // getUserID(email);
    console.log("user id from session ");
    console.log(req.session.user_id)
var j;
console.log("skill before split = "+req.body.skill);
var split_skill= req.body.skill.split(",");
var skills = Object.keys(split_skill).map(function(key) {
    return [split_skill[key]];
  });
 console.log("skills length= "+skills.length);

console.log("skills = "+skills);
connection.query("SELECT Skill_id FROM Skill WHERE Skill_name IN (?)",[skills], function(err, results){
            if(err) {
                console.log("error select from skill table");
            } else {
            console.log(results);
            var user_id=req.session.user_id;
           has_skill = Object.keys(results).map(function(key) {
                return [user_id,results[key].Skill_id];
              });
              skill_IDs =  Object.keys(results).map(function(key) {
                return [results[key].Skill_id];
              });
              console.log(has_skill);
              connection.query("INSERT INTO Has_skill ( User_id1, Skill_id2) VALUES ?", [has_skill], function(err1, result) {
                if(err1){
                    console.log("error in insert has_skill");
                    console.log(err1);

                }else{
         
                        res.redirect('/home.html');
                }
            });

        }
        });
 
}

