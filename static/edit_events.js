const main_form = document.getElementById("main-form");

main_form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const form_data = new FormData(event.target);
    const payload = {
        event_id: main_form.dataset.id,
        event_title: form_data.get("event_title"),
        event_location: form_data.get("event_location"),
        event_date: form_data.get("event_date"),
        client_name: form_data.get("client_name"),
        client_contact: form_data.get("client_contact"),
        client_email: form_data.get("client_email"),
    }

    const response = await fetch("/api/update_event", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload)
    });

    if (response.ok) {
        console.log("Success!");
        alert("Updated Event!");
    } else {
        alert("Failed to update event!");
    }

});

function assignEmployees() {
    console.log("Trying...");
}
