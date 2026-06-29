const express = require("express");

const router = express.Router();

/* ===============================
   CREATE LAB REQUEST
================================ */

router.post("/request", async (req, res) => {

    const pool = req.app.locals.pool;

    try {

        console.log("BODY :", req.body);

        const {
            doctorId,
            patientId,
            appointmentId,
            tests
        } = req.body;

        if (
            !doctorId ||
            !patientId ||
            !appointmentId ||
            !tests
        ) {

            return res.status(400).json({
                success: false,
                message: "Missing required fields"
            });

        }

        await pool.query(

            `
            INSERT INTO lab_requests
            (
                appointment_id,
                patient_id,
                doctor_id,
                tests
            )

            VALUES
            ($1,$2,$3,$4)
            `,

            [
                appointmentId,
                patientId,
                doctorId,
                JSON.stringify(tests)
            ]

        );

        await pool.query(

            `
            UPDATE appointments
            SET status='LAB_REPORT_IN_PROGRESS'
            WHERE id=$1
            `,

            [appointmentId]

        );

        res.json({

            success: true,
            message: "Lab request created"

        });

    }

    catch (err) {

        console.error(err);

        res.status(500).json({

            success: false,
            message: err.message

        });

    }

});

module.exports = router;