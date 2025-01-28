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
// const allowedOrigins = ['http://localhost:5173', 'http://localhost:4000'];

// app.use(cors({
//   origin: function (origin, callback) {
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
//   credentials: true
// }));




const allowedOrigins = ['https://mern-authentication-backend-lkle.onrender.com'];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
// app.use(cors({credentials: true}));

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
