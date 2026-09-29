import sqlite3

conn = sqlite3.connect("test.db")
cursor = conn.cursor()

event_id = int(input("Event-ID: "))

cursor.execute(f"select * from EVENTS where event_id = '{event_id}';")

rows = cursor.fetchall()

for row in rows:
    print(f"ID: {row[0]}, TITLE: {row[1]}, LOCATION: {row[2]}, DATE: {row[3]}, NAME: {row[4]}, NUMBER: {row[5]}, GMAIL: {row[6]}")

cursor.execute(f"select ASSIGNMENTS.emp_id, EMPLOYEES.emp_name from ASSIGNMENTS INNER JOIN EMPLOYEES ON ASSIGNMENTS.emp_id = EMPLOYEES.emp_id where ASSIGNMENTS.event_id = '{event_id}';")

rows = cursor.fetchall()

for row in rows:
    print(f"ID: {row[0]}, Name: {row[1]}")
