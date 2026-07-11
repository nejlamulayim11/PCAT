import Photo from '../models/Photo.js';

export const getAboutPage = (req, res) => {
  res.render('about');
};

export const getAddPage = (req, res) => {
  res.render('add');
};

export const getEditPage = async (req, res) => {
  const photo = await Photo.findOne({ _id: req.params.id });
  res.render('edit', {
    photo,
  });
};