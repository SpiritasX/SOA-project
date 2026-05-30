import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createTour } from "../../api/tour";

function Create() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState("EASY");
  const [tags, setTags] = useState("");

  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");

    try {
      const response = await createTour({
        name,
        description,
        difficulty,
        tags: tags.split(",").map((t) => t.trim()).filter((t) => t !== ""),
      });

      if (!response.ok) {
        setError(await response.text());
        return;
      }

      const id = await response.json();

      navigate(`/tour/${id}/edit`);

    } catch (err) {
      console.error(err);
      setError("Failed to create tour");
    }
  };

  return (
    <div>
      <h1>Create Tour</h1>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "10px" }}>
          <label>Name</label>
          <br />
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
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

        <div style={{ marginBottom: "10px" }}>
          <label>Difficulty</label>
          <br />
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
          >
            <option value="EASY">Easy</option>
            <option value="MEDIUM">Medium</option>
            <option value="HARD">Hard</option>
          </select>
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>Tags (comma separated)</label>
          <br />
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
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