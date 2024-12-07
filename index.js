const express = require('express');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const app = express();
app.use(express.json());
app.get('/', (req, res) => {
    res.send('Welcome to the Prisma API!');
});

// GET 
app.get('/users', async (req, res) => {
    try {
        const users = await prisma.user.findMany();
        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

// POST /add-user - Insert a new user
app.post('/add-user', async (req, res) => {
    const { name, email } = req.body;
    if (!name || !email) {
        return res.status(400).json({ error: 'Name and email are required' });
    }

    try {
        const user = await prisma.user.create({
            data: {
                name,
                email,
            },
        });
        res.status(201).json(user);
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Failed to create user' });
    }
});

// PUT  - Update an existing user's details
app.put('/update-user/:id', async (req, res) => {
    const { id } = req.params;
    const { name, email } = req.body;

    if (!name || !email) {
        return res.status(400).json({ error: 'Name and email are required' });
    }

    try {

        const user = await prisma.user.update({
            where: { id: Number(id) },
            data: { name, email },
        });

        res.status(200).json(user);
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Failed to update user' });
    }
});

// DELETE - Delete a user from the database
app.delete('/delete-user/:id', async (req, res) => {
    const { id } = req.params;

    try {

        const user = await prisma.user.delete({
            where: { id: Number(id) },
        });

        res.status(200).json(user);
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Failed to delete user' });
    }
});

app.use((req, res) => {
    res.status(404).send('Route not found');
});

// Start the server
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
