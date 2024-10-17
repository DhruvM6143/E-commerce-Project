import jwt from 'jsonwebtoken'


const authUser = async (req, res, next) => {
    const { token } = req.headers

    if (!token) {
        return res.status(401).json({ message: 'Not authorized' })
    }
    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        req.body.userId = decode.id
        next();

    } catch (error) {
        console.log(error);
        res.status(401).json({ message: 'Token is invalid' })

    }

}

export default authUser;