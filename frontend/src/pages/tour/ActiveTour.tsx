import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, Marker, TileLayer, Popup } from "react-leaflet";
import MapClickHandler from "../../components/MapClickHandler.tsx";
import { 
  getActiveExecution, 
  checkProximity, 
  abandonTour, 
  updatePosition 
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
}

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
  const [execution, setExecution] = useState<TourExecution>(null);
  const [tour, setTour] = useState<any>(null);
  const [locations, setLocations] = useState<TourLocation[]>([]);
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const intervalRef = useRef<any>(null);

  const fetchData = async () => {
    try {
      const activeExec: TourExecution = await getActiveExecution().then(res => res.ok ? res.json() : null);
      if (!activeExec) {
        navigate("/");
        return;
      }
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
          const updatedExec: TourExecution = await checkProximity(execution.id).then(res => res.ok ? res.json() : null);
          setExecution(updatedExec);
          if (updatedExec.status === "COMPLETED") {
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
        await abandonTour(execution.id);
        navigate("/");
      } catch (err) {
        console.error(err);
        alert("Failed to abandon tour.");
      }
    }
  };

  const handleMapClick = async (lat: number, lng: number) => {
    try {
      await updatePosition(lat, lng);
      setCurrentLocation({ latitude: lat, longitude: lng });
      
      // Immediate check after manual move
      if (execution) {
        const updatedExec: TourExecution = await checkProximity(execution.id).then(res => res.ok ? res.json() : null);
        setExecution(updatedExec);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div>Loading active tour...</div>;
  if (error) return <div>{error}</div>;
  if (!execution || !tour) return <div>No active tour.</div>;

  const mapCenter: [number, number] = currentLocation 
    ? [currentLocation.latitude, currentLocation.longitude] 
    : locations.length > 0 ? [locations[0].latitude, locations[0].longitude] : [45.2671, 19.8335];

  return (
    <div style={{ padding: "20px" }}>
      <h1>Active Tour: {tour.name}</h1>
      <div style={{ display: "flex", gap: "20px" }}>
        <div style={{ flex: 1 }}>
          <p>{tour.description}</p>
          <h3>Progress</h3>
          <ul>
            {locations.map(loc => {
              const completedAt = execution.completedLocations[loc.id];
              return (
                <li key={loc.id} style={{ color: completedAt ? "green" : "black" }}>
                  <strong>{loc.name}</strong> 
                  {completedAt ? ` - Reached at: ${new Date(completedAt).toLocaleString()}` : " - Not reached"}
                </li>
              );
            })}
          </ul>
          
          {execution.status === "COMPLETED" && (
            <div style={{ padding: "10px", backgroundColor: "#d4edda", color: "#155724", borderRadius: "5px", marginBottom: "10px" }}>
              <strong>Congratulations! You have completed the tour!</strong>
            </div>
          )}

          {execution.status === "ACTIVE" && (
            <button 
              onClick={handleAbandon}
              style={{ padding: "10px 20px", backgroundColor: "#dc3545", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}
            >
              Abandon Tour
            </button>
          )}

          <div style={{ marginTop: "20px" }}>
            <h3>Position Simulator</h3>
            <p>Click on the map to simulate your movement. Proximity check runs every 10 seconds.</p>
            {currentLocation && (
              <p>Current simulated position: {currentLocation.latitude.toFixed(5)}, {currentLocation.longitude.toFixed(5)}</p>
            )}
          </div>
        </div>

        <div style={{ flex: 2 }}>
          <MapContainer center={mapCenter} zoom={13} style={{ height: "500px", width: "100%" }}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapClickHandler onClick={handleMapClick} />
            
            {currentLocation && (
              <Marker position={[currentLocation.latitude, currentLocation.longitude]}>
                <Popup>You are here (simulated)</Popup>
              </Marker>
            )}

            {locations.map(loc => (
              <Marker key={loc.id} position={[loc.latitude, loc.longitude]}>
                <Popup>
                  <strong>{loc.name}</strong><br/>
                  {execution.completedLocations[loc.id] ? "Reached" : "Not reached"}
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>
    </div>
  );
}

export default ActiveTour;
