import { connectDB } from "./config.js";
import User from "../user.js";
import Book from "../book.js";
import Review from "../reviews.js";

async function init(){
    const isDev=false
    await User.sync({alter:isDev})
    await Book.sync({alter:isDev})
    await Review.sync({alter:isDev})
}

// Associations
//one user can have multiple reviews
User.hasMany(Review, { foreignKey: "userId" });

//each review belongs to a one user
Review.belongsTo(User, { foreignKey: "userId" });

//one Book can have many reviews
Book.hasMany(Review, { foreignKey: "bookId" });

//each review belongs to a single book
Review.belongsTo(Book, { foreignKey: "bookId" });


const dbInit=()=>{
    init();
    connectDB()
}
export default dbInit;