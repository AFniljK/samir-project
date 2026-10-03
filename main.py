import sqlite3
from flask import Flask, render_template, jsonify, request, redirect, url_for
app = Flask(__name__)

db_name = "db.sqlite"

def event_details(event_id):
    conn = sqlite3.connect(db_name)
    cursor = conn.cursor()

    cursor.execute(f"select * from EVENTS where id = '{event_id}';")
    event_detail = cursor.fetchall()[0] # only returns 1 row
    cursor.execute(f"select EMPLOYEES.id, EMPLOYEES.name, EMPLOYEES.contact from ASSIGNMENTS INNER JOIN EMPLOYEES ON ASSIGNMENTS.emp_id = EMPLOYEES.id where ASSIGNMENTS.event_id = '{event_id}';")
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
    return response

@app.route("/")
def home():
    return redirect(url_for("events"))

@app.get("/events")
def events():
    conn = sqlite3.connect(db_name)
    cursor = conn.cursor()
    cursor.execute("select EVENTS.id, EVENTS.title, EVENTS.date from EVENTS;");
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

@app.get("/edit_event/<int:event_id>")
def edit_event(event_id):
    event_detail = event_details(event_id)
    return render_template("edit_event.html", event_detail=event_detail)

@app.get("/event_adder")
def event_adder():
    return render_template("events_adder.html")

@app.get("/assign_employees/<int:event_id>")
def assign_employees(event_id):
    event_detail = event_details(event_id)
    emp_list = []

    payload = {
        event_id: event_id,
        emp_list: emp_list,
    }

    return render_template("assign_employees.html", data=payload)

# API for database
@app.get("/api/event_detail/<int:event_id>")
def event(event_id):
    response = event_details(event_id)
    return jsonify(response)

@app.post("/api/event/add")
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
    cursor.execute(f"insert into EVENTS (title, location, date, client_name, client_contact, client_email) values ('{event_title}', '{event_location}', '{event_date}', '{client_name}', '{client_contact}', '{client_email}');")
    conn.commit()
    conn.close()

    return jsonify({"status": "success", "message": "Saved to database"}), 201 # 201 for saved/created entry

@app.put("/api/event/update")
def update_event():
    data = request.get_json()

    event_id = data.get("event_id")
    event_title = data.get("event_title")
    event_location = data.get("event_location")
    event_date = data.get("event_date")
    client_name = data.get("client_name")
    client_contact = data.get("client_contact")
    client_email = data.get("client_email")

    conn = sqlite3.connect(db_name)
    cursor = conn.cursor()
    cursor.execute(f"update EVENTS set title = '{event_title}', location = '{event_location}', date = '{event_date}', client_name = '{client_name}', client_contact = '{client_contact}', client_email = '{client_email}' where id = {event_id};")
    conn.commit()
    conn.close()

    return jsonify({"status": "success", "message": "Updated database"}), 204 # 204 for updated entry

@app.post("/api/assignment/add")
def add_assignment():
    data = request.get_json();

    event_id = data.get("event_id");
    emp_id = data.get("emp_id");

    conn = sqlite3.connect(db_name)
    cursor = conn.cursor()

    cursor.execute(f"select * from ASSIGNMENTS where event_id = {event_id} and emp_id = {emp_id};")
    if cursor.fetchall().length == 0:
        conn.close()
        return jsonify({"status", "already assigned"}), 409

    cursor.execute(f"insert into ASSIGNMENTS(emp_id, event_id) VALUES({emp_id}, {event_id});")
    conn.commit()
    conn.close()

    return jsonify({"status": "success"}), 200

@app.delete("/api/assignment/delete")
def delete_assignment():
    data = request.get_json();

    event_id = data.get("event_id");
    emp_id = data.get("emp_id");

    conn = sqlite3.connect(db_name)
    cursor = conn.cursor()

    cursor.execute(f"select * from ASSIGNMENTS where event_id = {event_id} and emp_id = {emp_id};")
    if cursor.fetchall().length == 0:
        conn.close()
        return jsonify({"status", "already assigned"}), 409

    cursor.execute(f"delete from ASSIGNMENTS where event_id = {event_id} and emp_id = {emp_id};")
    conn.commit()
    conn.close()

    return jsonify({"status": "success"}), 200

app.run(port=3000)