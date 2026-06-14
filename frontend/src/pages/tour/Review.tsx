import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createTourReview } from "../../api/tour";

function Review() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [visitedAt, setVisitedAt] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    try {
      const response = await createTourReview(Number(id), {
        rating,
        comment,
        visitedAt,
      });

      if (!response.ok) {
        setError(await response.text());
        return;
      }

      navigate(`/tour/${id}`);
    } catch (err) {
      console.error(err);
      setError("Failed to submit review.");
    }
  };

  return (
    <div className="page-narrow">
      <header className="page-header">
        <div className="page-title">
          <p className="eyebrow">Tour review</p>
          <h1>Leave Review</h1>
          <p className="subtitle">Share your visit experience.</p>
        </div>
      </header>

      <section className="form-panel">
        <form className="form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="field">
              <label htmlFor="rating">Rating</label>
              <select
                id="rating"
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
              >
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
                <option value={4}>4</option>
                <option value={5}>5</option>
              </select>
            </div>

            <div className="field">
              <label htmlFor="visitedAt">Visited at</label>
              <input
                id="visitedAt"
                type="date"
                value={visitedAt}
                onChange={(e) => setVisitedAt(e.target.value)}
              />
            </div>
          </div>

          <div className="field">
            <label htmlFor="comment">Comment</label>
            <textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={8}
            />
          </div>

          <button className="btn btn-primary" type="submit">
            Submit Review
          </button>
        </form>
      </section>

      {error && <div className="alert alert-error">{error}</div>}
    </div>
  );
}

export default Review;
