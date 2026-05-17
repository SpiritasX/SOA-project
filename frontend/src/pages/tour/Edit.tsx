import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  MapContainer,
  Marker,
  Polyline,
  TileLayer,
} from "react-leaflet";

import MapClickHandler from "../../components/MapClickHandler.tsx";
import {
  createTourLocation,
  deleteTourLocation,
  editTourLocation,
  getTourLocations,
} from "../../api/tour.ts";

type TourLocation = {
  id: number;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
};

function Edit() {
  const { id } = useParams();

  const tourId = Number(id);

  const [selectedLocation, setSelectedLocation] =
    useState<Pick<TourLocation, "latitude" | "longitude"> | null>(null);

  const [locations, setLocations] = useState<TourLocation[]>([]);

  const [showModal, setShowModal] = useState(false);

  const [editingLocation, setEditingLocation] =
    useState<TourLocation | null>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchLocations = async () => {
    if (Number.isNaN(tourId)) {
      setError("Invalid tour id");
      setLoading(false);
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await getTourLocations(tourId);

      if (!response.ok) {
        setError(await response.text());
        return;
      }

      const data: TourLocation[] = await response.json();
      setLocations(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load tour locations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, [tourId]);

  const resetModal = () => {
    setName("");
    setDescription("");
    setSelectedLocation(null);
    setEditingLocation(null);
    setShowModal(false);
  };

  const handleCreateLocation = async () => {
    if (!selectedLocation || Number.isNaN(tourId)) return;

    setError("");

    try {
      const response = await createTourLocation(tourId, {
        latitude: selectedLocation.latitude,
        longitude: selectedLocation.longitude,
        name,
        description,
      });

      if (!response.ok) {
        setError(await response.text());
        return;
      }

      const locationId = await response.json();

      const newLocation: TourLocation = {
        id: locationId,
        name,
        description,
        latitude: selectedLocation.latitude,
        longitude: selectedLocation.longitude,
      };

      setLocations((prev) => [...prev, newLocation]);
      resetModal();
    } catch (err) {
      console.error(err);
      setError("Failed to create location");
    }
  };

  const handleEditLocation = async () => {
    if (!editingLocation || Number.isNaN(tourId)) return;

    setError("");

    try {
      const response = await editTourLocation(tourId, editingLocation.id, {
        id: editingLocation.id,
        name,
        description,
      });

      if (!response.ok) {
        setError(await response.text());
        return;
      }

      setLocations((prev) =>
        prev.map((location) =>
          location.id === editingLocation.id
            ? {
                ...location,
                name,
                description,
              }
            : location
        )
      );

      resetModal();
    } catch (err) {
      console.error(err);
      setError("Failed to edit location");
    }
  };

  const handleDeleteLocation = async () => {
    if (!editingLocation || Number.isNaN(tourId)) return;

    setError("");

    try {
      const response = await deleteTourLocation(tourId, editingLocation.id);

      if (!response.ok) {
        setError(await response.text());
        return;
      }

      setLocations((prev) =>
        prev.filter((location) => location.id !== editingLocation.id)
      );

      resetModal();
    } catch (err) {
      console.error(err);
      setError("Failed to delete location");
    }
  };

  const openEditModal = (location: TourLocation) => {
    setEditingLocation(location);
    setSelectedLocation({
      latitude: location.latitude,
      longitude: location.longitude,
    });
    setName(location.name);
    setDescription(location.description);
    setShowModal(true);
  };

  return (
    <div>
      <h1>Edit Tour</h1>

      {loading && (
        <p>
          Loading locations...
        </p>
      )}

      {error && (
        <p style={{ color: "red", marginBottom: "10px" }}>
          {error}
        </p>
      )}

      <MapContainer
        center={[45.2671, 19.8335]}
        zoom={13}
        style={{ height: "600px", width: "100%" }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapClickHandler
          onClick={(lat, lng) => {
            setEditingLocation(null);
            setName("");
            setDescription("");

            setSelectedLocation({
              latitude: lat,
              longitude: lng,
            });

            setShowModal(true);
          }}
        />

        {locations.map((location) => (
          <Marker
            key={location.id}
            position={[
              location.latitude,
              location.longitude,
            ]}
            eventHandlers={{
              click: () => openEditModal(location),
            }}
          />
        ))}

        <Polyline
          positions={locations.map((location) => [
            location.latitude,
            location.longitude,
          ])}
        />
      </MapContainer>

      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              background: "white",
              padding: "20px",
              width: "400px",
              borderRadius: "8px",
            }}
          >
            <h2>
              {editingLocation ? "Edit Location" : "Create Location"}
            </h2>

            <div>
              <label>Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ width: "100%" }}
              />
            </div>

            <div style={{ marginTop: "10px" }}>
              <label>Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={{ width: "100%" }}
              />
            </div>

            {selectedLocation && (
              <p>
                Lat: {selectedLocation.latitude.toFixed(5)}
                <br />
                Lng: {selectedLocation.longitude.toFixed(5)}
              </p>
            )}

            <div
              style={{
                display: "flex",
                gap: "10px",
                marginTop: "15px",
              }}
            >
              <button
                onClick={
                  editingLocation
                    ? handleEditLocation
                    : handleCreateLocation
                }
              >
                Save
              </button>

              {editingLocation && (
                <button onClick={handleDeleteLocation}>
                  Delete
                </button>
              )}

              <button onClick={resetModal}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Edit;