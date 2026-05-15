import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createBlog } from "../../api/blog";

function Create() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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
      setError("Failed to create blog");
    }
  };

  return (
    <div>
      <h1>Create Blog</h1>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "10px" }}>
          <label>Title</label>
          <br />
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>Description</label>
          <br />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={6}
            cols={50}
          />
        </div>

        <button type="submit">Create</button>
      </form>

      {error && (
        <p style={{ color: "red", marginTop: "10px" }}>
          {error}
        </p>
      )}
    </div>
  );
}

export default Create;