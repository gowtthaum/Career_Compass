import sqlite3

# connect to existing user.db
conn = sqlite3.connect("user.db")
cursor = conn.cursor()

# create jobs table
cursor.execute("""
CREATE TABLE IF NOT EXISTS jobs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  location TEXT NOT NULL,
  required_skills TEXT NOT NULL,
  apply_url TEXT NOT NULL
)
""")

# job seed data
jobs = [
  ("Junior Python Developer","TechNova","Bangalore","python,flask,sql,git","https://careers.technova.com/python-dev"),
  ("Backend Developer (Python)","CodeCraft","Remote","python,fastapi,rest api,sql","https://jobs.codecraft.io/backend-python"),
  ("Software Engineer – API Development","CloudAxis","Hyderabad","python,fastapi,api,sql","https://cloudaxis.com/careers/api-engineer"),
  ("Data Analyst","DataCore","Remote","sql,excel,python,power bi","https://datacore.ai/jobs/data-analyst"),
  ("Frontend Developer (React)","WebSpark","Chennai","react,javascript,html,css","https://webspark.in/react-developer"),
  ("Full Stack Developer","InnoTech Labs","Pune","python,react,sql,api","https://innotechlabs.com/careers/fullstack"),
  ("Machine Learning Intern","AIWorks","Remote","python,ml,pandas,numpy","https://aiworks.io/internships/ml"),
  ("SQL / Database Developer","QuerySoft","Bangalore","sql,joins,indexing,optimization","https://querysoft.com/jobs/sql-dev"),
  ("DevOps Engineer (Junior)","InfraStack","Noida","linux,docker,ci cd,git","https://infrastack.tech/devops"),
  ("QA Automation Engineer","TestPro Systems","Remote","testing,selenium,python,api testing","https://testprosystems.com/careers/qa")
]

# insert data
cursor.executemany("""
INSERT INTO jobs (title, company, location, required_skills, apply_url)
VALUES (?, ?, ?, ?, ?)
""", jobs)

conn.commit()
conn.close()

print("✅ Jobs table created and data inserted successfully")
