const express = require("express");
const router = express.Router();

/* START CONSULTATION */
router.post("/start/:id", async (req, res) => {
    const pool = req.app.locals.pool;

    await pool.query(`
        UPDATE appointments
        SET status = 'InProgress'
        WHERE id = $1
    `, [req.params.id]);

    res.json({ success: true });
});

/* GET DETAILS */
router.get("/details/:id", async (req, res) => {
    const pool = req.app.locals.pool;

    const result = await pool.query(`
        SELECT
            a.id,
            a.patient_id,
            a.symptoms,
            a.status,
            u.name AS patient_name,
            p.age,
            p.gender,
            p.blood_group
        FROM appointments a
        JOIN users u ON u.id = a.patient_id
        LEFT JOIN patients p ON p.user_id = a.patient_id
        WHERE a.id = $1
    `, [req.params.id]);

    res.json(result.rows[0]);
});
/* COMPLETE APPOINTMENT */
router.post("/complete/:id", async (req, res) => {
    const pool = req.app.locals.pool;
    try {
        await pool.query(`UPDATE appointments SET status = 'Completed' WHERE id = $1`, [req.params.id]);
        res.json({ success: true });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false });
    }
});

/* CONFIRM LAB REPORT + OPTIONAL PRESCRIPTION */
router.post("/confirm-lab/:appointmentId", async (req, res) => {
    const pool = req.app.locals.pool;
    try {
        const { appointmentId } = req.params;
        const { medicines } = req.body; // array of {name, dosage, quantity, duration}

        // mark lab request as REVIEWED
        await pool.query(`UPDATE lab_requests SET status='REVIEWED' WHERE appointment_id=$1`, [appointmentId]);

        // mark appointment completed
        await pool.query(`UPDATE appointments SET status='Completed' WHERE id=$1`, [appointmentId]);

        // save prescriptions if any
        if (medicines && medicines.length > 0) {
            for (const med of medicines) {
                await pool.query(
                    `INSERT INTO prescriptions (appointment_id, medicine_name, dosage, quantity, duration, sent_to_pharmacy)
                     VALUES ($1,$2,$3,$4,$5,true)`,
                    [appointmentId, med.name, med.dosage, med.quantity, med.duration]
                );
            }
        }

        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: err.message });
    }
});
module.exports = router;