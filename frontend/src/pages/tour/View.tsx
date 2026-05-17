import { useEffect, useState } from "react";
import {Link, useParams} from "react-router-dom";
import { getTour, getTourReviews } from "../../api/tour";



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