//VARS

const editDelete = document.querySelectorAll(".edit-delete");
const darkModeToggle = document.getElementById("darkModeToggle");
const jobForm = document.getElementById("jobForm");
const jobTableBody = document.getElementById("jobList");
const filterStatus = document.getElementById("filterStatus");

let jobApplications = JSON.parse(localStorage.getItem("jobApplications")) || [];

//FUNCTIONS

// Function to render job applications
function renderJobs() {
    jobTableBody.innerHTML = "";

    const selectedStatus = filterStatus.value;

    jobApplications.forEach((job, index) => {
        if (selectedStatus === "All" || job.status === selectedStatus) {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${job.company}</td>
                <td>${job.position}</td>
                <td>${job.date}</td>
                <td>${job.status}</td>
                <td>
                    <button onclick="editJob(${index})" class="edit-delete">✏️ Edit</button>
                    <button onclick="deleteJob(${index})" class="edit-delete">🗑️ Delete</button>
                </td>
            `;

            jobTableBody.appendChild(row);
        }
    });

    localStorage.setItem("jobApplications", JSON.stringify(jobApplications));
}

// Function to add a new job application
jobForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const company = document.getElementById("company").value;
    const position = document.getElementById("position").value;
    const date = document.getElementById("date").value;
    const status = document.getElementById("status").value;

    if (company && position && date) {
        const newJob = { company, position, date, status };
        jobApplications.push(newJob);
        renderJobs();
        jobForm.reset();
    } else {
        alert("Please fill in all required fields.");
    }
});

// Function to delete a job application
function deleteJob(index) {
    if (confirm("Are you sure you want to delete this application?")) {
        jobApplications.splice(index, 1);
        renderJobs();
    }
}

// Function to edit a job application
function editJob(index) {
    const job = jobApplications[index];

    document.getElementById("company").value = job.company;
    document.getElementById("position").value = job.position;
    document.getElementById("date").value = job.date;
    document.getElementById("status").value = job.status;
    document.getElementById("notes").value = job.notes;

    // Remove the old entry and update with the edited one
    jobApplications.splice(index, 1);
    renderJobs();
}

if (localStorage.getItem("darkMode") === "enabled") {
    document.body.classList.add("dark-mode");
    darkModeToggle.innerText = "☀️ Light Mode";
    darkModeToggle.style.color = "white";
}

// Toggle Dark Mode
darkModeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");

    if (document.body.classList.contains("dark-mode")) {
        localStorage.setItem("darkMode", "enabled");
        darkModeToggle.innerText = "☀️ Light Mode";
        darkModeToggle.style.color = "white";
    } else {
        localStorage.setItem("darkMode", "disabled");
        darkModeToggle.innerText = "🌙 Dark Mode";
        darkModeToggle.style.color = "black";
    }
});

// Function to generate and download PDF
function exportToPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.text("Job Application Tracker", 10, 10);

    doc.text("Company", 10, 20);
    doc.text("Position", 60, 20);
    doc.text("Date Applied", 110, 20);
    doc.text("Status", 160, 20);

    jobApplications.forEach((job, index) => {
        const y = 30 + (index * 10);
        doc.text(job.company, 10, y);
        doc.text(job.position, 60, y);
        doc.text(job.date, 110, y);
        doc.text(job.status, 160, y);
    });

    doc.save("Job_Applications.pdf");
}

//EVENTS
document.getElementById("exportPDF").addEventListener("click", exportToPDF);
filterStatus.addEventListener("change", renderJobs);
renderJobs();
