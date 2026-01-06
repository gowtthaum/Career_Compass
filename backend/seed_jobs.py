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
  ("Junior Python Developer","Infosys","Bangalore","python,flask,sql,git","https://www.infosys.com/careers"),
  ("Backend Developer (Python)","TCS","Remote","python,fastapi,rest api,sql","https://www.tcs.com/careers"),
  ("Software Engineer – API Development","Accenture","Hyderabad","python,fastapi,api,sql","https://www.accenture.com/careers"),
  ("Data Analyst","Deloitte","Remote","sql,excel,python,power bi","https://www2.deloitte.com/careers"),
  ("Frontend Developer (React)","Zoho","Chennai","react,javascript,html,css","https://www.zoho.com/careers"),
  ("Full Stack Developer","Wipro","Pune","python,react,sql,api","https://careers.wipro.com"),
  ("Machine Learning Intern","IBM","Remote","python,ml,pandas,numpy","https://www.ibm.com/careers"),
  ("SQL / Database Developer","Oracle","Bangalore","sql,joins,indexing,optimization","https://www.oracle.com/careers"),
  ("DevOps Engineer (Junior)","Amazon","Noida","linux,docker,ci cd,git","https://www.amazon.jobs"),
  ("QA Automation Engineer","Capgemini","Remote","testing,selenium,python,api testing","https://www.capgemini.com/careers")
]


# insert data
cursor.executemany("""
INSERT INTO jobs (title, company, location, required_skills, apply_url)
VALUES (?, ?, ?, ?, ?)
""", jobs)

conn.commit()
conn.close()

print("✅ Jobs table created and data inserted successfully")
