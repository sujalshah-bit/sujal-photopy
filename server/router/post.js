// routes/post.js
const express = require('express');
const Post = require('../models/postSchema');
const Like = require('../models/likeSchema');
const Comment = require('../models/commentSchema');
const { authenticateUser } = require('../middleware/auth');

const router = express.Router();

// Get all posts
router.get('/',async (req, res) => {
  try {
    const posts = await Post.find().populate({
      path: 'comments',
      populate: { path: 'user', select: 'username' }, // Populating user information for comments
    }).populate('createdBy', 'username');
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get posts uploaded by the logged-in user
router.get('/my-posts', authenticateUser,async (req, res) => {
  try {
    const userId = req.user;
    // console.log(userId);
    const myPosts = await Post.find({ createdBy: userId }).populate('createdBy', 'username');
    // console.log(myPosts);
    res.json(myPosts);
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
});
router.get('/:id', authenticateUser, async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Post.findById(postId)
      .populate('createdBy', 'username') // Populating createdBy with the 'username' field
      .populate({
        path: 'comments',
        populate: { path: 'user', select: 'username' }, // Populating user information for comments
      });

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.json(post);
  } catch (err) {
    console.log(`error`, err);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// Create a new post
router.post('/', authenticateUser,async (req, res) => {
  try {
    const { image, slug, tags } = req.body;
    // console.log(image,slug,tags);
  // Create a new Post instance using the extracted data
  const newPost = new Post({
    image, // This should be the URL of the image
    slug,
    tags: Array.isArray(tags) ? tags : [tags], // Convert comma-separated tags to an array
    createdBy: req.user, // Assuming you have middleware to set the user in the request object
  });

  // Save the new post to the database
  await newPost.save();

  res.json(newPost);
} catch (err) {
  console.log(`Error: ${err}`);
  res.status(500).json({ message: 'Internal server error' });
}
});


router.put('/:postId', authenticateUser,async (req, res) => {
  try {
    const postId = req.params.postId;
    const userId = req.user;
    const { slug, tags } = req.body;

    const post = await Post.findOne({ _id: postId, createdBy: userId });
    if (!post) return res.status(404).json({ message: 'Post not found or unauthorized' });

    if (slug) {
      post.slug = slug;
    }

    if (tags) {
      post.tags = tags.split(',').map((tag) => tag.trim());
    }

    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete a post
router.delete('/:postId', authenticateUser,async (req, res) => {
  try {
    const postId = req.params.postId;
    const userId = req.user;

    const post = await Post.findOneAndRemove({ _id: postId, createdBy: userId });
    if (!post) return res.status(404).json({ message: 'Post not found or unauthorized' });

    res.json({ message: 'Post deleted successfully' });
  } catch (err) {
    console.log(`error:${err}`)
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Like a post
router.post('/:postId/like', authenticateUser, async (req, res) => {
  try {
    const postId = req.params.postId;
    const userId = req.user;
    // console.log(userId);
    // Check if the user has already liked the post
    const isLiked = await Like.find({
      $and: [
        { user: userId },
        { post: postId },
      ]
    })
    const post = await Post.findById(postId)
    // const isLiked = post.likes.user.some((like) => like.equals(userId));
    // console.log("Empty",isLiked)
    if (isLiked && isLiked.length > 0) {
      const likesId = isLiked[0]._id
      // If the post is already liked, then unlike it
      post.likes = post.likes.filter((like) => !like.equals(likesId));
      await post.save();

      // Delete the corresponding like record
      await Like.findOneAndDelete({ post: postId, user: userId });

      return res.json({ message: 'Post unliked successfully' });
    } else {
      // If the user hasn't liked the post, create a new like record
      const like = new Like({ post: postId, user: userId });
      await like.save();

      post.likes.push(like._id);
      await post.save();

      return res.json({ message: 'Post liked successfully' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});



// Comment on a post
router.post('/:postId/comment', authenticateUser,async (req, res) => {
  try {
    const postId = req.params.postId;
    const userId = req.user;
    const { text } = req.body;

    const comment = new Comment({ post: postId, user: userId, text });
    await comment.save();

    const post = await Post.findById(postId);
    post.comments.push(comment);
    await post.save();

    res.json({ message: 'Comment added successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;