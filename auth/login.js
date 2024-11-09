const express = require("express");
const brcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();

const users = require("./register").users;


const JWT_SECRET = "DIU0uY6ZYudD6JF6ouStPYbIcg7RillHwiXrhah40Mg=";

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 */
router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    const users = users.find(user => user.username === username)
    if (!user) return res.status(400).json({ message: "Invalid credentials" });


    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: "1h" });
    res.json({ message: "Login successful", token });
})



module.exports = router