const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const Book = mongoose.model('Book');

beforeAll(async () => {
    await Book.deleteMany();
});

afterAll(async () => {
    await mongoose.connection.close();
});

test('Create a book', async () => {
    const res = await request(app).post('/books').send({
        title: 'Test Book',
        author: 'John Doe',
        publishedYear: 2022,
    });
    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe('Test Book');
});
