const express = require("express");
const router = express.Router();

// Mock database
let cars = [];

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
 *     responses:
 *       200:
 *         description: List of all cars.
 */
router.get('/', (req, res) => {
    res.json(cars);
});

/**
 * @swagger
 * /api/cars/{id}:
 *   get:
 *     tags: [Cars]
 *     summary: Get a car by ID
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
router.get('/:id', (req, res) => {
    const car = cars.find(c => c.id === parseInt(req.params.id));
    if (!car) return res.status(404).send('Car not found');
    res.json(car);
});

/**
 * @swagger
 * /api/cars/add-car:
 *   post:
 *     tags: [Cars]
 *     summary: Add a new car
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
 *       201:
 *         description: Car added successfully.
 *       400:
 *         description: Bad request.
 *       500:
 *         description: Internal server error.
 */
router.post('/add-car', (req, res) => {
    const car = {
        id: cars.length + 1,
        make: req.body.make,
        model: req.body.model,
        year: req.body.year,
        price: req.body.price
    };
    cars.push(car);
    res.status(201).json(car);
});

/**
 * @swagger
 * /api/cars/edit-car/{id}:
 *   put:
 *     tags: [Cars]
 *     summary: Update a car by ID
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
router.put('/edit-car/:id', (req, res) => {
    const car = cars.find(c => c.id === parseInt(req.params.id));
    if (!car) return res.status(404).send('Car not found');
    car.make = req.body.make || car.make;
    car.model = req.body.model || car.model;
    car.year = req.body.year || car.year;
    car.price = req.body.price || car.price;
    res.json(car);
});

/**
 * @swagger
 * /api/cars/delete-car/{id}:
 *   delete:
 *     tags: [Cars]
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
router.delete('/delete-car/:id', (req, res) => {
    const carIndex = cars.findIndex(c => c.id === parseInt(req.params.id));
    if (carIndex !== -1) {
        cars.splice(carIndex, 1);
        res.json({ message: 'Car deleted successfully' });
    } else {
        res.status(404).send(`Car with id ${req.params.id} not found`);
    }
});

module.exports = router;
