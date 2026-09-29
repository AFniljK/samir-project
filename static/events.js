const event_title = document.getElementById("event-title");
const client_name = document.getElementById("client-name");
const client_contact = document.getElementById("client-contact");
const employee_list = document.getElementById("employees");

async function eventDetails(element) {
    event_title.innerHTML = "Loading...";
    client_name.innerHTML = "Loading...";
    client_contact.innerHTML = "Loading...";
    employee_list.innerHTML = "Loading...";
    const event_id = element.dataset.id;

    try {
        const response = await fetch("/api/event_detail/" + event_id);
        if (!response.ok) throw new Error("User not Found!");

        const event_details = await response.json();

        event_title.innerHTML = event_details.event_title;
        client_name.innerHTML = event_details.client_name;
        client_contact.innerHTML = event_details.client_contact;

        employee_list.innerHTML = "";
        if (event_details.assigned_employees.length === 0) {
            const noemp = document.createElement('div');
            noemp.classList.add('col-6', 'text-decoration-underline');
            noemp.innerHTML = "None";

            employee_list.appendChild(noemp);
        } else {
            for (const emp of event_details.assigned_employees) {
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
