import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { addComment, editComment, getBlog, likeBlog } from "../../api/blog";

type Comment = {
  id: string;
  authorId: number;
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

function formatDate(value: string) {
  return new Date(value).toLocaleString();
}

function View() {
  const { id } = useParams();

  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [comment, setComment] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [error, setError] = useState("");

  const fetchBlog = async () => {
    try {
      const res = await getBlog(id);

      if (!res.ok) {
        setError(await res.text());
        return;
      }

      setBlog(await res.json());
    } catch (err) {
      console.error(err);
      setError("Failed to load blog.");
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
    await likeBlog(id);
    fetchBlog();
  };

  const handleComment = async () => {
    if (!comment.trim()) return;

    const res = await addComment(id, comment);

    if (!res.ok) {
      setError(await res.text());
      return;
    }

    setComment("");
    fetchBlog();
  };

  const handleEditComment = async (commentIndex: number) => {
    if (!editText.trim()) return;

    const res = await editComment(id, commentIndex, editText);

    if (!res.ok) {
      setError(await res.text());
      return;
    }

    setEditingId(null);
    setEditText("");
    fetchBlog();
  };

  if (!blog) {
    return (
      <div className="state-page">
        <div className="state-card">
          <p className="eyebrow">Loading</p>
          <h1>Loading blog</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="page-narrow">
      <article className="article">
        <header className="page-header">
          <div className="page-title">
            <p className="eyebrow">Blog</p>
            <h1>{blog.title}</h1>
            <div className="meta-row">
              <span>{formatDate(blog.createdAt)}</span>
              <span className="badge badge-coral">{blog.likes} likes</span>
            </div>
          </div>
          <button className="btn btn-primary" onClick={handleLike}>
            Like
          </button>
        </header>

        <section className="card">
          <div className="card-body markdown">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {blog.description}
            </ReactMarkdown>
          </div>
        </section>
      </article>

      <section className="form-panel">
        <div className="section-header">
          <div className="section-title">
            <h2>Comments</h2>
            <p className="muted">{blog.comments.length} comments</p>
          </div>
        </div>

        <div className="form">
          <div className="field">
            <label htmlFor="comment">New comment</label>
            <textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>
          <div className="button-row">
            <button className="btn btn-primary" onClick={handleComment}>
              Post Comment
            </button>
          </div>
        </div>
      </section>

      <section className="comment-list">
        {blog.comments.map((item, index) => (
          <article className="comment-item" key={item.id}>
            {editingId === item.id ? (
              <div className="form">
                <div className="field">
                  <label htmlFor={`edit-${item.id}`}>Edit comment</label>
                  <textarea
                    id={`edit-${item.id}`}
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                  />
                </div>
                <div className="button-row">
                  <button
                    className="btn btn-primary btn-small"
                    onClick={() => handleEditComment(index)}
                  >
                    Save
                  </button>
                  <button
                    className="btn btn-ghost btn-small"
                    onClick={() => setEditingId(null)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="list-stack">
                <p>{item.content}</p>
                <div className="spaced-row">
                  <p className="muted">{formatDate(item.createdAt)}</p>
                  <button
                    className="btn btn-outline btn-small"
                    onClick={() => {
                      setEditingId(item.id);
                      setEditText(item.content);
                    }}
                  >
                    Edit
                  </button>
                </div>
              </div>
            )}
          </article>
        ))}
      </section>

      {error && <div className="alert alert-error">{error}</div>}
    </div>
  );
}

export default View;
