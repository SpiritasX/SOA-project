import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createTour } from "../../api/tour";

function Create() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState("EASY");
  const [tags, setTags] = useState("");
  const [price, setPrice] = useState(0);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    try {
      const response = await createTour({
        name,
        description,
        difficulty,
        tags: tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag !== ""),
        price,
      });

      if (!response.ok) {
        setError(await response.text());
        return;
      }

      const id = await response.json();
      navigate(`/tour/${id}/edit`);
    } catch (err) {
      console.error(err);
      setError("Failed to create tour.");
    }
  };

  return (
    <div className="page-narrow">
      <header className="page-header">
        <div className="page-title">
          <p className="eyebrow">Guide tools</p>
          <h1>Create Tour</h1>
          <p className="subtitle">Draft details for a new guided route.</p>
        </div>
      </header>

      <section className="form-panel">
        <form className="form" onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
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

          <div className="form-grid">
            <div className="field">
              <label htmlFor="difficulty">Difficulty</label>
              <select
                id="difficulty"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
              >
                <option value="EASY">Easy</option>
                <option value="MEDIUM">Medium</option>
                <option value="HARD">Hard</option>
              </select>
            </div>

            <div className="field">
              <label htmlFor="price">Price</label>
              <input
                id="price"
                type="number"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="field">
            <label htmlFor="tags">Tags</label>
            <input
              id="tags"
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </div>

          <div className="button-row">
            <button className="btn btn-primary" type="submit">
              Create Tour
            </button>
          </div>
        </form>
      </section>

      {error && <div className="alert alert-error">{error}</div>}
    </div>
  );
}

export default Create;
