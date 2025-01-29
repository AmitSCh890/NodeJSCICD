const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL || 'mongodb://mongo:27017/books', {
   

// Define the book schema
const bookSchema = new mongoose.Schema({
    title: String,
    author: String,
    publishedYear: Number,
});

const Book = mongoose.model('Book', bookSchema);

// Health check route
app.get('/', (req, res) => {
    res.send('API is running!');
});

// Create a new book
app.post('/books', async (req, res) => {
    try {
        const book = await Book.create(req.body);
        res.status(201).json(book);
    } catch (err) {
        res.status(400).json({ error: err.message });
		}
});

// Get all books
app.get('/books', async (req, res) => {
    const books = await Book.find();
    res.json(books);
});

// Get a book by ID
app.get('/books/:id', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) return res.status(404).json({ error: 'Book not found' });
        res.json(book);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Update a book by ID
app.put('/books/:id', async (req, res) => {
    try {
        const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!book) return res.status(404).json({ error: 'Book not found' });
        res.json(book);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Delete a book by ID
app.delete('/books/:id', async (req, res) => {
    try {
        const book = await Book.findByIdAndDelete(req.params.id);
        if (!book) return res.status(404).json({ error: 'Book not found' });
        res.json({ message: 'Book deleted' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Export the app for testing
module.exports = app;

// Start the server if not in test environment
if (process.env.NODE_ENV !== 'test') {
    const PORT = 3000;
    app.listen(PORT,() => {
        console.log(`Server running on port ${PORT}`);
    });
}