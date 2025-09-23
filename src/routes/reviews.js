import { Router } from "express";
import Review from "../models/reviews.js";

const ReviewRouter = Router();

//update the exiting review
ReviewRouter.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;  //review Id

        const { rating, comment } = req.body
        const userId = req.user.id

        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: "Unauthorized.Authentication Required" });
        }


        const existingReview = await Review.findByPk(id);

        //find the review
        if (!existingReview) {
            return res.status(400).json({ message: "Review Not found" })
        }

        //make sure that review belongs to the logged-in user
        if (existingReview.userId !== userId) {
            return res.status(403).json({ message: "you can only update your own reviews" })
        }

        //validate rating
        if (rating && (rating < 1 || rating > 5)) {
            return res.status(400).json({ message: "Rating must be between 1 and 5" });
        }

        // 4. Update review
        existingReview.rating = rating ?? existingReview.rating;
        existingReview.comment = comment ?? existingReview.comment;
        await existingReview.save();

        res.json({ message: "Review Updated successfully..", review: existingReview })


    } catch (err) {
        res.status(500).json({ message: "Failed to update Comment", error: err.message })
    }
})

ReviewRouter.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params   //review id
        console.log(id)
        const userId = req.user.id

         if (!req.user || !req.user.id) {
            return res.status(401).json({ message: "Unauthorized.Authentication Required" });
        }

        //find the review
        const existingReview = await Review.findByPk(id);
        if (!existingReview) {
            res.status(400).json({ message: "Review Not Found" })
        }

        //make sure review belongs to the logged-in user
        if (existingReview.userId !== userId) {
            res.status(403).json({ message: "You can delete only Your own reviews" })
        }

        //delete review
        await existingReview.destroy();

        res.json({ message: "Review Deleted Successfully" })

    } catch (err) {
        res.status(500).json({ message: "Error in Deleting the review", error: err.message })
    }
})

export default ReviewRouter