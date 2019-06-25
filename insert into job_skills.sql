INSERT INTO job_skills (Skill_id4, Job_id4)
SELECT Skill.Skill_id , Job.Job_id    
FROM Skill,Job,word_frequency WHERE (word_frequency.job_name = Job.Job_name) AND Skill.Skill_name = word_frequency.skill
