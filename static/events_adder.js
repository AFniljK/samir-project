const main_form = document.getElementById("main-form");

main_form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const form_data = new FormData(event.target);
    const payload = {
        event_title: form_data.get("event_title"),
        event_location: form_data.get("event_location"),
        event_date: form_data.get("event_date"),
        client_name: form_data.get("client_name"),
        client_contact: form_data.get("client_contact"),
        client_email: form_data.get("client_email"),
    }

    const response = await fetch("/api/add_event", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload)
    });

    if (response.ok) {
        console.log("Success!");
        main_form.reset();
    } else {
        alert("Failed to schedule event!");
    }

});