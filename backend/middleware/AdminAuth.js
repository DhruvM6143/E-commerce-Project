import jwt from 'jsonwebtoken'


const adminAuth = async (req, res, next) => {
    try {
        const { token } = req.headers
        if (!token) {
            return res.status(401).json({ message: 'Token is required' })
        }
        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET)
        if (tokenDecode !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD) {
            return res.status(401).json({ message: 'Invalid token' })
        }
        next();
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server Error' })

    }
}

export default adminAuth;