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
    const post = await Post.findById(
      req.params.id
    );

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    const userId = req.user._id.toString();

    const alreadyLiked = post.likes.some(
      (like) =>
        like.toString() === userId
    );

    let message;

    if (alreadyLiked) {
      post.likes = post.likes.filter(
        (like) =>
          like.toString() !== userId
      );

      message = "Like removed successfully";
    } else {
      post.likes.push(req.user._id);

      message = "Post liked successfully";
    }

    await post.save();

    return res.status(200).json({
      success: true,
      message,
      likesCount: post.likes.length,
      liked: !alreadyLiked,
      likes: post.likes,
    });
  } catch (error) {
    console.error(
      `Toggle post like error: ${error.message}`
    );

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid post ID",
      });
    }

    return res.status(500).json({
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

    if (!text || !text.trim()) {
      return res.status(400).json({
        success: false,
        message: "Comment text is required",
      });
    }

    const post = await Post.findById(
      req.params.id
    );

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    post.comments.push({
      user: req.user._id,
      text: text.trim(),
    });

    await post.save();

    // Populate users inside the comments array
    await post.populate(
      "comments.user",
      "name role profileImage"
    );

    // Get the newly added comment
    const newComment =
      post.comments[
        post.comments.length - 1
      ];

    return res.status(201).json({
      success: true,
      message: "Comment added successfully",
      comment: newComment,
      commentsCount:
        post.comments.length,
    });
  } catch (error) {
    console.error(
      `Add comment error: ${error.message}`
    );

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid post ID",
      });
    }

    return res.status(500).json({
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

export const updatePost = async (req, res) => {
  try {
    const { content, image } = req.body;

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // Only the post author can update the post
    if (
      post.author.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You can update only your own post",
      });
    }

    // Update content only when it is provided
    if (content !== undefined) {
      if (
        typeof content !== "string" ||
        !content.trim()
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Post content cannot be empty",
        });
      }

      post.content = content.trim();
    }

    // Update image only when it is provided
    if (image !== undefined) {
      post.image = image;
    }

    await post.save();

    await post.populate(
      "author",
      "name email role profileImage"
    );

    return res.status(200).json({
      success: true,
      message:
        "Post updated successfully",
      post,
    });
  } catch (error) {
    console.error(
      `Update post error: ${error.message}`
    );

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid post ID",
      });
    }

    return res.status(500).json({
      success: false,
      message:
        "Server error while updating post",
    });
  }
};

export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // Only the post author can delete the post
    if (
      post.author.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "You can delete only your own post",
      });
    }

    await post.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Post deleted successfully",
    });
  } catch (error) {
    console.error(
      `Delete post error: ${error.message}`
    );

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid post ID",
      });
    }

    return res.status(500).json({
      success: false,
      message:
        "Server error while deleting post",
    });
  }
};