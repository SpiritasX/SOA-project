import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, Marker, Polyline, Popup, TileLayer } from "react-leaflet";
import MapClickHandler from "../../components/MapClickHandler.tsx";
import MapView from "../../components/MapView.tsx";
import {
  abandonTour,
  checkProximity,
  getActiveExecution,
  updatePosition,
} from "../../api/execution";
import { getTour, getTourLocations } from "../../api/tour";

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

type Location = {
  latitude: number;
  longitude: number;
};

type TourLocation = {
  id: number;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
};

function ActiveTour() {
  const navigate = useNavigate();
  const [execution, setExecution] = useState<TourExecution | null>(null);
  const [tour, setTour] = useState<any>(null);
  const [locations, setLocations] = useState<TourLocation[]>([]);
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchData = async () => {
    try {
      const activeRes = await getActiveExecution();
      if (!activeRes.ok) {
        navigate("/");
        return;
      }

      const activeExec: TourExecution = await activeRes.json();
      setExecution(activeExec);

      const tourRes = await getTour(activeExec.tourId);
      if (tourRes.ok) {
        setTour(await tourRes.json());
      }

      const locsRes = await getTourLocations(activeExec.tourId);
      if (locsRes.ok) {
        setLocations(await locsRes.json());
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load active tour data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (execution && execution.status === "ACTIVE") {
      intervalRef.current = setInterval(async () => {
        try {
          const res = await checkProximity(execution.id);
          if (!res.ok) return;

          const updatedExec: TourExecution = await res.json();
          setExecution(updatedExec);
          if (updatedExec.status === "COMPLETED" && intervalRef.current) {
            clearInterval(intervalRef.current);
          }
        } catch (err) {
          console.error("Proximity check failed", err);
        }
      }, 10000);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [execution?.id, execution?.status]);

  const handleAbandon = async () => {
    if (!execution) return;

    if (window.confirm("Are you sure you want to abandon this tour?")) {
      try {
        const res = await abandonTour(execution.id);
        if (!res.ok) {
          setError(await res.text());
          return;
        }
        navigate("/");
      } catch (err) {
        console.error(err);
        setError("Failed to abandon tour.");
      }
    }
  };

  const handleMapClick = async (lat: number, lng: number) => {
    try {
      const positionRes = await updatePosition(lat, lng);
      if (!positionRes.ok) {
        setError(await positionRes.text());
        return;
      }

      setCurrentLocation({ latitude: lat, longitude: lng });

      if (execution) {
        const proximityRes = await checkProximity(execution.id);
        if (proximityRes.ok) {
          setExecution(await proximityRes.json());
        }
      }
    } catch (err) {
      console.error(err);
      setError("Failed to update position.");
    }
  };

  if (loading) {
    return (
      <div className="state-page">
        <div className="state-card">
          <p className="eyebrow">Loading</p>
          <h1>Loading active tour</h1>
        </div>
      </div>
    );
  }

  if (error) return <div className="alert alert-error">{error}</div>;
  if (!execution || !tour) {
    return (
      <div className="empty-state">
        <h3>No active tour</h3>
      </div>
    );
  }

  const completedLocations = execution.completedLocations || {};
  const completedCount = locations.filter((location) => completedLocations[location.id]).length;
  const progress = locations.length > 0 ? (completedCount / locations.length) * 100 : 0;
  const mapCenter: [number, number] = currentLocation
    ? [currentLocation.latitude, currentLocation.longitude]
    : locations.length > 0
      ? [locations[0].latitude, locations[0].longitude]
      : [45.2671, 19.8335];

  return (
    <div className="page-wide">
      <header className="page-header">
        <div className="page-title">
          <p className="eyebrow">Active Tour</p>
          <h1>{tour.name}</h1>
          <p className="subtitle">{tour.description}</p>
          <div className="meta-row">
            <span className={`status-pill status-${execution.status.toLowerCase()}`}>
              {execution.status}
            </span>
            <span>
              {completedCount} / {locations.length} locations reached
            </span>
          </div>
        </div>
        {execution.status === "ACTIVE" && (
          <button className="btn btn-danger" onClick={handleAbandon}>
            Abandon Tour
          </button>
        )}
      </header>

      {execution.status === "COMPLETED" && (
        <div className="alert alert-success">Tour completed.</div>
      )}

      <div className="map-layout">
        <aside className="map-sidebar">
          <section className="tool-panel">
            <div className="section-title">
              <h2>Progress</h2>
              <p className="muted">{Math.round(progress)} percent complete</p>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progress}%` }} />
            </div>
          </section>

          <section className="tool-panel">
            <div className="section-title">
              <h2>Route Points</h2>
            </div>
            <div className="location-list">
              {locations.map((location) => {
                const completedAt = completedLocations[location.id];
                return (
                  <div
                    className={
                      completedAt ? "location-item is-complete" : "location-item"
                    }
                    key={location.id}
                  >
                    <h3>{location.name}</h3>
                    <p>{completedAt ? "Reached" : "Not reached"}</p>
                    {completedAt && (
                      <p className="muted">{new Date(completedAt).toLocaleString()}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {currentLocation && (
            <section className="tool-panel">
              <div className="section-title">
                <h2>Current Position</h2>
                <p className="muted">
                  {currentLocation.latitude.toFixed(5)},{" "}
                  {currentLocation.longitude.toFixed(5)}
                </p>
              </div>
            </section>
          )}
        </aside>

        <section className="map-frame map-frame-large">
          <MapContainer>
            <MapView center={mapCenter} zoom={13} />
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <MapClickHandler onClick={handleMapClick} />

            {locations.length > 1 && (
              <Polyline
                positions={locations.map((location) => [
                  location.latitude,
                  location.longitude,
                ])}
              />
            )}

            {currentLocation && (
              <Marker position={[currentLocation.latitude, currentLocation.longitude]}>
                <Popup>Current simulated position</Popup>
              </Marker>
            )}

            {locations.map((location) => (
              <Marker key={location.id} position={[location.latitude, location.longitude]}>
                <Popup>
                  <strong>{location.name}</strong>
                  <br />
                  {completedLocations[location.id] ? "Reached" : "Not reached"}
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </section>
      </div>
    </div>
  );
}

export default ActiveTour;
