INSERT INTO Skill (Skill_name) 
SELECT distinct skill FROM word_frequency 
UPDATE Skill SET numberOfUsers = 0

