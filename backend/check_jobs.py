import sqlite3

conn = sqlite3.connect("user.db")
cursor = conn.cursor()

cursor.execute("SELECT title, company FROM jobs")
print(cursor.fetchall())

conn.close()
