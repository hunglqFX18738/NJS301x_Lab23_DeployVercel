const express = require('express');

const postController = require('../controllers/post');

const router = express.Router();

router.get('/all-post', postController.getAllPost);
router.get('/posts', postController.getPosts);

router.get('/post-detail/:postId', postController.getPostDetail);

module.exports = router;
