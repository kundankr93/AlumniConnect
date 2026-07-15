import express from "express";

import {
  createPost,
  getAllPosts,
  toggleLikePost,
  addComment,
  deleteComment,
  updatePost,
  deletePost,
} from "../controllers/postController.js";

import {
  protect,
} from "../middleware/authMiddleware.js";

const router = express.Router();

// Create a new post
router.post(
  "/",
  protect,
  createPost
);

// Get all posts
router.get(
  "/",
  protect,
  getAllPosts
);

// Like or unlike a post
router.patch(
  "/:postId/like",
  protect,
  toggleLikePost
);

// Add a comment
router.post(
  "/:postId/comments",
  protect,
  addComment
);

// Delete a comment
router.delete(
  "/:postId/comments/:commentId",
  protect,
  deleteComment
);

// Update a post
router.patch(
  "/:postId",
  protect,
  updatePost
);

// Delete a post
router.delete(
  "/:postId",
  protect,
  deletePost
);

export default router;