import { Router } from "express";
import UserRouter from "./user.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import BookRouter from "./book.js";
import ReviewRouter from "./reviews.js";

const routes=Router()

//user routes
routes.use('/user',UserRouter)

//book routes
routes.use('/book',authMiddleware,BookRouter)

//reviews routes
routes.use('/reviews',authMiddleware,ReviewRouter)

export default routes