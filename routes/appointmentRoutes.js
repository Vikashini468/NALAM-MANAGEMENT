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

        await pool.query(
            `
            UPDATE appointments
            SET status = 'Completed'
            WHERE id = $1
            `,
            [req.params.id]
        );

        res.json({ success: true });

    } catch (err) {

        console.log(err);
        res.status(500).json({ success: false });

    }

});
module.exports = router;