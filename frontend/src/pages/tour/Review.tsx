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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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
      setError("Failed to submit review");
    }
  };

  return (
    <div>
      <h1>Leave Review</h1>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "10px" }}>
          <label>Rating</label>
          <br />
          <select
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

        <div style={{ marginBottom: "10px" }}>
          <label>Visited At</label>
          <br />
          <input
            type="date"
            value={visitedAt}
            onChange={(e) => setVisitedAt(e.target.value)}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>Comment</label>
          <br />
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={6}
            cols={50}
          />
        </div>

        <button type="submit">Submit Review</button>
      </form>

      {error && (
        <p style={{ color: "red", marginTop: "10px" }}>
          {error}
        </p>
      )}
    </div>
  );
}

export default Review;
