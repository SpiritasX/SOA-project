import { useEffect, useState } from "react";
import {Link, useParams} from "react-router-dom";
import { getTour, getTourReviews } from "../../api/tour";



type TourDuration = {
  id: number;
  transportType: string;
  durationMinutes: number;
};

type Tour = {
  id: number;
  name: string;
  description: string;
  tags: string[];
  price: number;
  difficulty: string;
  status: string;
  authorId: number;
  firstTourLocationId: number;
  distance: number;
  durations: TourDuration[];
};

type TourReview = {
  id: number;
  rating: number;
  comment: string;
  visitedAt: string;
  createdAt: string;
  imagePaths: string[];
  authorId: number;
};

function View() {
  const { id } = useParams();

  const [tour, setTour] = useState<Tour | null>(null);
  const [reviews, setReviews] = useState<TourReview[]>([]);

  const [error, setError] = useState("");

  const fetchTour = async () => {
    try {
      const res = await getTour(Number(id));

      if (!res.ok) {
        setError(await res.text());
        return;
      }

      const data = await res.json();
      setTour(data);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchReviews = async () => {
    try {
      const res = await getTourReviews(Number(id));

      if (!res.ok) {
        setError(await res.text());
        return;
      }

      const data = await res.json();
      setReviews(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchTour();
    fetchReviews();
  }, [id]);

  if (!tour) return <div>Loading...</div>;

  return (
    <div>
      <h1>{tour.name}</h1>
      <p>{tour.description}</p>
      <p>Difficulty: {tour.difficulty}</p>
      <p>Distance: {tour.distance.toFixed(2)} km</p>
      <p>Status: {tour.status}</p>

      {tour.tags && tour.tags.length > 0 && (
        <div style={{ marginBottom: "10px" }}>
          Tags:{" "}
          {tour.tags.map((tag) => (
            <span
              key={tag}
              style={{
                marginRight: "5px",
                padding: "2px 5px",
                background: "#eee",
                borderRadius: "3px",
              }}
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {tour.durations && tour.durations.length > 0 && (
        <div style={{ marginBottom: "10px" }}>
          <h3>Durations</h3>
          <ul>
            {tour.durations.map((d) => (
              <li key={d.id}>
                {d.transportType}: {d.durationMinutes} mins
              </li>
            ))}
          </ul>
        </div>
      )}

      <Link to={`/tour/${tour.id}/edit`}>Edit</Link>
      <Link to={`/tour/${tour.id}/review`}>Leave Review</Link>

      <hr />

      <h2>Reviews</h2>

      {reviews.map((review) => (
        <div key={review.id} style={{ marginBottom: "10px" }}>
          <p>Rating: {review.rating}</p>
          <p>{review.comment}</p>
          <p>Visited: {new Date(review.visitedAt).toLocaleDateString()}</p>
        </div>
      ))}

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default View;