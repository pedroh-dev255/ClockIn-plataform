const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');

//route imports
const regisRoutes  = require('./routes/regisRoute');
const userRoutes = require('./routes/userRoute');
const empRoutes = require('./routes/empRoute');
const authMiddleware = require('./middlewares/authMiddleware');

//configs
const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());
app.use(cors({
    origin: [
      process.env.FRONTEND_URL,
      'localhost',
      'http://localhost:5173'
    ]
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
dotenv.config();



app.use('/api/users', userRoutes);

app.use('/api/registros', regisRoutes);

app.use('/api/emp', empRoutes);

app.use('/api/validateToken', authMiddleware, (req, res) => {
    res.status(200).json({
      success: true,
      message: 'Token is valid' });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});