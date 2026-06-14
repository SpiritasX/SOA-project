import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { MapContainer, Marker, Polyline, Popup, TileLayer } from "react-leaflet";
import MapView from "../../components/MapView";
import { getActiveExecution, startTour } from "../../api/execution";
import { getMyPurchases } from "../../api/purchase";
import { getTour, getTourLocations, getTourReviews } from "../../api/tour";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";

type TourExecution = {
  id: number;
  userId: number;
  tourId: number;
  status: string;
  startTime: string;
  endTime?: string;
  lastActivity: string;
  completedLocations: Record<number, string>;
};

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

function difficultyClass(difficulty: string) {
  if (difficulty === "HARD") return "badge badge-coral";
  if (difficulty === "MEDIUM") return "badge badge-amber";
  return "badge badge-green";
}

function statusClass(status: string) {
  return `status-pill status-${status.toLowerCase()}`;
}

function View() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { auth } = useAuth();
  const { addToCart, items } = useCart();

  const [tour, setTour] = useState<Tour | null>(null);
  const [reviews, setReviews] = useState<TourReview[]>([]);
  const [locations, setLocations] = useState<TourLocation[]>([]);
  const [isPurchased, setIsPurchased] = useState(false);
  const [activeExecution, setActiveExecution] = useState<TourExecution | null>(null);
  const [error, setError] = useState("");

  const fetchTour = async () => {
    try {
      const res = await getTour(Number(id));

      if (!res.ok) {
        setError(await res.text());
        return;
      }

      setTour(await res.json());
    } catch (err) {
      console.error(err);
      setError("Failed to load tour.");
    }
  };

  const fetchReviews = async () => {
    try {
      const res = await getTourReviews(Number(id));

      if (!res.ok) {
        setError(await res.text());
        return;
      }

      setReviews(await res.json());
    } catch (err) {
      console.error(err);
    }
  };

  const fetchLocations = async () => {
    try {
      const res = await getTourLocations(Number(id));

      if (!res.ok) {
        setError(await res.text());
        return;
      }

      setLocations(await res.json());
    } catch (err) {
      console.error(err);
    }
  };

  const fetchPurchases = async () => {
    if (auth.role !== "TOURIST") return;

    try {
      const res = await getMyPurchases();
      if (res.ok) {
        const purchases = await res.json();
        const hasPurchased = purchases.some((purchase: any) =>
          purchase.tours.some((purchasedTour: any) => purchasedTour.id === Number(id))
        );
        setIsPurchased(hasPurchased);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchActiveExecution = async () => {
    if (auth.role !== "TOURIST") return;

    try {
      const res = await getActiveExecution();
      setActiveExecution(res.ok ? await res.json() : null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleStartTour = async () => {
    if (!id) return;
    setError("");

    if (activeExecution) {
      if (activeExecution.tourId === Number(id)) {
        navigate("/tour/active");
      } else {
        setError("You already have another active tour. Abandon it first.");
      }
      return;
    }

    const res = await startTour(Number(id));
    if (!res.ok) {
      setError(await res.text());
      return;
    }

    navigate("/tour/active");
  };

  useEffect(() => {
    fetchTour();
    fetchReviews();
    fetchLocations();
    fetchPurchases();
    fetchActiveExecution();
  }, [id, auth.role, auth.userId]);

  if (!tour) {
    return (
      <div className="state-page">
        <div className="state-card">
          <p className="eyebrow">Loading</p>
          <h1>Loading tour</h1>
        </div>
      </div>
    );
  }

  const isGuide = auth.role === "GUIDE";
  const isAuthor = isGuide && auth.userId === String(tour.authorId);
  const inCart = items.some((item) => item.id === tour.id);
  const mapCenter: [number, number] =
    locations.length > 0
      ? [locations[0].latitude, locations[0].longitude]
      : [45.2671, 19.8335];

  return (
    <div className="page-wide">
      <header className="page-header">
        <div className="page-title">
          <p className="eyebrow">Tour</p>
          <h1>{tour.name}</h1>
          <p className="subtitle">{tour.description}</p>
          <div className="meta-row">
            <span className={difficultyClass(tour.difficulty)}>{tour.difficulty}</span>
            <span>{tour.distance.toFixed(2)} km</span>
            <span className="price">${tour.price}</span>
            {isGuide && <span className={statusClass(tour.status)}>{tour.status}</span>}
          </div>
        </div>

        <div className="toolbar">
          {isPurchased && (
            <button className="btn btn-primary" onClick={handleStartTour}>
              {activeExecution?.tourId === tour.id ? "Continue Tour" : "Start Tour"}
            </button>
          )}
          {auth.role === "TOURIST" && !isPurchased && (
            <button
              className="btn btn-primary"
              disabled={inCart}
              onClick={() =>
                addToCart({ id: tour.id, name: tour.name, price: tour.price })
              }
            >
              {inCart ? "In cart" : "Add to cart"}
            </button>
          )}
          {isAuthor && (
            <Link className="btn btn-outline" to={`/tour/${tour.id}/edit`}>
              Edit
            </Link>
          )}
          {auth.role === "TOURIST" && (
            <Link className="btn btn-outline" to={`/tour/${tour.id}/review`}>
              Leave Review
            </Link>
          )}
        </div>
      </header>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="map-layout">
        <aside className="map-sidebar">
          {tour.tags.length > 0 && (
            <section className="tool-panel">
              <div className="section-title">
                <h2>Tags</h2>
              </div>
              <div className="tag-list">
                {tour.tags.map((tag) => (
                  <span className="tag" key={tag}>
                    #{tag}
                  </span>
                ))}
              </div>
            </section>
          )}

          {tour.durations.length > 0 && (
            <section className="tool-panel">
              <div className="section-title">
                <h2>Durations</h2>
              </div>
              <div className="list-stack">
                {tour.durations.map((duration) => (
                  <div className="compact-card" key={duration.id}>
                    <div className="spaced-row">
                      <strong>{duration.transportType}</strong>
                      <span>{duration.durationMinutes} min</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          <section className="tool-panel">
            <div className="section-title">
              <h2>Locations</h2>
              <p className="muted">{locations.length} visible key points</p>
            </div>
            {locations.length === 0 ? (
              <div className="empty-state">
                <h3>No locations</h3>
              </div>
            ) : (
              <div className="location-list">
                {locations.map((location) => (
                  <div className="location-item" key={location.id}>
                    <h3>{location.name}</h3>
                    <p>{location.description}</p>
                    <p className="muted">
                      {location.latitude.toFixed(5)}, {location.longitude.toFixed(5)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>
        </aside>

        <section className="map-frame map-frame-medium">
          <MapContainer>
            <MapView center={mapCenter} zoom={13} />
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {locations.length > 1 && (
              <Polyline
                positions={locations.map((location) => [
                  location.latitude,
                  location.longitude,
                ])}
              />
            )}
            {locations.map((location) => (
              <Marker key={location.id} position={[location.latitude, location.longitude]}>
                <Popup>
                  <strong>{location.name}</strong>
                  <br />
                  {location.description}
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </section>
      </div>

      <section>
        <div className="section-header">
          <div className="section-title">
            <h2>Reviews</h2>
            <p className="muted">{reviews.length} reviews</p>
          </div>
        </div>

        {reviews.length === 0 ? (
          <div className="empty-state">
            <h3>No reviews yet</h3>
          </div>
        ) : (
          <div className="content-grid">
            {reviews.map((review) => (
              <article className="card" key={review.id}>
                <div className="card-body">
                  <div className="spaced-row">
                    <h3>Rating {review.rating}/5</h3>
                    <span className="muted">
                      {new Date(review.visitedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p>{review.comment}</p>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default View;
