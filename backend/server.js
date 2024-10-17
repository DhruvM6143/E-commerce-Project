import express from 'express'
import cors from 'cors';

import 'dotenv/config'
import connectDb from './config/Db.js';
import connectCloudinary from './config/Cloudinary.js';


//App Config

const app = express();
const PORT = process.env.PORT || 4000;

connectDb().then(() => {
    console.log(`Mongoose Connected to port ${PORT}`);

}).catch((err) => {
    console.log(err);

})
connectCloudinary()

app.get('/', (req, res) => {
    res.send('Api working');

})

//middleware

app.use(express.json())
app.use(cors())

//api endpoints

import userRouter from './routes/userRoute.js';
app.use('/api/user', userRouter)

//api endpoints for product route

import productRouter from './routes/productRoute.js';
app.use('/api/product', productRouter)


import cartRouter from './routes/CartRoutes.js';
app.use('/api/cart', cartRouter)

import orderRouter from './routes/OrderRoute.js';
app.use('/api/order', orderRouter)

app.listen(PORT, () => console.log(`Server started at ${PORT}`));



