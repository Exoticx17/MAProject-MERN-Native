const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const crypto = require('crypto');
const mongoose = require('mongoose');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage').GridFsStorage;
const Grid = require('gridfs-stream');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const postRoutes = require('./routes/postRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(methodOverride('_method'));
app.use(express.json());
app.use(cookieParser());
const corsOpts = {
  origin: 'http://192.168.4.64:5000'
}
app.use(cors(corsOpts));

// Routes
app.use('/posts', postRoutes);
app.use('/user', userRoutes);

const port = 5000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
