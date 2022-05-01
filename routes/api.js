const express = require('express');
const Recipe = require('../models/recipe');
const User = require('../models/user');
const Comment = require('../models/comment');
const Rating = require('../models/rating');

const router = express.Router();

const { signup, signin, googlelogin } = require('../controllers/auth');
console.log(signup);
router.post('/signup', signup);
router.post('/signin', signin);

router.get('/recipes', (req, res, next) => {
  // This will return all recipes
  Recipe.find({})
    .then((data) => {
      res.json(data)
    })
    .catch(next);
});

router.post('/recipes', (req, res, next) => {
  // This will create a new recipe
  if (req.body.action) {
    Recipe.create(req.body)
      .then((data) => res.json(data))
      .catch(next)
  } else {
    res.json({
      error: 'All fields must be completed!'
    });
  }
});

router.delete('/recipes/:id', (req, res, next) => {
  // This will delete a recipe
  Recipe.findOneAndDelete({ _id: req.params.id })
    .then((data) => res.json(data))
    .catch(next);
});

router.get('/users', (req, res, next) => {
  // This will return all users
  User.find({})
    .then((data) => {
      res.json(data)
    })
    .catch(next);
});

router.get('/comments', (req, res, next) => {
  // This will return all users
  Comment.find({})
    .then((data) => {
      res.json(data)
    })
    .catch(next);
});

router.get('/ratings', (req, res, next) => {
  // This will return all users
  Rating.find({})
    .then((data) => {
      res.json(data)
    })
    .catch(next);
});

router.post('/googlelogin', googlelogin)

module.exports = router;