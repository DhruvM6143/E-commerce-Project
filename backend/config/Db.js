import mongoose from "mongoose";

const connectDb = async () => {

    try {
        const connectionInstance = await mongoose.connect(`${process.env.DB_URI}/E-commerceP`)
        console.log(`Mongoose Connected to ${connectionInstance.connection.host}`);

    } catch (error) {
        console.log(error);
        process.exit(1);

    }

}

export default connectDb;