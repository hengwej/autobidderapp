require('express-async-errors');

const express = require('express');
const cors = require('cors');
const app = express();
const port = 5000;


app.use(cors());
app.use(express.json());


const carRoutes = require('./api/cars');
const userRoutes = require('./api/users');
const accountRoutes = require('./api/accounts');
const authRoutes = require('./api/auth');


app.use('/api/cars', carRoutes);
app.use('/api/users', userRoutes);
app.use('/api/accounts', accountRoutes);
app.use('/api/auth', authRoutes);


app.get('/', (req, res) => {
  res.send('Hello from Express!');
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);

});