import { useEffect, useState } from "react";
import { MapContainer, Marker, TileLayer } from "react-leaflet";
import MapClickHandler from "../../components/MapClickHandler.tsx";
import MapView from "../../components/MapView.tsx";
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
    setStatus("Saving position...");

    try {
      const response = await updateTouristLocation({
        latitude: lat,
        longitude: lng,
      });

      if (!response.ok) {
        setStatus("Failed to save location.");
        return;
      }

      setLocation({ latitude: lat, longitude: lng });
      setStatus(`Position saved: ${lat.toFixed(5)}, ${lng.toFixed(5)}`);
    } catch (err) {
      console.error(err);
      setStatus("Failed to save location.");
    }
  };

  const mapCenter: [number, number] = location
    ? [location.latitude, location.longitude]
    : [45.2671, 19.8335];

  return (
    <div className="page-wide">
      <header className="page-header">
        <div className="page-title">
          <p className="eyebrow">Tourist tools</p>
          <h1>Position Simulator</h1>
          <div className="meta-row">
            {loading && <span className="badge">Loading position</span>}
            {!loading && location && (
              <span className="badge badge-green">
                {location.latitude.toFixed(5)}, {location.longitude.toFixed(5)}
              </span>
            )}
            {!loading && !location && <span className="badge badge-amber">No position</span>}
          </div>
        </div>
      </header>

      {status && <div className="alert alert-success">{status}</div>}

      <section className="map-frame map-frame-large">
        <MapContainer>
          <MapView center={mapCenter} zoom={13} />
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          <MapClickHandler onClick={handleMapClick} />

          {location && <Marker position={[location.latitude, location.longitude]} />}
        </MapContainer>
      </section>
    </div>
  );
}

export default Simulator;
