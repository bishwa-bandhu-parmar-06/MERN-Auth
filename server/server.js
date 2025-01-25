const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const authRouter = require('./routes/auth.routes');
const userRouter = require('./routes/user.routes');
const connectDB = require('./config/mongoDb');
const app = express();
const port = process.env.PORT || 3000;  


connectDB();

// app.use(cors({credentials: true, origin: 'http://localhost:4000'}));
app.use(cors({credentials: true}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



// API Endpoints
app.get('/', (req, res) => {
    res.send('Hello World');
});

app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);


app.listen(port, () => {
  console.log(`Server is running on PORT : ${port}`);
});