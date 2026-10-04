const event_title = document.getElementById("event-title");
const client_name = document.getElementById("client-name");
const client_contact = document.getElementById("client-contact");
const employee_list = document.getElementById("employees");
const edit_btn = document.getElementById("edit_btn");

function editEvent(btn) {
    const event_id = btn.dataset.id;
    window.location.assign("/edit_event/" + event_id);
}

function addEvent() {
    window.location.assign("/event_adder")
}

async function eventDetails(element) {
    event_title.innerHTML = "Loading...";
    client_name.innerHTML = "Loading...";
    client_contact.innerHTML = "Loading...";
    const event_id = element.dataset.id;

    try {
        const response = await fetch("/api/event_detail/" + event_id);
        if (!response.ok) throw new Error("User not Found!");

        const event_details = await response.json();

        event_title.innerHTML = event_details.event_title;
        client_name.innerHTML = event_details.client_name;
        client_contact.innerHTML = event_details.client_contact;

        edit_btn.setAttribute("data-id", event_id);
        edit_btn.disabled = false;

        const resp = await fetch("/api/event_employees/" + event_id);
        if (!resp.ok) throw new Error("Employees not Found!");

        const data = await resp.json();

        employee_list.innerHTML = "";
        if (data.emp_list.length === 0) {
            const noemp = document.createElement('div');
            noemp.classList.add('col-6', 'text-decoration-underline');
            noemp.innerHTML = "None";

            employee_list.appendChild(noemp);
        } else {
            for (const emp of data.emp_list) {
                const employee = document.createElement('div');
                employee.classList.add('col-6', 'text-decoration-underline');
                employee.innerHTML = emp[1];

                employee_list.appendChild(employee);
            }
        }
    } catch (error) {
        console.log(error.message)
    }

}
