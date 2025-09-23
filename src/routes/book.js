import express from "express";
import { Router } from "express";
import Book from "../models/book.js";
import Review from "../models/reviews.js";
import { Op } from "sequelize";


const BookRouter = Router();

const MAX_LIMIT = 50;
const DEFAULT_LIMIT = 10;

//Add a new Book(authenticated users only)

BookRouter.post('/', async (req, res) => {
    try {
        const { title, author, genre, publishedYear } = req.body;

        if (!title || !author || !genre) {
            return res.status(400).json({ message: "Title, author, and genre are required" })
        }

        // check for Book Existing
        const existingBook = await Book.findOne({ where: { title, author } })
        if (existingBook) {
            return res.status(400).json({ message: "Book Already Exists.." })
        }

        const book = await Book.create({
            title,
            author,
            genre,
            publishedYear
        }
        )
        res.status(201).json({ message: "Book Created Succesfully", data: book })

    }
    catch (err) {
        res.status(500).json({ message: "Error in Creating Book", error: err.message })
    }
})


//get all books with pagination and filters
BookRouter.get("/", async (req, res) => {
    try {
        let page = parseInt(req.query.page, 10) || 1
        let limit = parseInt(req.query.limit, 10) || DEFAULT_LIMIT;

        if (page < 1) page = 1;
        if (limit < 1) limit = DEFAULT_LIMIT;
        if (limit > MAX_LIMIT) limit = MAX_LIMIT;

        const offset = (page - 1) * limit

        const where = {}

        if (req.query.q) {
            where[Op.or] = [
                { title: { [Op.iLike]: `%${req.query.q.trim()}%` } },
                { author: { [Op.iLike]: `%${req.query.q.trim()}%` } },
                { genre: { [Op.iLike]: `%${req.query.q.trim()}%` } }
            ];
        }
        const { count, rows } = await Book.findAndCountAll({
            where,
            limit,
            offset,
        });

        res.json({
            success: true,
            data: rows,
            meta: {
                totalItems: count,
                currentPage: page,
                totalPages: Math.ceil(count / limit),
                pageSize: limit,

            }
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Internal Server Error" })
    }
})

//Get book details by ID, including:Average rating Reviews (with pagination)
BookRouter.get('/:id', async (req, res) => {
    try {

        const { id } = req.params;
        console.log(id)

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;

        //get book details
        const book = await Book.findByPk(id);
        if (!book) {
            return res.status(404).json({ message: "Book Not Found" })
        }

        //get reviews (with pagination and userInfo) + avg rating
        const reviews = await Review.findAndCountAll({
            where: { bookId: id },
            offset: (page - 1) * limit,
            limit,
            include: ["User"]
        })

        //caluculate avg rating
        const avgRating = await Review.findOne({
            where: { bookId: id },
            attributes: [[Book.sequelize.fn("AVG", Book.sequelize.col("rating")), "avgRating"]],
            raw: true
        })

        res.json({
            book,
            avgRating: avgRating?.avgRating || 0,
            reviews: {
                total: reviews.count,
                page,
                pages: Math.ceil(reviews.count / limit),
                data: reviews.rows,
            }
        })

    } catch (err) {
        res.status(500).json({ message: "Error fetching book details", error: err.message })
    }
})

//post review to book if not done before
BookRouter.post('/:id/review', async (req, res) => {
    try {

        const { id } = req.params;   //book id

        const { comment, rating } = req.body;
        const userId = req.user.id
        console.log(userId)

        //validate input fields
        if (!rating || isNaN(rating)) {
            return res.status(400).json({ message: "Rating is required and must be a number" })
        }

        if (rating < 1 || rating > 5) {
            return res.status(400).json({ message: "rating must be between 1 and 5" })
        }

        if (!comment) {
            return res.status(400).json({ message: "comment required" })
        }

        if (comment && comment.length > 500) {
            return res.status(400).json({ message: "comment must not exceed 500 characters" })
        }

        //check Book exists
        const existingBook = await Book.findByPk(id)
        if (!existingBook) {
            return res.status(404).json({ message: "Book Not Found" })
        }

        //check if user already reviewed this book
        const existingreview = await Review.findOne({
            where: { bookId: id, userId }
        })

        if (existingreview) {
            return res.status(400).json({ message: "You have already reviewed  this Book" })
        }

        //create new review
        const review = await Review.create({
            bookId: id,
            userId,
            rating,
            comment
        })

        res.status(201).json({ message: "Review Submitted succefully...", review })
    }
    catch (err) {
        res.status(500).json({ message: "Error in sunbmitting review", error: err.message })
    }

})

export default BookRouter