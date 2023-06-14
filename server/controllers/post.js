const Post = require('../models/post');

exports.getAllPost = (req, res, next) => {
  Post.find()
    .then(posts => {
      res.json(posts);
    })
    .catch(err => {
      res.status(500).json({
        status: 'server-error',
      });
    });
};

exports.getPosts = (req, res, next) => {
  Post.find({ creator: req.user })
    .then(posts => {
      res.json(posts);
    })
    .catch(err => {
      res.status(500).json({
        status: 'server-error',
      });
    });
};

exports.getPostDetail = (req, res, next) => {
  const postId = req.params.postId;
  Post.findById(postId)
    .then(post => {
      res.json(post);
    })
    .catch(err => {
      res.status(500).json({
        status: 'server-error',
      });
    });
};
