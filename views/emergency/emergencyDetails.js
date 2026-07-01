/* ==========================================
   GET EMERGENCY ID
========================================== */

const params = new URLSearchParams(window.location.search);
const emergencyId = params.get("id");

/* ==========================================
   PAGE LOAD
========================================== */

window.onload = function () {

    loadEmergency();

};

/* ==========================================
   LOAD EMERGENCY DETAILS
========================================== */

async function loadEmergency() {

    try {

        const response = await fetch(

            "/emergency/" + emergencyId

        );

        const data = await response.json();

        if (!data) {

            alert("Emergency Case Not Found");

            return;

        }

        document.getElementById("patientName").innerHTML =
            data.name;

        document.getElementById("patientAge").innerHTML =
            data.age;

        document.getElementById("patientGender").innerHTML =
            data.gender;

        document.getElementById("bloodGroup").innerHTML =
            data.blood_group || "-";

        document.getElementById("category").innerHTML =
            data.category;

        document.getElementById("priority").innerHTML =
            getPriorityBadge(data.priority);

        document.getElementById("department").innerHTML =
            data.department;

        document.getElementById("symptoms").innerHTML =
            data.symptoms;

        document.getElementById("notes").innerHTML =
            data.emergency_notes || "-";

        document.getElementById("status").value =
            data.status;

    }

    catch (err) {

        console.log(err);

        alert("Unable to load emergency.");

    }

}

/* ==========================================
   PRIORITY BADGE
========================================== */

function getPriorityBadge(priority) {

    switch (priority) {

        case "Critical":

            return "🔴 Critical";

        case "Very Urgent":

            return "🟠 Very Urgent";

        case "Urgent":

            return "🟡 Urgent";

        default:

            return "🟢 Less Urgent";

    }

}

/* ==========================================
   UPDATE STATUS
========================================== */

async function updateStatus() {

    const status = document.getElementById("status").value;

    try {

        const response = await fetch(

            "/emergency/status/" + emergencyId,

            {

                method: "PUT",

                headers: {

                    "Content-Type": "application/json"

                },

                body: JSON.stringify({

                    status

                })

            }

        );

        const data = await response.json();

        if (data.success) {

            alert("Status Updated Successfully");

        }

        else {

            alert("Unable to Update Status");

        }

    }

    catch (err) {

        console.log(err);

    }

}

/* ==========================================
   REQUEST LAB
========================================== */

function requestLab() {

    /*
       Change this URL if your
       Lab module uses a different page.
    */

    window.location.href =

        "/lab/selectLabTest.html?emergencyId=" +

        emergencyId;

}

/* ==========================================
   PRESCRIPTION
========================================== */

function openPrescription() {

    /*
      Replace this URL
      with your Doctor Prescription page
    */

    window.location.href =

        "/doctor/prescription.html?emergencyId=" +

        emergencyId;

}

/* ==========================================
   ADMISSION
========================================== */

function admitPatient() {

    alert(

        "Admission Module will be connected here."

    );

}