const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    })
}

// Path to the mock database
const dbPath = path.join(__dirname, "../db.json");

// Helper function to read from db.json
const readDataFromDb = () => {
    try {
        const rawData = fs.readFileSync(dbPath, "utf-8");
        return JSON.parse(rawData);  // Parse the JSON data and return it
    } catch (err) {
        console.error("Error reading from db.json:", err);
        return [];  // Return an empty array in case of error
    }
};

// Helper function to write data to db.json
const writeDataToDb = (data) => {
    try {
        fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));  // Write data with pretty indentation
    } catch (err) {
        console.error("Error writing to db.json:", err);
    }
};

/**
 * @swagger
 * tags:
 *   name: Cars
 */

/**
 * @swagger
 * /api/cars:
 *   get:
 *     tags: [Cars]
 *     summary: Get all cars
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all cars.
 */
router.get("/", authenticateToken, (req, res) => {
    const cars = readDataFromDb();  // Read data from db.json
    res.json(cars);
});

/**
 * @swagger
 * /api/cars/{id}:
 *   get:
 *     tags: [Cars]
 *     summary: Get a car by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Car ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Car data.
 *       404:
 *         description: Car not found.
 */
router.get("/:id", authenticateToken, (req, res) => {
    const cars = readDataFromDb();
    const car = cars.find((c) => c.id === parseInt(req.params.id));

    if (!car) return res.status(404).send("Car not found");
    res.json(car);
});

/**
 * @swagger
 * /api/cars/add-car:
 *   post:
 *     tags: [Cars]
 *     summary: Add a new car
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               company:
 *                 type: string
 *               model:
 *                 type: string
 *               year:
 *                 type: number
 *               price:
 *                 type: number
 *     responses:
 *       201:
 *         description: Car added successfully.
 *       400:
 *         description: Bad request.
 *       500:
 *         description: Internal server error.
 */
router.post("/add-car",authenticateToken ,(req, res) => {
    const cars = readDataFromDb();  // Read current cars data
    const newCar = {
        id: cars.length + 1,  // Simple ID generation logic
        company: req.body.company,
        model: req.body.model,
        year: req.body.year,
        price: req.body.price
    };

    cars.push(newCar);  // Add the new car to the array
    writeDataToDb(cars);  // Write the updated array back to db.json

    res.status(201).json(newCar);  // Respond with the new car data
});

/**
 * @swagger
 * /api/cars/edit-car/{id}:
 *   put:
 *     tags: [Cars]
 *     summary: Update a car by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Car ID
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               make:
 *                 type: string
 *               model:
 *                 type: string
 *               year:
 *                 type: integer
 *               price:
 *                 type: number
 *     responses:
 *       200:
 *         description: Car updated successfully.
 *       404:
 *         description: Car not found.
 */
router.put("/edit-car/:id",authenticateToken, (req, res) => {
    const cars = readDataFromDb();
    const car = cars.find((c) => c.id === parseInt(req.params.id));

    if (!car) return res.status(404).send("Car not found");

    // Update car details
    car.company = req.body.company || car.company;
    car.model = req.body.model || car.model;
    car.year = req.body.year || car.year;
    car.price = req.body.price || car.price;

    writeDataToDb(cars);  // Write updated cars array back to db.json
    res.json(car);  // Respond with the updated car
});

/**
 * @swagger
 * /api/cars/delete-car/{id}:
 *   delete:
 *     tags: [Cars]
 *     security:
 *       - bearerAuth: []
 *     summary: Delete a car by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Car ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Car deleted successfully.
 *       404:
 *         description: Car not found.
 */
router.delete("/delete-car/:id",authenticateToken, (req, res) => {
    const cars = readDataFromDb();
    const carIndex = cars.findIndex((c) => c.id === parseInt(req.params.id));

    if (carIndex !== -1) {
        cars.splice(carIndex, 1);  // Remove car from array
        writeDataToDb(cars);  // Write the updated array back to db.json
        res.json({ message: "Car deleted successfully" });
    } else {
        res.status(404).send(`Car with id ${req.params.id} not found`);
    }
});

module.exports = router;
