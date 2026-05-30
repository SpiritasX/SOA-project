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
  getTour,
  updateTour,
  addTourDuration,
  removeTourDuration,
  publishTour,
  archiveTour,
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

  const [tour, setTour] = useState<any>(null);
  const [tourName, setTourName] = useState("");
  const [tourDescription, setTourDescription] = useState("");
  const [difficulty, setDifficulty] = useState("EASY");
  const [tags, setTags] = useState("");
  const [price, setPrice] = useState(0);
  const [durations, setDurations] = useState<any[]>([]);

  const [newTransportType, setNewTransportType] = useState("WALKING");
  const [newDurationMinutes, setNewDurationMinutes] = useState(0);

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

  const fetchData = async () => {
    if (Number.isNaN(tourId)) {
      setError("Invalid tour id");
      setLoading(false);
      return;
    }

    setError("");
    setLoading(true);

    try {
      const [tourRes, locRes] = await Promise.all([
        getTour(tourId),
        getTourLocations(tourId),
      ]);

      if (!tourRes.ok) {
        setError(await tourRes.text());
        return;
      }

      if (!locRes.ok) {
        setError(await locRes.text());
        return;
      }

      const tourData = await tourRes.json();
      const locData = await locRes.json();

      setTour(tourData);
      setTourName(tourData.name);
      setTourDescription(tourData.description);
      setDifficulty(tourData.difficulty);
      setTags(tourData.tags.join(", "));
      setPrice(tourData.price);
      setDurations(tourData.durations);
      setLocations(locData);
    } catch (err) {
      console.error(err);
      setError("Failed to load tour data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
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

  const handleUpdateTour = async () => {
    setError("");
    try {
      const response = await updateTour(tourId, {
        name: tourName,
        description: tourDescription,
        difficulty,
        tags: tags.split(",").map((t) => t.trim()).filter((t) => t !== ""),
        price,
      });

      if (!response.ok) {
        setError(await response.text());
        return;
      }
    } catch (err) {
      console.error(err);
      setError("Failed to update tour");
    }
  };

  const handleAddDuration = async () => {
    setError("");
    try {
      const response = await addTourDuration(tourId, {
        transportType: newTransportType,
        durationMinutes: newDurationMinutes,
      });

      if (!response.ok) {
        setError(await response.text());
        return;
      }

      // Re-fetch to get updated durations with IDs
      const tourRes = await getTour(tourId);
      const tourData = await tourRes.json();
      setDurations(tourData.durations);
    } catch (err) {
      console.error(err);
      setError("Failed to add duration");
    }
  };

  const handleRemoveDuration = async (durationId: number) => {
    setError("");
    try {
      const response = await removeTourDuration(tourId, durationId);

      if (!response.ok) {
        setError(await response.text());
        return;
      }

      setDurations((prev) => prev.filter((d) => d.id !== durationId));
    } catch (err) {
      console.error(err);
      setError("Failed to remove duration");
    }
  };

  const handlePublish = async () => {
    setError("");
    try {
      const response = await publishTour(tourId);
      if (!response.ok) {
        setError(await response.text());
        return;
      }
      setTour({ ...tour, status: "PUBLISHED" });
    } catch (err) {
      console.error(err);
      setError("Failed to publish tour");
    }
  };

  const handleArchive = async () => {
    setError("");
    try {
      const response = await archiveTour(tourId);
      if (!response.ok) {
        setError(await response.text());
        return;
      }
      setTour({ ...tour, status: "ARCHIVED" });
    } catch (err) {
      console.error(err);
      setError("Failed to archive tour");
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

      {loading && <p>Loading...</p>}

      {!loading && tour && (
        <div
          style={{
            marginBottom: "20px",
            border: "1px solid #ccc",
            padding: "10px",
          }}
        >
          <h2>Tour Details</h2>
          <div>
            <label>Name</label>
            <input
              value={tourName}
              onChange={(e) => setTourName(e.target.value)}
              style={{ width: "100%" }}
            />
          </div>
          <div style={{ marginTop: "10px" }}>
            <label>Description</label>
            <textarea
              value={tourDescription}
              onChange={(e) => setTourDescription(e.target.value)}
              style={{ width: "100%" }}
            />
          </div>
          <div style={{ marginTop: "10px" }}>
            <label>Difficulty</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              style={{ width: "100%" }}
            >
              <option value="EASY">Easy</option>
              <option value="MEDIUM">Medium</option>
              <option value="HARD">Hard</option>
            </select>
          </div>
          <div style={{ marginTop: "10px" }}>
            <label>Tags (comma separated)</label>
            <input
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              style={{ width: "100%" }}
            />
          </div>
          <div style={{ marginTop: "10px" }}>
            <label>Price</label>
            <input
              value={price}
              type="number"
              onChange={(e) => setPrice(Number(e.target.value))}
              style={{ width: "100%" }}
            />
          </div>
          <button onClick={handleUpdateTour} style={{ marginTop: "10px" }}>
            Save Tour Details
          </button>

          <div style={{ marginTop: "10px" }}>
            <p>Status: {tour.status}</p>
            {tour.status != "PUBLISHED" && (
              <button onClick={handlePublish}>Publish</button>
            )}
            {tour.status === "PUBLISHED" && (
              <button onClick={handleArchive}>Archive</button>
            )}
          </div>
        </div>
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

      {!loading && tour && (
        <div
          style={{
            marginTop: "20px",
            border: "1px solid #ccc",
            padding: "10px",
          }}
        >
          <h2>Durations</h2>
          <ul>
            {durations.map((d) => (
              <li key={d.id}>
                {d.transportType}: {d.durationMinutes} mins
                <button
                  onClick={() => handleRemoveDuration(d.id)}
                  style={{ marginLeft: "10px" }}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>

          <div
            style={{
              marginTop: "10px",
              borderTop: "1px solid #eee",
              paddingTop: "10px",
            }}
          >
            <h3>Add Duration</h3>
            <select
              value={newTransportType}
              onChange={(e) => setNewTransportType(e.target.value)}
            >
              <option value="WALKING">Walking</option>
              <option value="BICYCLE">Bicycle</option>
              <option value="CAR">Car</option>
            </select>
            <input
              type="number"
              value={newDurationMinutes}
              onChange={(e) => setNewDurationMinutes(Number(e.target.value))}
              placeholder="Minutes"
            />
            <button onClick={handleAddDuration}>Add</button>
          </div>
        </div>
      )}

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