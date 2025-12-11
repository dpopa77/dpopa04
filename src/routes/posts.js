const express = require('express');
const Post = require('../models/Post');
const auth = require('../middleware/auth');

const router = express.Router();

/* ---------------------------------------------------
   Helper: Time left before expiration (in seconds)
--------------------------------------------------- */
function getTimeLeftSeconds(expiresAt) {
  const now = new Date();
  const diffMs = new Date(expiresAt) - now;
  return diffMs > 0 ? Math.floor(diffMs / 1000) : 0;
}

/* ---------------------------------------------------
   Create Post - POST /api/posts
--------------------------------------------------- */
router.post('/', auth, async (req, res) => {
  try {
    const { title, topics, body, expiresAt, ownerName } = req.body;

    if (!title || !topics || !body || !expiresAt || !ownerName) {
      return res.status(400).json({ error: 'Missing required fields.' });
    }

    const newPost = new Post({
      title,
      topics,
      body,
      expiresAt,
      ownerName
    });

    await newPost.save();

    res.json({
      message: "Post created successfully",
      post: {
        id: newPost._id,
        title: newPost.title,
        topics: newPost.topics,
        status: newPost.status
      }
    });

  } catch (err) {
    console.error("Create post error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/* ---------------------------------------------------
   Get posts by topic - GET /api/posts/topic/:topic
--------------------------------------------------- */
router.get('/topic/:topic', auth, async (req, res) => {
  try {
    const topic = req.params.topic;

    const posts = await Post.find({ topics: topic });

    const formatted = posts.map(p => ({
      id: p._id,
      title: p.title,
      ownerName: p.ownerName,
      topics: p.topics,
      status: p.status,
      likes: p.likes,
      dislikes: p.dislikes,
      comments: p.comments
    }));

    res.json(formatted);

  } catch (err) {
    console.error("Get posts by topic error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/* ---------------------------------------------------
   Like Post - POST /api/posts/:id/like
--------------------------------------------------- */
router.post('/:id/like', auth, async (req, res) => {
  try {
    const id = req.params.id;
    const post = await Post.findById(id);

    if (!post) return res.status(404).json({ error: "Post not found." });

    if (post.ownerName === req.user.username) {
      return res.status(400).json({ error: "Post owner cannot like their own post." });
    }

    if (new Date() >= post.expiresAt) {
      return res.status(400).json({ error: "Cannot interact with an expired post." });
    }

    post.likes += 1;
    await post.save();

    res.json({
      message: "Post liked successfully",
      likes: post.likes,
      timeLeftSeconds: getTimeLeftSeconds(post.expiresAt)
    });

  } catch (err) {
    console.error("Like post error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/* ---------------------------------------------------
   Dislike Post - POST /api/posts/:id/dislike
--------------------------------------------------- */
router.post('/:id/dislike', auth, async (req, res) => {
  try {
    const id = req.params.id;
    const post = await Post.findById(id);

    if (!post) return res.status(404).json({ error: "Post not found." });

    if (post.ownerName === req.user.username) {
      return res.status(400).json({ error: "Post owner cannot dislike their own post." });
    }

    if (new Date() >= post.expiresAt) {
      return res.status(400).json({ error: "Cannot interact with an expired post." });
    }

    post.dislikes += 1;
    await post.save();

    res.json({
      message: "Post disliked successfully",
      dislikes: post.dislikes,
      timeLeftSeconds: getTimeLeftSeconds(post.expiresAt)
    });

  } catch (err) {
    console.error("Dislike post error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/* ---------------------------------------------------
   Comment on Post - POST /api/posts/:id/comment
--------------------------------------------------- */
router.post('/:id/comment', auth, async (req, res) => {
  try {
    const id = req.params.id;
    const { comment } = req.body;

    if (!comment) {
      return res.status(400).json({ error: "Comment cannot be empty." });
    }

    const post = await Post.findById(id);

    if (!post) return res.status(404).json({ error: "Post not found." });

    if (new Date() >= post.expiresAt) {
      return res.status(400).json({ error: "Cannot comment on an expired post." });
    }

    post.comments.push({
      user: req.user.username,
      comment
    });

    await post.save();

    res.json({
      message: "Comment added",
      comments: post.comments,
      timeLeftSeconds: getTimeLeftSeconds(post.expiresAt)
    });

  } catch (err) {
    console.error("Comment error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/* ---------------------------------------------------
   Most Active Post - GET /api/posts/most-active/:topic
--------------------------------------------------- */
router.get('/most-active/:topic', auth, async (req, res) => {
  try {
    const topic = req.params.topic;

    const posts = await Post.find({ topics: topic });

    if (posts.length === 0) {
      return res.status(404).json({ error: "No posts found for this topic." });
    }

    const livePosts = posts.filter(p => new Date() < p.expiresAt);

    if (livePosts.length === 0) {
      return res.status(404).json({ error: "No active posts found." });
    }

    // Calculate activity score = likes + dislikes + comments count
    const scored = livePosts.map(p => ({
      post: p,
      activity: (p.likes || 0) + (p.dislikes || 0) + (p.comments.length || 0)
    }));

    scored.sort((a, b) => b.activity - a.activity);

    const mostActive = scored[0].post;

    res.json({
      id: mostActive._id,
      title: mostActive.title,
      ownerName: mostActive.ownerName,
      likes: mostActive.likes,
      dislikes: mostActive.dislikes,
      comments: mostActive.comments.length,
      status: mostActive.status
    });

  } catch (err) {
    console.error("Most active post error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
