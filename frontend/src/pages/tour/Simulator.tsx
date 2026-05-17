import { useEffect, useState } from "react";
import { MapContainer, Marker, TileLayer } from "react-leaflet";
import MapClickHandler from "../../components/MapClickHandler.tsx";
import { getTouristLocation, updateTouristLocation } from "../../api/tour.ts";

type Location = {
  latitude: number;
  longitude: number;
};

function Simulator() {
  const [location, setLocation] = useState<Location | null>(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const response = await getTouristLocation();
        if (response.ok) {
          const data: Location = await response.json();
          if (data.latitude != null && data.longitude != null) {
            setLocation(data);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLocation();
  }, []);

  const handleMapClick = async (lat: number, lng: number) => {
    setStatus("Saving...");

    try {
      const response = await updateTouristLocation({ latitude: lat, longitude: lng });

      if (!response.ok) {
        setStatus("Failed to save location.");
        return;
      }

      setLocation({ latitude: lat, longitude: lng });
      setStatus(`Location set: ${lat.toFixed(5)}, ${lng.toFixed(5)}`);
    } catch (err) {
      console.error(err);
      setStatus("Failed to save location.");
    }
  };

  const mapCenter: [number, number] = location
    ? [location.latitude, location.longitude]
    : [45.2671, 19.8335];

  return (
    <div>
      <h1>Position Simulator</h1>
      <p>Click on the map to set your current location.</p>

      {loading && <p>Loading current location...</p>}

      {!loading && location && (
        <p>
          Current position: {location.latitude.toFixed(5)}, {location.longitude.toFixed(5)}
        </p>
      )}

      {!loading && !location && (
        <p>No location set yet. Click on the map to set one.</p>
      )}

      {status && <p>{status}</p>}

      <MapContainer
        center={mapCenter}
        zoom={13}
        style={{ height: "600px", width: "100%" }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapClickHandler onClick={handleMapClick} />

        {location && (
          <Marker position={[location.latitude, location.longitude]} />
        )}
      </MapContainer>
    </div>
  );
}

export default Simulator;
