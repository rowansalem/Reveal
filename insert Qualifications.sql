 Select Skill.Skill_id,Skill.Skill_name,Vacancy.Vacancy_id,Vacancy.Job_id2 , Vacancy.job_description from Vacancy,Skill 
 where Skill_name in (SELECT Skill.Skill_name 
       FROM Skill ,job_skills,Vacancy
        WHERE job_skills.Job_id4 = Vacancy.Job_id2 
 ) And Vacancy.job_description Like CONCAT('% ',Skill.Skill_name,' %')


    
