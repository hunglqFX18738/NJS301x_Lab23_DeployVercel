const express = require('express');

const { body } = require('express-validator');

const adminController = require('../controllers/admin');

const router = express.Router();

router.use(
  '/add-post',
  [
    body('title', 'Title least 4 characters.').isLength({ min: 4 }),
    body('content', 'Content least 10 characters.').isLength({ min: 10 }),
  ],
  adminController.postAddPost
);

router.get('/edit-post/:postId', adminController.getEditPost);

router.use(
  '/edit-post',
  [
    body('title', 'Title least 4 characters.').isLength({ min: 4 }),
    body('content', 'Content least 10 characters.').isLength({ min: 10 }),
  ],
  adminController.postEditPost
);

router.use('/delete-post', adminController.postDeletePost);

module.exports = router;
