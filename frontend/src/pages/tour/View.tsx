import { useEffect, useState } from "react";
import {Link, useParams} from "react-router-dom";
import { getTour, getTourReviews, getTourLocations } from "../../api/tour";
import { getMyPurchases } from "../../api/purchase";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";



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
  const { addToCart } = useCart();

  const [tour, setTour] = useState<Tour | null>(null);
  const [reviews, setReviews] = useState<TourReview[]>([]);
  const [locations, setLocations] = useState<TourLocation[]>([]);
  const [isPurchased, setIsPurchased] = useState(false);

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

  const fetchPurchases = async () => {
    if (auth.role !== "TOURIST") return;
    try {
      const res = await getMyPurchases();
      if (res.ok) {
        const purchases = await res.json();
        const hasPurchased = purchases.some((p: any) => 
          p.tours.some((t: any) => t.id === Number(id))
        );
        setIsPurchased(hasPurchased);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchTour();
    fetchReviews();
    fetchLocations();
    fetchPurchases();
  }, [id, auth]);

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
            {isGuide || isPurchased ? (
              locations.map((loc) => (
                <li key={loc.id}>
                  <strong>{loc.name}</strong>: {loc.description} ({loc.latitude}, {loc.longitude})
                </li>
              ))
            ) : (
              <li>
                <strong>{locations[0].name}</strong>: {locations[0].description} ({locations[0].latitude}, {locations[0].longitude})
                <br />
                <em>(Only purchased tours or guides can see all key points)</em>
              </li>
            )}
          </ul>
        ) : (
          <p>No locations added yet.</p>
        )}
      </div>

      {isPurchased ? (
        <p style={{ color: "green", fontWeight: "bold" }}>You have purchased this tour.</p>
      ) : (
        auth.role === "TOURIST" && (
          <button
            onClick={() => addToCart({ id: tour.id, name: tour.name, price: tour.price })}
            style={{
              padding: "10px 20px",
              backgroundColor: "#28a745",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Add to Cart
          </button>
        )
      )}

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