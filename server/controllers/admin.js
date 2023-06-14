const { validationResult } = require('express-validator');

const io = require('../socket');

const fileHelper = require('../util/file');

const Post = require('../models/post');

exports.postAddPost = (req, res, next) => {
  const title = req.body.title;
  const image = req.file;
  const content = req.body.content;
  if (!image) {
    return res.json({
      errorMessage: 'Attached file is not an image.',
      status: 'fail',
    });
  }
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    fileHelper.deleteFile(image.path);
    return res.json({
      errorMessage: errors.array()[0].msg,
      status: 'fail',
    });
  }
  const imageUrl = image.path;
  const post = new Post({
    // _id: new mongoose.Types.ObjectId('647720fd8e164078d0e3eff2'),
    title: title,
    imageUrl: imageUrl,
    content: content,
    creator: req.user,
    dateCreated: new Date(),
    dateModify: new Date(),
  });
  post
    .save()
    .then(result => {
      io.getIO().emit('posts', {
        action: 'add',
      });
      console.log('Created Post');
      res.json({ status: 'success' });
    })
    .catch(err => {
      res.status(500).json({
        status: 'server-error',
      });
    });
};

exports.getEditPost = (req, res, next) => {
  // const editMode = req.query.edit;
  // if (!editMode) {
  //   return res.redirect('/');
  // }
  const postId = req.params.postId;
  Post.findById(postId)
    .then(post => {
      if (!post) {
        return res.json({ status: 'fail' });
      }
      res.json({ status: 'success', postData: post });
    })
    .catch(err => {
      res.status(500).json({
        status: 'server-error',
      });
    });
};

exports.postEditPost = (req, res, next) => {
  const postId = req.body.postId;
  const updatedTitle = req.body.title;
  const updatedContent = req.body.content;
  const image = req.file;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    if (image) {
      fileHelper.deleteFile(image.path);
    }
    return res.json({
      errorMessage: errors.array()[0].msg,
      status: 'fail',
    });
  }
  Post.findById(postId)
    .then(post => {
      post.title = updatedTitle;
      post.content = updatedContent;
      post.dateModify = new Date();
      if (image) {
        fileHelper.deleteFile(post.imageUrl);
        post.imageUrl = image.path;
      }
      return post.save();
    })
    .then(result => {
      io.getIO().emit('posts', {
        action: 'edit',
      });
      console.log('UPDATED POST!');
      res.json({ status: 'success' });
    })
    .catch(err => {
      res.status(500).json({
        status: 'server-error',
      });
    });
};

exports.postDeletePost = (req, res, next) => {
  const postId = req.body.postId;
  Post.findByIdAndRemove(postId)
    .then(post => {
      fileHelper.deleteFile(post.imageUrl);
      io.getIO().emit('posts', {
        action: 'delete',
      });
      console.log('DESTROYED POST');
      res.json({ status: 'success' });
    })
    .catch(err => {
      res.status(500).json({
        status: 'server-error',
      });
    });
};
