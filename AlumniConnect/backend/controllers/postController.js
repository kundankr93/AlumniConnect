import Post from "../models/Post.js";

export const createPost = async (
  req,
  res
) => {
  try {
    const { content, image } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: "Post content is required",
      });
    }

    const post = await Post.create({
      author: req.user._id,
      content: content.trim(),
      image: image || "",
    });

    await post.populate(
      "author",
      "name email role profileImage"
    );

    return res.status(201).json({
      success: true,
      message: "Post created successfully",
      post,
    });
  } catch (error) {
    console.error(
      `Create post error: ${error.message}`
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error while creating post",
    });
  }
};

export const getAllPosts = async (
  req,
  res
) => {
  try {
    const posts = await Post.find()
      .populate(
        "author",
        "name email role profileImage"
      )
      .populate(
        "comments.user",
        "name role profileImage"
      )
      .sort({
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      count: posts.length,
      posts,
    });
  } catch (error) {
    console.error(
      `Get all posts error: ${error.message}`
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error while fetching posts",
    });
  }
};

export const toggleLikePost = async (
  req,
  res
) => {
  try {
    // The route uses:
    // /:postId/like
    // Therefore, use req.params.postId

    const { postId } = req.params;

    const post =
      await Post.findById(
        postId
      );

    if (!post) {
      return res
        .status(404)
        .json({
          success: false,

          message:
            "Post not found",
        });
    }

    const userId =
      req.user._id.toString();

    // Check whether the current
    // user has already liked the post

    const alreadyLiked =
      post.likes.some(
        (like) =>
          like.toString() ===
          userId
      );

    let message;

    // Unlike the post

    if (alreadyLiked) {
      post.likes =
        post.likes.filter(
          (like) =>
            like.toString() !==
            userId
        );

      message =
        "Like removed successfully";
    }

    // Like the post

    else {
      post.likes.push(
        req.user._id
      );

      message =
        "Post liked successfully";
    }

    await post.save();

    return res
      .status(200)
      .json({
        success: true,

        message,

        liked:
          !alreadyLiked,

        likesCount:
          post.likes.length,

        likes:
          post.likes,
      });
  } catch (error) {
    console.error(
      "Toggle post like error:",
      error.message
    );

    if (
      error.name ===
      "CastError"
    ) {
      return res
        .status(400)
        .json({
          success: false,

          message:
            "Invalid post ID",
        });
    }

    return res
      .status(500)
      .json({
        success: false,

        message:
          "Server error while updating post like",
      });
  }
};

export const addComment = async (
  req,
  res
) => {
  try {
    const { text } = req.body;

    // Check whether comment is empty
    if (
      !text ||
      !text.trim()
    ) {
      return res
        .status(400)
        .json({
          success: false,
          message:
            "Comment text is required",
        });
    }

    // Route contains :postId
    const { postId } =
      req.params;

    // Find the selected post
    const post =
      await Post.findById(
        postId
      );

    if (!post) {
      return res
        .status(404)
        .json({
          success: false,
          message:
            "Post not found",
        });
    }

    // Create comment object
    const newComment = {
      user: req.user._id,
      text: text.trim(),
    };

    // Add comment to post
    post.comments.push(
      newComment
    );

    // Save updated post
    await post.save();

    // Get newly created comment
    const createdComment =
      post.comments[
        post.comments.length -
          1
      ];

    // Populate user details
    await post.populate({
      path: "comments.user",
      select:
        "name email role profileImage",
    });

    // Find populated comment
    const populatedComment =
      post.comments.id(
        createdComment._id
      );

    return res
      .status(201)
      .json({
        success: true,

        message:
          "Comment added successfully",

        comment:
          populatedComment,
      });
  } catch (error) {
    console.error(
      "Add comment error:",
      error.message
    );

    if (
      error.name ===
      "CastError"
    ) {
      return res
        .status(400)
        .json({
          success: false,

          message:
            "Invalid post ID",
        });
    }

    return res
      .status(500)
      .json({
        success: false,

        message:
          "Server error while adding comment",
      });
  }
};

export const deleteComment = async (
  req,
  res
) => {
  try {
    const { postId, commentId } =
      req.params;

    const post = await Post.findById(
      postId
    );

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    const comment = post.comments.id(
      commentId
    );

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    // Only the comment owner can delete it
    if (
      comment.user.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You can delete only your own comment",
      });
    }

    post.comments.pull(commentId);

    await post.save();

    return res.status(200).json({
      success: true,
      message:
        "Comment deleted successfully",
      commentsCount:
        post.comments.length,
    });
  } catch (error) {
    console.error(
      `Delete comment error: ${error.message}`
    );

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message:
          "Invalid post or comment ID",
      });
    }

    return res.status(500).json({
      success: false,
      message:
        "Server error while deleting comment",
    });
  }
};

export const updatePost = async (
  req,
  res
) => {
  try {
    const {
      content,
      image,
    } = req.body;

    // Route uses :postId
    const { postId } =
      req.params;

    const post =
      await Post.findById(
        postId
      );

    if (!post) {
      return res
        .status(404)
        .json({
          success: false,
          message:
            "Post not found",
        });
    }

    // Only the author can
    // update the post
    if (
      post.author.toString() !==
      req.user._id.toString()
    ) {
      return res
        .status(403)
        .json({
          success: false,
          message:
            "You can update only your own post",
        });
    }

    // Update content
    if (
      content !== undefined
    ) {
      if (
        typeof content !==
          "string" ||
        !content.trim()
      ) {
        return res
          .status(400)
          .json({
            success: false,
            message:
              "Post content cannot be empty",
          });
      }

      post.content =
        content.trim();
    }

    // Update image
    if (
      image !== undefined
    ) {
      post.image = image;
    }

    await post.save();

    // Populate author details
    await post.populate(
      "author",
      "name email role profileImage"
    );

    // Populate comment users
    await post.populate(
      "comments.user",
      "name email role profileImage"
    );

    return res
      .status(200)
      .json({
        success: true,

        message:
          "Post updated successfully",

        post,
      });
  } catch (error) {
    console.error(
      "Update post error:",
      error.message
    );

    if (
      error.name ===
      "CastError"
    ) {
      return res
        .status(400)
        .json({
          success: false,

          message:
            "Invalid post ID",
        });
    }

    return res
      .status(500)
      .json({
        success: false,

        message:
          "Server error while updating post",
      });
  }
};

export const deletePost = async (
  req,
  res
) => {
  try {
    // Route uses :postId
    const { postId } =
      req.params;

    const post =
      await Post.findById(
        postId
      );

    if (!post) {
      return res
        .status(404)
        .json({
          success: false,

          message:
            "Post not found",
        });
    }

    // Only the author can
    // delete the post
    if (
      post.author.toString() !==
      req.user._id.toString()
    ) {
      return res
        .status(403)
        .json({
          success: false,

          message:
            "You can delete only your own post",
        });
    }

    await post.deleteOne();

    return res
      .status(200)
      .json({
        success: true,

        message:
          "Post deleted successfully",

        postId,
      });
  } catch (error) {
    console.error(
      "Delete post error:",
      error.message
    );

    if (
      error.name ===
      "CastError"
    ) {
      return res
        .status(400)
        .json({
          success: false,

          message:
            "Invalid post ID",
        });
    }

    return res
      .status(500)
      .json({
        success: false,

        message:
          "Server error while deleting post",
      });
  }
};