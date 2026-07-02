import mongoose from 'mongoose'; 
import express from 'express';
import ejs from 'ejs';
import path from 'path';
import { fileURLToPath } from 'url';
import Photo from './models/Photo.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

mongoose.connect('mongodb://127.0.0.1/pcat-test-db'); 

app.set("view engine","ejs");

const myLogger = (req,res,next) =>{
    console.log("middleware log 1");
    next(); 
}

app.use(express.static('public'));
app.use(myLogger);
app.use(express.urlencoded({extended:true}));
app.use(express.json());

app.get('/', async (req,res) =>{
   const photos = await Photo.find({})
   res.render('index',{
      photos
   }); 
})

app.get('/about',(req,res) =>{
   res.render('about') 
})

app.get('/add',(req,res) =>{
   res.render('add') 
})

app.post('/photos', async (req,res) =>{
   await Photo.create(req.body)
   res.redirect('/')
})

const port = 3000;
app.listen(port,() => {
    console.log(`Sunucu ${port} portunda başlatıldı..`)
})