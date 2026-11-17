
// Get saved complaints from browser
let complaints = JSON.parse(
    localStorage.getItem("complaints")
) || [];

// Get HTML elements
const form = document.getElementById("roadForm");
const complaintList = document.getElementById("complaintList");

// Submit complaint
form.addEventListener("submit", function(event) {

    event.preventDefault();

    let road = document.getElementById("roadName").value;
    let location = document.getElementById("location").value;
    let problem = document.getElementById("problem").value;
    let priority = document.getElementById("priority").value;

    let complaint = {
        id: Date.now(),
        road: road,
        location: location,
        problem: problem,
        priority: priority,
        status: "Pending"
    };

    complaints.push(complaint);

    saveData();

    form.reset();

    displayComplaints();

    alert("Complaint submitted successfully!");

});

// Save data in localStorage
function saveData() {
    localStorage.setItem(
        "complaints",
        JSON.stringify(complaints)
    );
}

// Display complaints
function displayComplaints() {

    complaintList.innerHTML = "";

    let search = document.getElementById("search")
        .value.toLowerCase();

    let filter = document.getElementById("filter").value;

    let filteredComplaints = complaints.filter(function(item) {

        let matchSearch =
            item.road.toLowerCase().includes(search) ||
            item.location.toLowerCase().includes(search);

        let matchStatus =
            filter === "All" || item.status === filter;

        return matchSearch && matchStatus;

    });

    filteredComplaints.forEach(function(item) {

        let div = document.createElement("div");

        div.className = "complaint";

        let heading = document.createElement("h3");
        heading.textContent = item.road;

        let location = document.createElement("p");
        location.textContent = "Location: " + item.location;

        let problem = document.createElement("p");
        problem.textContent = "Problem: " + item.problem;

        let priority = document.createElement("p");
        priority.textContent = "Priority: " + item.priority;

        let status = document.createElement("p");
        status.textContent = "Status: " + item.status;
        status.className = item.status === "Resolved"
            ? "resolved-status"
            : "pending-status";

        div.appendChild(heading);
        div.appendChild(location);
        div.appendChild(problem);
        div.appendChild(priority);
        div.appendChild(status);

        if (item.status === "Pending") {

            let resolveButton = document.createElement("button");

            resolveButton.textContent = "Mark Resolved";

            resolveButton.addEventListener("click", function() {

                item.status = "Resolved";

                saveData();
                displayComplaints();

            });

            div.appendChild(resolveButton);
        }

        let deleteButton = document.createElement("button");

        deleteButton.textContent = "Delete";
        deleteButton.className = "delete-btn";

        deleteButton.addEventListener("click", function() {

            complaints = complaints.filter(function(c) {
                return c.id !== item.id;
            });

            saveData();
            displayComplaints();

        });

        div.appendChild(deleteButton);

        complaintList.appendChild(div);

    });

    updateDashboard();

}

// Update dashboard numbers
function updateDashboard() {

    document.getElementById("total").textContent =
        complaints.length;

    document.getElementById("pending").textContent =
        complaints.filter(c => c.status === "Pending").length;

    document.getElementById("resolved").textContent =
        complaints.filter(c => c.status === "Resolved").length;

}

// Search functionality
document.getElementById("search")
    .addEventListener("input", displayComplaints);

// Filter functionality
document.getElementById("filter")
    .addEventListener("change", displayComplaints);

// Load data when website opens
displayComplaints();
