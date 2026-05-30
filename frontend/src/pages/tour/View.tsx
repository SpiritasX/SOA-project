import { useEffect, useState } from "react";
import {Link, useParams} from "react-router-dom";
import { getTour, getTourReviews, getTourLocations } from "../../api/tour";
import { useAuth } from "../../context/AuthContext";



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

type TourLocation = {
  id: number;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
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
  const { auth } = useAuth();

  const [tour, setTour] = useState<Tour | null>(null);
  const [reviews, setReviews] = useState<TourReview[]>([]);
  const [locations, setLocations] = useState<TourLocation[]>([]);

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

  const fetchLocations = async () => {
    try {
      const res = await getTourLocations(Number(id));

      if (!res.ok) {
        setError(await res.text());
        return;
      }

      const data = await res.json();
      setLocations(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchTour();
    fetchReviews();
    fetchLocations();
  }, [id]);

  if (!tour) return <div>Loading...</div>;

  const isGuide = auth.role === "GUIDE";
  const isAuthor = isGuide && auth.userId === String(tour.authorId);

  return (
    <div>
      <h1>{tour.name}</h1>
      <p>{tour.description}</p>
      <p>Difficulty: {tour.difficulty}</p>
      <p>Distance: {tour.distance.toFixed(2)} km</p>
      {isGuide && <p>Status: {tour.status}</p>}

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

      <div>
        <h3>Locations</h3>
        {locations.length > 0 ? (
          <ul>
            {isGuide ? (
              locations.map((loc) => (
                <li key={loc.id}>
                  <strong>{loc.name}</strong>: {loc.description} ({loc.latitude}, {loc.longitude})
                </li>
              ))
            ) : (
              <li>
                <strong>{locations[0].name}</strong>: {locations[0].description} ({locations[0].latitude}, {locations[0].longitude})
                <br />
                <em>(Tourists only see the first location)</em>
              </li>
            )}
          </ul>
        ) : (
          <p>No locations added yet.</p>
        )}
      </div>

      {isAuthor && <Link to={`/tour/${tour.id}/edit`}>Edit</Link>}
      <Link to={`/tour/${tour.id}/review`} style={{ marginLeft: "10px" }}>Leave Review</Link>

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