/* ==========================================
   EMERGENCY QUEUE
========================================== */

const queue = document.getElementById("queue");

/* ==========================================
   PAGE LOAD
========================================== */

window.onload = () => {

    loadQueue();

    /* Auto Refresh Every 15 Seconds */

    setInterval(loadQueue,15000);

};

/* ==========================================
   LOAD QUEUE
========================================== */

async function loadQueue(){

    try{

        const response = await fetch("/emergency/list");

        const data = await response.json();

        displayQueue(data);

    }

    catch(err){

        console.log(err);

        queue.innerHTML=`

            <div class="empty">

                Unable to load emergency queue.

            </div>

        `;

    }

}

/* ==========================================
   DISPLAY QUEUE
========================================== */

function displayQueue(data){

    queue.innerHTML="";

    if(data.length===0){

        queue.innerHTML=`

            <div class="empty">

                No Emergency Patients

            </div>

        `;

        return;

    }

    data.forEach(patient=>{

        let priorityClass="low";
        let priorityIcon="🟢";

        if(patient.priority==="Critical"){

            priorityClass="critical";
            priorityIcon="🔴";

        }

        else if(patient.priority==="Very Urgent"){

            priorityClass="veryurgent";
            priorityIcon="🟠";

        }

        else if(patient.priority==="Urgent"){

            priorityClass="urgent";
            priorityIcon="🟡";

        }

        const card=document.createElement("div");

        card.className=`card ${priorityClass}`;

        card.innerHTML=`

            <h2>

                ${priorityIcon}
                ${patient.name}

            </h2>

            <p>

                <strong>Category :</strong>

                ${patient.category}

            </p>

            <p>

                <strong>Department :</strong>

                ${patient.department}

            </p>

            <p>

                <strong>Priority :</strong>

                ${patient.priority}

            </p>

            <p>

                <strong>Status :</strong>

                ${patient.status}

            </p>

            <p>

                <strong>Age :</strong>

                ${patient.age}

            </p>

            <p>

                <strong>Gender :</strong>

                ${patient.gender}

            </p>

            <p>

                <strong>Arrival :</strong>

                ${formatDate(patient.created_at)}

            </p>

            <button
                class="viewBtn"
                onclick="viewPatient(${patient.id})">

                View Patient

            </button>

        `;

        queue.appendChild(card);

    });

}

/* ==========================================
   FORMAT DATE
========================================== */

function formatDate(date){

    return new Date(date).toLocaleString();

}

/* ==========================================
   VIEW PATIENT
========================================== */

function viewPatient(id){

    window.location.href=

    "emergencyDetails.html?id="+id;

}