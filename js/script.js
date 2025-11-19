const API_URL = "http://localhost:3000/contacts";  

const contactList = document.getElementById("contactList");

// ------------------- FETCH ALL CONTACTS -------------------
async function getContacts() {
    try {
        const response = await fetch(API_URL);
        const contacts = await response.json();
        displayContacts(contacts);
    } catch (error) {
        console.error("Error fetching contacts:", error);
        alert("Failed to load contacts.");
    }
}

function displayContacts(contacts) {
    contactList.innerHTML = "";
    contacts.forEach(contact => {
        const li = document.createElement("li");
        li.innerHTML = `
            <strong>${contact.name}</strong> - ${contact.phone}
            <span class="actions">
                <button onclick="editContact(${contact.id}, '${contact.name}', '${contact.phone}')">Edit</button>
                <button onclick="deleteContact(${contact.id})">Delete</button>
            </span>
        `;
        contactList.appendChild(li);
    });
}

// ------------------- ADD CONTACT -------------------
async function addContact() {
    const name = document.getElementById("name").value;
    const phone = document.getElementById("phone").value;

    if (name === "" || phone === "") {
        alert("Please fill out all fields");
        return;
    }

    try {
        await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, phone })
        });

        getContacts();  // refresh
    } catch (error) {
        console.error("Error adding contact:", error);
        alert("Failed to add contact.");
    }
}

// ------------------- DELETE CONTACT -------------------
async function deleteContact(id) {
    try {
        await fetch(`${API_URL}/${id}`, { method: "DELETE" });
        getContacts();
    } catch (error) {
        alert("Unable to delete contact.");
    }
}

// ------------------- EDIT CONTACT -------------------
function editContact(id, currentName, currentPhone) {
    const newName = prompt("Enter new name:", currentName);
    const newPhone = prompt("Enter new phone:", currentPhone);

    if (newName && newPhone) {
        updateContact(id, newName, newPhone);
    }
}

async function updateContact(id, name, phone) {
    try {
        await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, phone })
        });

        getContacts();
    } catch (error) {
        alert("Update failed.");
    }
}

// ------------------- SEARCH CONTACTS -------------------
async function searchContacts() {
    const query = document.getElementById("searchBox").value.toLowerCase();

    try {
        const response = await fetch(API_URL);
        const contacts = await response.json();

        const filtered = contacts.filter(c =>
            c.name.toLowerCase().includes(query) ||
            c.phone.includes(query)
        );

        displayContacts(filtered);
    } catch (error) {
        alert("Search failed.");
    }
}

// Load contacts on page start
getContacts();
