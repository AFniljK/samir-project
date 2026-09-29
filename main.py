import sqlite3
from flask import Flask, render_template, jsonify, request
app = Flask(__name__)

db_name = "database.db"

@app.route("/")
def index():
    conn = sqlite3.connect(db_name)
    cursor = conn.cursor()
    cursor.execute("select EVENTS.event_id, EVENTS.event_title, EVENTS.event_date from EVENTS;");
    rows = cursor.fetchall()
    events = []
    for row in rows:
        event = {
            "id": row[0],
            "title": row[1],
            "date": row[2]
        }
        events.append(event)

    conn.close()
    return render_template("events.html", events=events)

@app.route("/event_adder")
def event_adder():
    return render_template("events_adder.html")

# API for database
@app.get("/api/event_detail/<int:event_id>")
def event_detail(event_id):
    conn = sqlite3.connect(db_name)
    cursor = conn.cursor()

    cursor.execute(f"select * from EVENTS where event_id = '{event_id}';")
    event_detail = cursor.fetchall()[0] # only returns 1 row
    cursor.execute(f"select ASSIGNMENTS.emp_id, EMPLOYEES.emp_name from ASSIGNMENTS INNER JOIN EMPLOYEES ON ASSIGNMENTS.emp_id = EMPLOYEES.emp_id where ASSIGNMENTS.event_id = '{event_id}';")
    assigned_employees = cursor.fetchall()
    response = {
        "event_id": event_detail[0],
        "event_title": event_detail[1],
        "event_location": event_detail[2],
        "event_date": event_detail[3],
        "client_name": event_detail[4],
        "client_contact": event_detail[5],
        "client_gmail": event_detail[6],
        "assigned_employees": assigned_employees
    }

    conn.close()
    return jsonify(response)

@app.post("/api/add_event")
def add_event():
    data = request.get_json()

    event_title = data.get("event_title")
    event_location = data.get("event_location")
    event_date = data.get("event_date")
    client_name = data.get("client_name")
    client_contact = data.get("client_contact")
    client_email = data.get("client_email")

    conn = sqlite3.connect(db_name)
    cursor = conn.cursor()
    cursor.execute(f"insert into EVENTS (event_title, event_location, event_date, client_name, client_number, client_gmail) values ('{event_title}', '{event_location}', '{event_date}', '{client_name}', '{client_contact}', '{client_email}');")
    conn.commit()
    conn.close()

    return jsonify({"status": "success", "message": "Saved to database"}), 201

app.run(port=3000)