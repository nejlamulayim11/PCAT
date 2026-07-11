import mongoose from 'mongoose'; 
import express from 'express';
import fileUpload from 'express-fileupload'; 
import methodOverride from 'method-override'; 

// Controller'ları dahil ediyoruz
import { getAllPhotos, getPhoto, createPhoto, updatePhoto, deletePhoto } from './controllers/photoController.js';
import { getAboutPage, getAddPage, getEditPage } from './controllers/pageController.js';

const app = express();

mongoose.connect('mongodb://127.0.0.1/pcat-test-db'); 

app.set("view engine", "ejs");

// MIDDLEWARES
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(fileUpload());
app.use(methodOverride('_method', {
  methods: ['POST', 'GET']
}));

// PHOTO ROUTES
app.get('/', getAllPhotos);
app.get('/photos/:id', getPhoto);
app.post('/photos', createPhoto);
app.put('/photos/:id', updatePhoto);
app.delete('/photos/:id', deletePhoto);

// PAGE ROUTES
app.get('/about', getAboutPage);
app.get('/add', getAddPage);
app.get('/photos/edit/:id', getEditPage);

const port = 3000;
app.listen(port, () => {
    console.log(`Sunucu ${port} portunda MVC yapısı ile başlatıldı..`);
});