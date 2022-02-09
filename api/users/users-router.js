const express = require('express');

// You will need `users-model.js` and `posts-model.js` both
const User = require('./users-model');
const Posts = require('../posts/posts-model');

// The middleware functions also need to be required
const { validateUserId, validateUser, validatePost } = require('../middleware/middleware')

const router = express.Router();

router.get('/', (req, res) => {
  // RETURN AN ARRAY WITH ALL THE USERS
  User.get(req.query)
    .then(users => {
      res.status(200).json(users)
    })
    .catch (err => {
      console.log(err)
      res.status(500).json({
        message: 'Error retrieving the users'
      })
    })
});

router.get('/:id', validateUserId, (req, res) => {
  // RETURN THE USER OBJECT
  // this needs a middleware to verify user id
  res.status(200).json(req.user)
    User.getById(req.params.id)
      .then(users => {
        if (users) {
          res.status(200).json(users)
        } else {
          next({
            status: 404,
            message: 'User not found'
          })
          res.status(404).json({
            message: 'User not found'
          })
        }
      })
      .catch(err => {
        console.log(err)
        res.status(500).json({
          message: 'Error retrieving the user'
        })
      })
});

router.post('/', validateUser, (req, res) => {
  // RETURN THE NEWLY CREATED USER OBJECT
  // this needs a middleware to check that the request body is valid
  User.insert({
    name: req.name
  })
    .then(newUser => {
      res.status(201).json(newUser)
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({
        message: 'Error adding the user'
      })
    })
});

router.put('/:id', validateUserId, validateUser, (req, res) => {
  // RETURN THE FRESHLY UPDATED USER OBJECT
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
  User.update(req.params.id, req.body)
    .then(user => {
      if (user) {
        res.status(200).json(user)
      } else {
        res.status(404).json({
          message: 'The user could not be found'
        })
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        message: 'Error updating the hub'
      })
    })
});

router.delete('/:id', validateUserId, (req, res) => {
  // RETURN THE FRESHLY DELETED USER OBJECT
  // this needs a middleware to verify user id
  User.remove(req.params.id)
    .then(count => {
      if (count > 0) {
        res.status(200).json({
          message: 'The user has been removed'
        })
      } else {
        res.status(404).json({
          message: 'The user could not be found'
        })
      }
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({
        message: 'Error removing the user'
      })
    })
});

router.get('/:id/posts', validateUserId, (req, res) => {
  // RETURN THE ARRAY OF USER POSTS
  // this needs a middleware to verify user id
  User.getUserPosts(req.params.id)
    .then(posts => {
      res.status(200).json(posts)
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        message: 'Error getting the post from the user'
      })
    })
});

router.post('/:id/posts', validateUserId, validatePost, (req, res) => {
  // RETURN THE NEWLY CREATED USER POST
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
  const postsInfo = { ...req.body, hub_id: req.params.id };

  Posts.add(postsInfo)
    .then(post => {
      res.status(200).json(post)
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        message: 'Error adding post to the user'
      })
    })
});

// do not forget to export the router

module.exports = router;
