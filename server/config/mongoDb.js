const mongoose = require('mongoose');

const connectDB = async () => {
    mongoose.connection.on('connected', () => {
        console.log('DataBase is connected');
    });

    await mongoose.connect(`${process.env.MONGO_URI}/Mern-Auth`);
};

module.exports = connectDB;