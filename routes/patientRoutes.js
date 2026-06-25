router.get("/api/patient/profile/:email", async (req, res) => {
    const pool = req.app.locals.pool;

    try {
        const { email } = req.params;

        // 1. get user
        const userResult = await pool.query(
            `SELECT id, name, username, email, mobile, role
             FROM users WHERE email=$1`,
            [id]
        );

        if (userResult.rows.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        const user = userResult.rows[0];

        // 2. get patient details
        const patientResult = await pool.query(
            `SELECT * FROM patients WHERE user_id=$1`,
            [id]
        );

        const patient = patientResult.rows[0] || {};

        res.json({
            user,
            patient
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});
router.get("/api/patient/profile/:id", async (req, res) => {
    const pool = req.app.locals.pool;

    try {
        const userId = req.params.id;

        const result = await pool.query(
            `
            SELECT 
                u.id,
                u.name,
                u.username,
                u.email,
                u.mobile,
                u.role,
                p.age,
                p.gender,
                p.blood_group,
                p.weight,
                p.allergies,
                p.previous_hospital,
                p.address,
                p.photo
            FROM users u
            LEFT JOIN patients p ON u.id = p.user_id
            WHERE u.id = $1
            `,
            [userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        const row = result.rows[0];

        res.json({
            user: {
                id: row.id,
                name: row.name,
                username: row.username,
                email: row.email,
                mobile: row.mobile,
                role: row.role
            },
            patient: {
                age: row.age,
                gender: row.gender,
                blood_group: row.blood_group,
                weight: row.weight,
                allergies: row.allergies,
                previous_hospital: row.previous_hospital,
                address: row.address,
                photo: row.photo
            }
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});