create DATABASE JobPosts;
use JobPosts;
	
Create Table Job (
        Job_id int Auto_Increment,
		Job_name varchar(200), 
		PRIMARY key(Job_id)
);   
    
Create Table User (	
		User_id int Auto_Increment,
		First_name varchar(20) not null,
		Job_id3 int ,
        Last_name varchar(20) not null,
        User_password varchar(20) not null,
	 	Phone_number varchar(11) ,
		Email varchar(100) not null,
		Gender ENUM ('FEMALE','MALE') not null,
        Birthdate Date ,
		PPURL varchar(200),
		Hometown varchar(20),
		PRIMARY key(User_id),
        Foreign key(Job_id3) REFERENCES Job (Job_id)
		);
        

Create Table Skill (
		Skill_id int Auto_Increment,
		Skill_name text,
        numberOfUsers int,
        PRIMARY key(Skill_id)
);

Create Table job_skills (
        Skill_id4 int,
		Job_id4 int,
		PRIMARY key(Skill_id4,Job_id4),
        Foreign key(Job_id4) REFERENCES Job (Job_id),
        Foreign key(Skill_id4) REFERENCES Skill (Skill_id)

);
Create Table Has_skill (
	User_id1 int , 
	Skill_id2 int,
    PRIMARY key(User_id1,Skill_id2),
    Foreign key(User_id1) REFERENCES User(User_id),
    Foreign key(Skill_id2) REFERENCES Skill (Skill_id)
);


Create Table Vacancy (
		Vacancy_id int Auto_Increment,
		Job_id2 int,
		City varchar(200) , 
		job_category varchar(200),
		career_level varchar(200),
		job_description text ,
		Job_Date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ,
        salary_minimum int,
		salary_maximum int,
		num_vacancies int,
		PRIMARY key(Vacancy_id),
		Foreign key(Job_id2) REFERENCES Job(Job_id)

);


Create Table Qualification (
		Vacancy_id2 int ,
		Skill_id3 int, 
		PRIMARY key(Vacancy_id2,Skill_id3),
		Foreign key(Vacancy_id2) REFERENCES Vacancy (Vacancy_id),
		Foreign key(Skill_id3) REFERENCES Skill (Skill_id)
);

Create Table Recommended (
		Vacancy_id4 int ,
		user_id4 int, 
        sent_email int,
		PRIMARY key(Vacancy_id4,user_id4),
		Foreign key(Vacancy_id4) REFERENCES Vacancy (Vacancy_id),
		Foreign key(user_id4) REFERENCES User (user_id)
);

Create Table has_viewed (
		Vacancy_id3 int ,
		user_id3 int, 
		PRIMARY key(Vacancy_id3,user_id3),
		Foreign key(Vacancy_id3) REFERENCES Vacancy (Vacancy_id),
		Foreign key(user_id3) REFERENCES User (user_id)
);


Create Table wuzzuf (	
		id text ,
		city text ,
		Job_title text ,
		job_category1 text,
		job_category2 text,
		job_category3 text,
		job_industry1 text,
		job_industry2 text,
		job_industry3 text,
		salary_minimum int(11) ,
		salary_maximum int(11) ,
		num_vacancies int(11) ,
        career_level text,
        experience_years text,
        post_date text,
        views int(11),
        job_description text,
        job_requirements text,
        payment_period text,
        currency text
		);


-- 
--  INSERT into User(First_name,Last_name, User_password ,
-- 		Phone_Number ,	Email ,	Gender, Birthdate ,PPURL ,	HomeTown ) values 
-- ('nour','gaber','nour','011','nourgaber38@yahoo.com','FEMALE','2012-01-02','1','Alexandria');
--  
--  INSERT into User(First_name,Last_name, User_password ,
-- 		Phone_Number ,	Email ,	Gender, Birthdate ,PPURL ,	HomeTown ) values 
-- ('dareen','hamdy','dodo','011','dareen38@yahoo.com','FEMALE','2012-01-02','2','Alexandria');
-- 
-- INSERT into User(First_name,Last_name, User_password ,
-- 		Phone_Number  ,	Email ,	Gender, Birthdate ,PPURL ,	HomeTown ) values 
-- ('rowan','salem','row','011','rowan38@yahoo.com','FEMALE','2012-01-02','3','Alexandria');


