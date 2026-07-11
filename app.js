import mongoose from 'mongoose'; 
import express from 'express';
import ejs from 'ejs';
import path from 'path';
import { fileURLToPath } from 'url';
import Photo from './models/Photo.js';
import fileUpload from 'express-fileupload'; // Hatalı import düzeltildi
import fs from 'fs'; // Dosya/Klasör işlemleri için fs modülü eklendi
import methodOverride from 'method-override'; // method-override modülü eklendi

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

mongoose.connect('mongodb://127.0.0.1/pcat-test-db'); 

app.set("view engine", "ejs");

const myLogger = (req, res, next) => {
    console.log("middleware log 1");
    next(); 
}

// MİDDLEWARES
app.use(express.static('public'));
app.use(myLogger);
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(fileUpload());
app.use(methodOverride('_method', {
  methods: ['POST', 'GET']
})); // POST metodunu PUT'a çevirmesi için middleware eklendi

// ROUTES
app.get('/', async (req, res) => {
    const photos = await Photo.find({});
    res.render('index', {
        photos
    }); 
});

app.get('/photos/:id', async (req, res) => {
    const photo = await Photo.findById(req.params.id); 
    res.render('photo', {
        photo
    });
});

app.get('/about', (req, res) => {
    res.render('about'); 
});

app.get('/add', (req, res) => {
    res.render('add'); 
});

// GET ROUTE - Edit sayfasını açmak için eklendi
app.get('/photos/edit/:id', async (req, res) => {
    const photo = await Photo.findOne({ _id: req.params.id });
    res.render('edit', {
        photo,
    });
});

// GÜNCELLENMİŞ POST ROUTE
app.post('/photos', async (req, res) => {
    // 1. Yükleme yapılacak klasörün yolu
    const uploadDir = 'public/uploads';

    // 2. Eğer public/uploads klasörü yoksa oluştur
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir);
    }

    // 3. Formdan gelen görseli yakala
    let uploadedImage = req.files.image;
    
    // 4. Aynı isimli dosyaların üzerine yazılmaması için ismin başına tarih damgası ekle
    let uniqueImageName = Date.now() + '-' + uploadedImage.name; 
    let uploadPath = __dirname + '/public/uploads/' + uniqueImageName;

    // 5. Görseli public/uploads klasörüne taşı (mv)
    uploadedImage.mv(uploadPath, async () => {
        // Taşıma bittikten sonra veritabanına yeni isimiyle kaydet
        await Photo.create({
            ...req.body,
            image: '/uploads/' + uniqueImageName, 
        });
        
        // İşlem bitince anasayfaya dön
        res.redirect('/');
    });
});

// PUT ROUTE - Fotoğraf bilgilerini güncellemek için eklendi
app.put('/photos/:id', async (req, res) => {
    const photo = await Photo.findOne({ _id: req.params.id });
    photo.title = req.body.title;
    photo.description = req.body.description;
    await photo.save();

    res.redirect(`/photos/${req.params.id}`);
});

const port = 3000;
app.listen(port, () => {
    console.log(`Sunucu ${port} portunda başlatıldı..`);
});