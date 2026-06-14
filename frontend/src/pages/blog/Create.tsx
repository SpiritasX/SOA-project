import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createBlog } from "../../api/blog";

function Create() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    try {
      const response = await createBlog({
        title,
        description,
      });

      if (!response.ok) {
        setError(await response.text());
        return;
      }

      navigate("/profile");
    } catch (err) {
      console.error(err);
      setError("Failed to create blog.");
    }
  };

  return (
    <div className="page-narrow">
      <header className="page-header">
        <div className="page-title">
          <p className="eyebrow">Blog</p>
          <h1>Create Blog</h1>
          <p className="subtitle">Publish a post to your social feed.</p>
        </div>
      </header>

      <section className="form-panel">
        <form className="form" onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="title">Title</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="field">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={8}
            />
          </div>

          <div className="button-row">
            <button className="btn btn-primary" type="submit">
              Create
            </button>
          </div>
        </form>
      </section>

      {error && <div className="alert alert-error">{error}</div>}
    </div>
  );
}

export default Create;
