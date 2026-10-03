const ass_emp_list = document.getElementById("ass-emp-list");

function createEmpBox(emp_name) {
    outer_frame = document.createElement('div');
    outer_frame.classList.add("row", "mb-4", "mx-2");
    inner_frame = document.createElement('div');
    inner_frame.classList.add("border", "rounded", "border-dark", "p-4");
    name_span = document.createElement('span');
    name_span.innerHTML = emp_name;
    name_span.classList.add("border-bottom", "border-dark", "row");

    inner_frame.appendChild(name_span);
    outer_frame.appendChild(inner_frame);

    return outer_frame;
}

async function refreshList() {
    event_id = ass_emp_list.dataset.eventID;

    const response = await fetch("/api/event_details/" + event_id);

    try {
        if (!response.ok) throw new Error("Failed to retieve employee list!");
        const emp_list = response.json().assigned_employees;

        emp_list.innerHTML = "";
        if (emp_list.length === 0) {
            const noemp = createEmpBox("None");
            ass_emp_list.appendChild(noemp);
        } else {
            for (const emp of emp_list) {
                employee = createEmpBox(emp);
                ass_emp_list.appendChild(employee);
            }
        }
    } catch (error) {
        alert(error.message);
    }
}

async function assignEmployee(element) {
    emp_id = element.dataset.empID;
    event_id = ass_emp_list.dataset.eventID;

    payload = {
        emp_id: emp_id,
        event_id: event_id,
    };

    const response = await fetch("/api/assignment/add", {
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
    emp_id = element.dataset.empID;
    event_id = ass_emp_list.dataset.eventID;

    payload = {
        emp_id: emp_id,
        event_id: event_id,
    };

    await fetch("/api/assignment/delete", {
        method: "DELETE",
        body: JSON.stringify(payload),
    });

    refreshList();
}
