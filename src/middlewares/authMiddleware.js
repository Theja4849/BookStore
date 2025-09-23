import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'

dotenv.config()

const JWT_SECRET_KEY = process.env.JWT_SECRET;

if (!JWT_SECRET_KEY) {
    throw new error('JWT_SECRET is not defined')
}

const authMiddleware = (req, res, next) => {

 
    const authHeader = req.headers["authorization"];
    console.log(authHeader)

    const token = authHeader && authHeader.startsWith("Bearer ")
        ? authHeader.slice(7).trim()
        : null;

    if (!token) {
        return res.status(401).json({ message: "Access Denied.No Token Provided" })
    }
    // decode the token and attached to the request object
    try {

        const decoded = jwt.verify(token, JWT_SECRET_KEY)
        req.user = decoded;
        
        next();
    }
    catch (err) {
        res.status(400).json({ message: "Invalid Token" })
    }
}

export default authMiddleware



