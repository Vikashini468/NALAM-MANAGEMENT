/* ==========================================
   EMERGENCY BOOKING
========================================== */
const patientSearch=document.getElementById("patientSearch");

patientSearch.addEventListener("keyup",searchPatient);
async function searchPatient(){

    const text=patientSearch.value.trim();

    if(text.length<2){

        document.getElementById("patientResults").innerHTML="";

        return;

    }

    const res=await fetch(

        "/emergency/search-patient/"+encodeURIComponent(text)

    );

    const patients=await res.json();

    let html="";

    patients.forEach(patient=>{

        html+=`

        <div class="patient-card"

        onclick="selectPatient(

            ${patient.id},

            '${patient.name}'

        )">

            <strong>${patient.name}</strong>

            <br>

            Age : ${patient.age}

            <br>

            Mobile : ${patient.mobile}

        </div>

        `;

    });

    document.getElementById("patientResults").innerHTML=html;

}
function selectPatient(id,name){

    document.getElementById("patientId").value=id;

    document.getElementById("patientSearch").value=name;

    document.getElementById("patientResults").innerHTML="";

}
const form = document.getElementById("emergencyForm");

form.addEventListener("submit", createEmergency);

/* ==========================================
   CREATE EMERGENCY
========================================== */

async function createEmergency(e) {

    e.preventDefault();

    const patientId = document.getElementById("patientId").value.trim();
    const doctorId = document.getElementById("doctorId").value;
    const category = document.getElementById("category").value;
    const priority = document.getElementById("priority").value;
    const department = document.getElementById("department").value;
    const symptoms = document.getElementById("symptoms").value.trim();
    const emergencyNotes = document.getElementById("notes").value.trim();
    const ambulanceRequired = document.getElementById("ambulance").checked;
    const arrivalType = document.getElementById("arrivalType").value;

    /* Validation */

    if (
        patientId === "" ||
        category === "" ||
        priority === "" ||
        department === "" ||
        symptoms === ""
    ) {

        alert("Please fill all required fields.");

        return;

    }

    try {

        const response = await fetch("/emergency/create", {

            method: "POST",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify({

                patientId,
                doctorId,
                category,
                priority,
                department,
                symptoms,
                emergencyNotes,
                ambulanceRequired,
                arrivalType

            })

        });

        const data = await response.json();

        if (data.success) {

            alert(
                "Emergency Case Created\n\nCase ID : " +
                data.emergencyId
            );

            form.reset();

        }

        else {

            alert(data.message);

        }

    }

    catch (err) {

        console.log(err);

        alert("Unable to create emergency case.");

    }

}

/* ==========================================
   AUTO PRIORITY SUGGESTION
========================================== */

const symptomsBox = document.getElementById("symptoms");

symptomsBox.addEventListener("keyup", suggestPriority);

function suggestPriority() {

    const text = symptomsBox.value.toLowerCase();

    const priority = document.getElementById("priority");

    if (

        text.includes("chest pain") ||
        text.includes("breathing") ||
        text.includes("stroke") ||
        text.includes("unconscious") ||
        text.includes("cardiac")

    ) {

        priority.value = "Critical";

    }

    else if (

        text.includes("fracture") ||
        text.includes("accident") ||
        text.includes("burn")

    ) {

        priority.value = "Very Urgent";

    }

    else if (

        text.includes("fever") ||
        text.includes("vomiting") ||
        text.includes("infection")

    ) {

        priority.value = "Urgent";

    }

}

/* ==========================================
   AUTO DEPARTMENT SUGGESTION
========================================== */

symptomsBox.addEventListener("keyup", suggestDepartment);

function suggestDepartment() {

    const text = symptomsBox.value.toLowerCase();

    const department = document.getElementById("department");

    if (

        text.includes("heart") ||
        text.includes("chest")

    ) {

        department.value = "Cardiology";

    }

    else if (

        text.includes("stroke") ||
        text.includes("brain") ||
        text.includes("seizure")

    ) {

        department.value = "Neurology";

    }

    else if (

        text.includes("bone") ||
        text.includes("fracture")

    ) {

        department.value = "Orthopedics";

    }

    else if (

        text.includes("child") ||
        text.includes("baby")

    ) {

        department.value = "Pediatrics";

    }

}

/* ==========================================
   LOAD DOCTORS
   (Placeholder for now)
========================================== */

document
    .getElementById("department")
    .addEventListener("change", loadDoctors);

async function loadDoctors() {

    /*
      We will implement this in Part 2.

      It will call:

      GET /emergency/doctors/:department

      and populate the doctor dropdown.
    */

}