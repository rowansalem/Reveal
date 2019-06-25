INSERT INTO Job(Job_name) SELECT DISTINCT job_title
FROM wuzzuf 
 
INSERT INTO Vacancy (City, job_category, job_description, Job_Date,salary_minimum,salary_maximum,Job_id2)
SELECT distinct city,job_category1,job_description, post_date ,salary_minimum ,salary_maximum ,Job_id   
FROM wuzzuf,Job WHERE wuzzuf.job_title= Job.Job_name

INSERT INTO Vacancy (City, job_category, job_description, Job_Date,salary_minimum,salary_maximum,Job_id2)
SELECT distinct wuzzuf.city,wuzzuf.job_category1,wuzzuf.job_description, wuzzuf.post_date ,wuzzuf.salary_minimum ,wuzzuf.salary_maximum ,Job.Job_id   
FROM wuzzuf,Job WHERE wuzzuf.job_title= Job.Job_name
