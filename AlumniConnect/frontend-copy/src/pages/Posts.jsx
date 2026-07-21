import {
  useCallback,
  useEffect,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import API from "../api/axios";
import "./Posts.css";

function Posts() {
  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const [posts, setPosts] = useState([]);

  const [content, setContent] =
    useState("");

  const [comments, setComments] =
    useState({});

  const [loading, setLoading] =
    useState(true);

  const [creating, setCreating] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  const [editingPostId, setEditingPostId] =
    useState(null);

  const [editedContent, setEditedContent] =
    useState("");

  const [updating, setUpdating] =
    useState(false);

  const [deletingPostId, setDeletingPostId] =
    useState(null);

  // Fetch all posts
  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await API.get("/posts");

      setPosts(
        response.data.posts || []
      );
    } catch (error) {
      console.error(
        "Fetch posts error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Unable to fetch posts"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Create post
  const handleCreatePost = async (
    event
  ) => {
    event.preventDefault();

    if (!content.trim()) {
      setError(
        "Please write something before posting"
      );

      return;
    }

    try {
      setCreating(true);
      setMessage("");
      setError("");

      const response =
        await API.post("/posts", {
          content: content.trim(),
        });

      setContent("");

      setMessage(
        response.data.message ||
          "Post created successfully"
      );

      await fetchPosts();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to create post"
      );
    } finally {
      setCreating(false);
    }
  };

  // Like or unlike post
  const handleLike = async (postId) => {
    try {
      setMessage("");
      setError("");

      await API.patch(
        `/posts/${postId}/like`
      );

      await fetchPosts();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to update like"
      );
    }
  };

  // Store comment text
  const handleCommentChange = (
    postId,
    value
  ) => {
    setComments((previousComments) => ({
      ...previousComments,
      [postId]: value,
    }));
  };

  // Add comment
  const handleAddComment = async (
    postId
  ) => {
    const text = comments[postId];

    if (!text?.trim()) {
      setError(
        "Please write a comment"
      );

      return;
    }

    try {
      setMessage("");
      setError("");

      const response =
        await API.post(
          `/posts/${postId}/comments`,
          {
            text: text.trim(),
          }
        );

      setComments(
        (previousComments) => ({
          ...previousComments,
          [postId]: "",
        })
      );

      setMessage(
        response.data.message ||
          "Comment added successfully"
      );

      await fetchPosts();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to add comment"
      );
    }
  };

  // Open edit mode
  const handleStartEdit = (post) => {
    setEditingPostId(post._id);

    setEditedContent(
      post.content || ""
    );

    setMessage("");
    setError("");
  };

  // Close edit mode
  const handleCancelEdit = () => {
    setEditingPostId(null);

    setEditedContent("");
  };

  // Save edited post
  const handleUpdatePost = async (
    postId
  ) => {
    if (!editedContent.trim()) {
      setError(
        "Post content cannot be empty"
      );

      return;
    }

    try {
      setUpdating(true);
      setMessage("");
      setError("");

      const response =
        await API.patch(
          `/posts/${postId}`,
          {
            content:
              editedContent.trim(),
          }
        );

      setMessage(
        response.data.message ||
          "Post updated successfully"
      );

      setEditingPostId(null);

      setEditedContent("");

      await fetchPosts();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to update post"
      );
    } finally {
      setUpdating(false);
    }
  };

  // Delete post
  const handleDeletePost = async (
    postId
  ) => {
    const shouldDelete =
      window.confirm(
        "Are you sure you want to delete this post?"
      );

    if (!shouldDelete) {
      return;
    }

    try {
      setDeletingPostId(postId);

      setMessage("");
      setError("");

      const response =
        await API.delete(
          `/posts/${postId}`
        );

      setMessage(
        response.data.message ||
          "Post deleted successfully"
      );

      setPosts((previousPosts) =>
        previousPosts.filter(
          (post) =>
            post._id !== postId
        )
      );
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to delete post"
      );
    } finally {
      setDeletingPostId(null);
    }
  };

  return (
    <div className="posts-page">
      <header className="posts-header">
        <button
          type="button"
          className="posts-back"
          onClick={() =>
            navigate("/dashboard")
          }
        >
          ← Dashboard
        </button>

        <h1>Community Posts</h1>

        <p>
          Share experiences, ask
          questions, and interact
          with the AlumniConnect
          community.
        </p>
      </header>

      <main className="posts-content">
        <form
          className="create-post-card"
          onSubmit={handleCreatePost}
        >
          <div className="post-user-row">
            <div className="post-avatar">
              {user?.name
                ?.charAt(0)
                .toUpperCase() ||
                "U"}
            </div>

            <div>
              <strong>
                {user?.name ||
                  "User"}
              </strong>

              <span>
                {user?.role ||
                  "Member"}
              </span>
            </div>
          </div>

          <textarea
            placeholder="Share something with the community..."
            value={content}
            onChange={(event) =>
              setContent(
                event.target.value
              )
            }
            maxLength={1000}
          />

          <div className="create-post-footer">
            <span>
              {content.length}/1000
            </span>

            <button
              type="submit"
              disabled={
                creating ||
                !content.trim()
              }
            >
              {creating
                ? "Posting..."
                : "Create Post"}
            </button>
          </div>
        </form>

        <div className="posts-toolbar">
          <div>
            <h2>Recent Posts</h2>

            <p>
              {posts.length}{" "}
              {posts.length === 1
                ? "post"
                : "posts"}
            </p>
          </div>

          <button
            type="button"
            onClick={fetchPosts}
          >
            Refresh
          </button>
        </div>

        {message && (
          <p className="posts-message">
            {message}
          </p>
        )}

        {error && (
          <p className="posts-error">
            {error}
          </p>
        )}

        {loading && (
          <p className="posts-status">
            Loading posts...
          </p>
        )}

        {!loading &&
          posts.length === 0 && (
            <p className="posts-status">
              No posts found. Create
              the first post.
            </p>
          )}

        {!loading && (
          <section className="posts-list">
            {posts.map((post) => {
              const authorId =
                typeof post.author ===
                "object"
                  ? post.author?._id
                  : post.author;

              const isOwner =
                authorId?.toString() ===
                user?._id?.toString();

              const isLiked =
                post.likes?.some(
                  (like) => {
                    const likeId =
                      typeof like ===
                      "object"
                        ? like._id
                        : like;

                    return (
                      likeId?.toString() ===
                      user?._id?.toString()
                    );
                  }
                );

              return (
                <article
                  className="post-card"
                  key={post._id}
                >
                  <div className="post-author">
                    <div className="post-avatar">
                      {post.author
                        ?.name
                        ?.charAt(0)
                        .toUpperCase() ||
                        "U"}
                    </div>

                    <div>
                      <h3>
                        {post.author
                          ?.name ||
                          "User"}
                      </h3>

                      <p>
                        {post.author
                          ?.role ||
                          "Member"}

                        {" • "}

                        {new Date(
                          post.createdAt
                        ).toLocaleString()}
                      </p>
                    </div>

                    {isOwner && (
                      <div className="post-owner-actions">
                        <button
                          type="button"
                          className="edit-post-button"
                          onClick={() =>
                            handleStartEdit(
                              post
                            )
                          }
                        >
                          ✏️ Edit
                        </button>

                        <button
                          type="button"
                          className="delete-post-button"
                          disabled={
                            deletingPostId ===
                            post._id
                          }
                          onClick={() =>
                            handleDeletePost(
                              post._id
                            )
                          }
                        >
                          {deletingPostId ===
                          post._id
                            ? "Deleting..."
                            : "🗑️ Delete"}
                        </button>
                      </div>
                    )}
                  </div>

                  {editingPostId ===
                  post._id ? (
                    <div className="edit-post-section">
                      <textarea
                        value={
                          editedContent
                        }
                        maxLength={1000}
                        onChange={(
                          event
                        ) =>
                          setEditedContent(
                            event
                              .target
                              .value
                          )
                        }
                      />

                      <div className="edit-post-footer">
                        <span>
                          {
                            editedContent.length
                          }
                          /1000
                        </span>

                        <div>
                          <button
                            type="button"
                            className="save-edit-button"
                            disabled={
                              updating
                            }
                            onClick={() =>
                              handleUpdatePost(
                                post._id
                              )
                            }
                          >
                            {updating
                              ? "Saving..."
                              : "Save Changes"}
                          </button>

                          <button
                            type="button"
                            className="cancel-edit-button"
                            disabled={
                              updating
                            }
                            onClick={
                              handleCancelEdit
                            }
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="post-content">
                      {post.content}
                    </p>
                  )}

                  <div className="post-counts">
                    <span>
                      👍{" "}
                      {post.likes
                        ?.length || 0}
                    </span>

                    <span>
                      {post.comments
                        ?.length || 0}{" "}
                      comments
                    </span>
                  </div>

                  <div className="post-actions">
                    <button
                      type="button"
                      className={
                        isLiked
                          ? "liked"
                          : ""
                      }
                      onClick={() =>
                        handleLike(
                          post._id
                        )
                      }
                    >
                      {isLiked
                        ? "👍 Liked"
                        : "👍 Like"}
                    </button>
                  </div>

                  <div className="comments-section">
                    {post.comments?.map(
                      (
                        comment,
                        index
                      ) => (
                        <div
                          className="comment"
                          key={
                            comment._id ||
                            `${post._id}-${index}`
                          }
                        >
                          <strong>
                            {comment
                              .user
                              ?.name ||
                              "User"}
                          </strong>

                          <p>
                            {
                              comment.text
                            }
                          </p>
                        </div>
                      )
                    )}

                    <div className="add-comment">
                      <input
                        type="text"
                        placeholder="Write a comment..."
                        value={
                          comments[
                            post._id
                          ] || ""
                        }
                        onChange={(
                          event
                        ) =>
                          handleCommentChange(
                            post._id,
                            event.target
                              .value
                          )
                        }
                        onKeyDown={(
                          event
                        ) => {
                          if (
                            event.key ===
                            "Enter"
                          ) {
                            event.preventDefault();

                            handleAddComment(
                              post._id
                            );
                          }
                        }}
                      />

                      <button
                        type="button"
                        onClick={() =>
                          handleAddComment(
                            post._id
                          )
                        }
                      >
                        Comment
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </section>
        )}
      </main>
    </div>
  );
}

export default Posts;