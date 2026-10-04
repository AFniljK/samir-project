const ass_emp_list = document.getElementById("ass-emp-list");
const event_id = ass_emp_list.dataset.eventid;

function createEmpBox(emp_name) {
    const outer_frame = document.createElement('div');
    outer_frame.classList.add("row", "mb-4", "mx-2");
    const inner_frame = document.createElement('div');
    inner_frame.classList.add("border", "rounded", "border-dark", "p-4");
    const name_span = document.createElement('span');
    name_span.innerHTML = emp_name;
    name_span.classList.add("border-bottom", "border-dark", "row");

    inner_frame.appendChild(name_span);
    outer_frame.appendChild(inner_frame);

    return outer_frame;
}

async function refreshList() {
    const resp = await fetch("/api/event_employees/" + event_id);

    try {
        if (!resp.ok) throw new Error("Employees not Found!");
        const data = await resp.json();
        const emps = data.emp_list;

        ass_emp_list.innerHTML = "";
        if (emps.length == 0) {
            const noemp = createEmpBox("None");
            ass_emp_list.appendChild(noemp);
        } else {
            for (const emp of emps) {
                const employee = createEmpBox(emp[1]);
                ass_emp_list.appendChild(employee);
            }
        }
    } catch (error) {
        alert(error.message);
    }
}

async function assignEmployee(element) {
    const emp_id = element.dataset.id;

    const payload = {
        emp_id: emp_id,
        event_id: event_id,
    };

    const response = await fetch("/api/assignment/add", {
        headers: {
            "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        alert("Cannot ADD!");
    } else {
        refreshList();
    }
}

async function unassignEmployee(element) {
    const emp_id = element.dataset.id;

    payload = {
        emp_id: emp_id,
        event_id: event_id,
    };

    await fetch("/api/assignment/delete", {
        headers: {
            "Content-Type": "application/json",
        },
        method: "DELETE",
        body: JSON.stringify(payload),
    });

    refreshList();
}

refreshList();