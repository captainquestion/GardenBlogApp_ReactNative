const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Save garden
router.post('/save', async (req, res) => {
  try {
    const { username, gardenData } = req.body;

    const user = await User.findOne({ username });
    if (user) {
      user.garden = gardenData;
      await user.save();
      res.json({ success: true });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error while saving garden:', error.message);
    res.status(500).send('Server error');
  }
});

// Load garden
router.get('/load/:username', async (req, res) => {
  try {
    const { username } = req.params;

    const user = await User.findOne({ username });
    if (user) {
      res.json(user.garden);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error while loading garden:', error.message);
    res.status(500).send('Server error');
  }
});

// Share garden
router.post('/share', async (req, res) => {
    try {
      const { username, gardenPicture } = req.body; // get gardenPicture from the request
  
      const user = await User.findOne({ username });
      if (user) {
        const postId = `${username}-${Date.now()}`;
        const newPost = {
          garden: user.garden,
          sharedBy: username,
          postId: postId,
          gardenPicture,  // save gardenPicture to post
        };
  
        user.posts.push(newPost);
        await user.save();
  
        res.json({ success: true, uri: gardenPicture }); // return the gardenPicture URI
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    } catch (error) {
      console.error('Error while sharing garden:', error.message);
      res.status(500).send('Server error');
    }
  });

// Get all shared gardens/posts
router.get('/posts', async (req, res) => {
  try {
    const users = await User.find({});
    const allPosts = users.reduce((accum, user) => [...accum, ...user.posts], []);
    res.json(allPosts);
  } catch (error) {
    console.error('Error fetching posts:', error.message);
    res.status(500).send('Server error');
  }
});

// Like a post
router.post('/like/:postId', async (req, res) => {
  try {
    const { postId } = req.params;

    const user = await User.findOne({ 'posts.postId': postId });
    if (user) {
      const post = user.posts.find(p => p.postId === postId);
      post.likes += 1;
      await user.save();
      res.json({ success: true, likes: post.likes });
    } else {
      res.status(404).json({ message: 'Post not found' });
    }
  } catch (error) {
    console.error('Error while liking:', error.message);
    res.status(500).send('Server error');
  }
});

// Dislike a post
router.post('/dislike/:postId', async (req, res) => {
  try {
    const { postId } = req.params;

    const user = await User.findOne({ 'posts.postId': postId });
    if (user) {
      const post = user.posts.find(p => p.postId === postId);
      post.likes -= 1;
      await user.save();
      res.json({ success: true, likes: post.likes });
    } else {
      res.status(404).json({ message: 'Post not found' });
    }
  } catch (error) {
    console.error('Error while disliking:', error.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
