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

// View all posts
router.get(
  "/",
  protect,
  getAllPosts
);

// Create a post
router.post(
  "/",
  protect,
  createPost
);
// Update own post
router.patch(
  "/:id",
  protect,
  updatePost
);

// Delete own post
router.delete(
  "/:id",
  protect,
  deletePost
);
// Like or unlike a post
router.patch(
  "/:id/like",
  protect,
  toggleLikePost
);

// Add a comment
router.post(
  "/:id/comments",
  protect,
  addComment
);

// Delete own comment
router.delete(
  "/:postId/comments/:commentId",
  protect,
  deleteComment
);

export default router;