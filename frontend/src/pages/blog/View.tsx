import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  addComment,
  likeBlog,
  editComment,
} from "../../api/blog";
import { apiFetch } from "../../api/client";

type Comment = {
  id: string;
  authorId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
};

type BlogPost = {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  comments: Comment[];
  likes: number;
};

function View() {
  const { id } = useParams();

  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [comment, setComment] = useState("");

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");

  const [error, setError] = useState("");

  const fetchBlog = async () => {
    try {
      const res = await apiFetch(`/api/blog/${id}`);

      if (!res.ok) {
        setError(await res.text());
        return;
      }

      const data = await res.json();
      setBlog(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchBlog();
  }, [id]);

  useEffect(() => {
    if (!error) return;

    const timer = setTimeout(() => {
      setError("");
    }, 3000);

    return () => clearTimeout(timer);
  }, [error]);

  const handleLike = async () => {
    await likeBlog(Number(id));
    fetchBlog();
  };

  const handleComment = async () => {
    if (!comment.trim()) return;

    const res = await addComment(Number(id), comment);

    if (!res.ok) {
      setError(await res.text());
      return;
    }

    setComment("");
    fetchBlog();
  };

  const handleEditComment = async (commentId: string) => {
    if (!editText.trim()) return;

    const res = await editComment(Number(commentId), editText);

    if (!res.ok) {
      setError(await res.text());
      return;
    }

    setEditingId(null);
    setEditText("");
    fetchBlog();
  };

  if (!blog) return <div>Loading...</div>;

  return (
    <div>
      <h1>{blog.title}</h1>
      <p>{blog.description}</p>

      <p>Likes: {blog.likes}</p>
      <button onClick={handleLike}>Like</button>

      <hr />

      <h3>Comments</h3>

      <div>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write comment..."
        />
        <br />
        <button onClick={handleComment}>Post comment</button>
      </div>

      <ul>
        {blog.comments.map((c) => (
          <li key={c.id}>
            {editingId === c.id ? (
              <>
        <textarea
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
        />
                <br />
                <button onClick={() => handleEditComment(c.id)}>Save</button>
                <button onClick={() => setEditingId(null)}>Cancel</button>
              </>
            ) : (
              <>
                <p>{c.content}</p>
                <small>{new Date(c.createdAt).toLocaleString()}</small>
                <button onClick={() => {
                  setEditingId(c.id);
                  setEditText(c.content);
                }}>Edit</button>
              </>
            )}
          </li>
        ))}
      </ul>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default View;