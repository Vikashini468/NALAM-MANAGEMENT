const express = require("express");
const router = express.Router();

/* GET MEDICINES (LIVE STOCK) */
router.get("/medicines", async (req, res) => {
    const pool = req.app.locals.pool;

    try {
        const result = await pool.query(`
            SELECT * FROM medicines
            ORDER BY medicine_name
        `);

        res.json(result.rows);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server error" });
    }
});

/* DEDUCT STOCK */
router.post("/medicine/deduct-stock", async (req, res) => {
    const pool = req.app.locals.pool;

    try {
        const { name, quantity } = req.body;

        const result = await pool.query(`
            SELECT quantity
            FROM medicines
            WHERE medicine_name = $1
        `, [name]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Medicine not found" });
        }

        const currentStock = result.rows[0].quantity;

        if (currentStock < quantity) {
            return res.status(400).json({ message: "Insufficient stock" });
        }

        await pool.query(`
            UPDATE medicines
            SET quantity = quantity - $1
            WHERE medicine_name = $2
        `, [quantity, name]);

        res.json({ success: true });

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;