const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');

//imports
const apiRoutes  = require('./routes/apiRoute');
const userRoutes = require('./routes/userRoute');

//configuração
const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());
app.use(cors({
    origin: process.env.FRONTEND_URL
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
dotenv.config();



app.use('/api', userRoutes);



app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});