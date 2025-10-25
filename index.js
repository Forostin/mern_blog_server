import express from 'express';
import fs from 'fs';
import multer from 'multer';
import cors from 'cors';

import mongoose from 'mongoose';

import { registerValidation, loginValidation, postCreateValidation } from './validations.js';

import  handleValidationErrors  from './utils/handleValidationErrors.js';
import  checkAuth  from './utils/checkAuth.js';

import * as UserController from './controllers/UserController.js';
import * as PostController  from './controllers/PostController.js';

import dotenv from "dotenv";
dotenv.config();

// Constants:
const PORT = 3002;
const DB_USER = process.env.DB_USER;
const PASSWORD = process.env.DB_PASSWORD;
const DB_PASSWORD = encodeURIComponent(`${PASSWORD}`) 
const DB_NAME = process.env.DB_NAME;
const URL = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@myclusterfortest.evvrx.mongodb.net/${DB_NAME}?retryWrites=true&w=majority&appName=MyClusterForTest`

mongoose
     .connect(URL)
     .then(()=> console.log('Connected to MongoDB'))
     .catch((err)=>console.log(`DB connection error: ${err}`))
  // .connect(process.env.MONGODB_URI)
  // .then(() => console.log('DB ok'))
  // .catch((err) => console.log('DB error', err));

const app = express();  

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    if (!fs.existsSync('uploads')) {
      fs.mkdirSync('uploads');
    }
    cb(null, 'uploads');
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});


const upload = multer({ storage });

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));

// app.use('/api/auth', authRoute);
// app.use('/api/posts', postRouter)

app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login);
app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register);
app.get('/auth/me', checkAuth, UserController.getMe);

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});

app.get('/', (req, res)=>{
    return res.json({message : 'All is fine'})
})
app.get('/tags', PostController.getLastTags);

app.get('/posts', PostController.getAll);
app.get('/posts/tags', PostController.getLastTags);
// Правильный порядок:
// ВАЖНО: маршруты сортировки ставим выше чем /posts/:id
app.get('/posts/sortTime', PostController.getSortTimePosts);
app.get('/posts/popular', PostController.getPopularPosts);
app.get('/posts/:id', PostController.getOne);
// app.get('/posts/:id', async (req, res) => {
//   try {
//     const post = await PostModel.findById(req.params.id);
//     if (!post) {
//       return res.status(404).json({ message: "Статья не найдена" });
//     }
//     res.json(post);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Не удалось получить статью" });
//   }
// });


// Функціонал лише для авторизованих користувачів checkAuth:
app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, PostController.create);
app.delete('/posts/:id', checkAuth, PostController.remove);
app.patch(
  '/posts/:id',
  checkAuth,
  postCreateValidation,
  handleValidationErrors,
  PostController.update,
);

app.listen(PORT, (err)=>{
    err ? console.log(err) : console.log(`Listening server ${PORT}`);
});