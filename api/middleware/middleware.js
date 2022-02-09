const User = require('../users/users-model');

function logger(req, res, next) {
  // DO YOUR MAGIC
  console.log(req.method, req.url, req.timestamp);
  next();
};

async function validateUserId(req, res, next) {
  // DO YOUR MAGIC
  try {
    let id = req.params.id;
    let result = await User.findById(id);
    if (result == null) {
      res.status(404).json({
        message: 'The user could not be found'
      })
    } else {
      req.user = result
      next();
    }
  }
  catch (e) {
    res.status(500).json({
      message: 'Error finding user'
    })
  }
};

function validateUser(req, res, next) {
  // DO YOUR MAGIC
  const { name } = req.body;
  if (!name || !name.trim()) {
    res.status(400).json({
      message: 'Name required'
    })
  } else {
    req.name = name.trim()
    next();
  }
};

function validatePost(req, res, next) {
  // DO YOUR MAGIC
  if(!req.body.sender) {
    res.status(404).json({
      message: 'We need a sender!'
    })
  } else if (!req.body.text) {
    res.status(404).json({
      message: 'No text found!'
    })
  } else {
    next();
  }
}

// do not forget to expose these functions to other modules

module.exports = {
  logger,
  validateUserId,
  validateUser,
  validatePost
}