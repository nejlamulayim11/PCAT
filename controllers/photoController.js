import Photo from '../models/Photo.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getAllPhotos = async (req, res) => {
  const photos = await Photo.find({}).sort('-dateCreated');
  res.render('index', {
    photos,
  });
};

export const getPhoto = async (req, res) => {
  const photo = await Photo.findById(req.params.id);
  res.render('photo', {
    photo,
  });
};

export const createPhoto = async (req, res) => {
  const uploadDir = 'public/uploads';

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }

  let uploadedImage = req.files.image;
  let uniqueImageName = Date.now() + '-' + uploadedImage.name;
  
  // Controller klasörünün içinde olduğumuz için yolu bir üst klasöre (..) çıkacak şekilde ayarladık
  let uploadPath = __dirname + '/../public/uploads/' + uniqueImageName;

  uploadedImage.mv(uploadPath, async () => {
    await Photo.create({
      ...req.body,
      image: '/uploads/' + uniqueImageName,
    });
    res.redirect('/');
  });
};

export const updatePhoto = async (req, res) => {
  const photo = await Photo.findOne({ _id: req.params.id });
  photo.title = req.body.title;
  photo.description = req.body.description;
  await photo.save();

  res.redirect(`/photos/${req.params.id}`);
};

export const deletePhoto = async (req, res) => {
  const photo = await Photo.findOne({ _id: req.params.id });
  let deletedImage = __dirname + '/../public' + photo.image;
  fs.unlinkSync(deletedImage);
  await Photo.findByIdAndDelete(req.params.id);
  
  res.redirect('/');
};