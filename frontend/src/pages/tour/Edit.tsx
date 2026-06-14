import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { MapContainer, Marker, Polyline, TileLayer } from "react-leaflet";
import MapClickHandler from "../../components/MapClickHandler.tsx";
import MapView from "../../components/MapView.tsx";
import {
  addTourDuration,
  archiveTour,
  createTourLocation,
  deleteTourLocation,
  editTourLocation,
  getTour,
  getTourLocations,
  publishTour,
  removeTourDuration,
  updateTour,
} from "../../api/tour.ts";

type TourLocation = {
  id: number;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
};

type TourDuration = {
  id: number;
  transportType: string;
  durationMinutes: number;
};

type TourDetails = {
  id: number;
  name: string;
  description: string;
  tags: string[];
  price: number;
  difficulty: string;
  status: string;
  durations: TourDuration[];
};

function statusClass(status: string) {
  return `status-pill status-${status.toLowerCase()}`;
}

function Edit() {
  const { id } = useParams();
  const tourId = Number(id);

  const [tour, setTour] = useState<TourDetails | null>(null);
  const [tourName, setTourName] = useState("");
  const [tourDescription, setTourDescription] = useState("");
  const [difficulty, setDifficulty] = useState("EASY");
  const [tags, setTags] = useState("");
  const [price, setPrice] = useState(0);
  const [durations, setDurations] = useState<TourDuration[]>([]);
  const [newTransportType, setNewTransportType] = useState("WALKING");
  const [newDurationMinutes, setNewDurationMinutes] = useState(0);
  const [selectedLocation, setSelectedLocation] =
    useState<Pick<TourLocation, "latitude" | "longitude"> | null>(null);
  const [locations, setLocations] = useState<TourLocation[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingLocation, setEditingLocation] = useState<TourLocation | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    if (Number.isNaN(tourId)) {
      setError("Invalid tour id.");
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
      setTags((tourData.tags || []).join(", "));
      setPrice(tourData.price);
      setDurations(tourData.durations || []);
      setLocations(locData);
    } catch (err) {
      console.error(err);
      setError("Failed to load tour data.");
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
    setNotice("");

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
      setLocations((prev) => [
        ...prev,
        {
          id: locationId,
          name,
          description,
          latitude: selectedLocation.latitude,
          longitude: selectedLocation.longitude,
        },
      ]);
      setNotice("Location saved.");
      resetModal();
    } catch (err) {
      console.error(err);
      setError("Failed to create location.");
    }
  };

  const handleEditLocation = async () => {
    if (!editingLocation || Number.isNaN(tourId)) return;

    setError("");
    setNotice("");

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
      setNotice("Location updated.");
      resetModal();
    } catch (err) {
      console.error(err);
      setError("Failed to edit location.");
    }
  };

  const handleDeleteLocation = async () => {
    if (!editingLocation || Number.isNaN(tourId)) return;

    setError("");
    setNotice("");

    try {
      const response = await deleteTourLocation(tourId, editingLocation.id);

      if (!response.ok) {
        setError(await response.text());
        return;
      }

      setLocations((prev) =>
        prev.filter((location) => location.id !== editingLocation.id)
      );
      setNotice("Location deleted.");
      resetModal();
    } catch (err) {
      console.error(err);
      setError("Failed to delete location.");
    }
  };

  const handleUpdateTour = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setNotice("");

    try {
      const tagList = tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag !== "");
      const response = await updateTour(tourId, {
        name: tourName,
        description: tourDescription,
        difficulty,
        tags: tagList,
        price,
      });

      if (!response.ok) {
        setError(await response.text());
        return;
      }

      setTour((prev) =>
        prev
          ? {
              ...prev,
              name: tourName,
              description: tourDescription,
              difficulty,
              tags: tagList,
              price,
            }
          : prev
      );
      setNotice("Tour details saved.");
    } catch (err) {
      console.error(err);
      setError("Failed to update tour.");
    }
  };

  const handleAddDuration = async () => {
    setError("");
    setNotice("");

    try {
      const response = await addTourDuration(tourId, {
        transportType: newTransportType,
        durationMinutes: newDurationMinutes,
      });

      if (!response.ok) {
        setError(await response.text());
        return;
      }

      const tourRes = await getTour(tourId);
      const tourData = await tourRes.json();
      setDurations(tourData.durations || []);
      setNotice("Duration added.");
    } catch (err) {
      console.error(err);
      setError("Failed to add duration.");
    }
  };

  const handleRemoveDuration = async (durationId: number) => {
    setError("");
    setNotice("");

    try {
      const response = await removeTourDuration(tourId, durationId);

      if (!response.ok) {
        setError(await response.text());
        return;
      }

      setDurations((prev) => prev.filter((duration) => duration.id !== durationId));
      setNotice("Duration removed.");
    } catch (err) {
      console.error(err);
      setError("Failed to remove duration.");
    }
  };

  const handlePublish = async () => {
    setError("");
    setNotice("");

    try {
      const response = await publishTour(tourId);
      if (!response.ok) {
        setError(await response.text());
        return;
      }
      setTour((prev) => (prev ? { ...prev, status: "PUBLISHED" } : prev));
      setNotice("Tour published.");
    } catch (err) {
      console.error(err);
      setError("Failed to publish tour.");
    }
  };

  const handleArchive = async () => {
    setError("");
    setNotice("");

    try {
      const response = await archiveTour(tourId);
      if (!response.ok) {
        setError(await response.text());
        return;
      }
      setTour((prev) => (prev ? { ...prev, status: "ARCHIVED" } : prev));
      setNotice("Tour archived.");
    } catch (err) {
      console.error(err);
      setError("Failed to archive tour.");
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

  if (loading) {
    return (
      <div className="state-page">
        <div className="state-card">
          <p className="eyebrow">Loading</p>
          <h1>Loading editor</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wide">
      <header className="page-header">
        <div className="page-title">
          <p className="eyebrow">Guide editor</p>
          <h1>{tour?.name || "Edit Tour"}</h1>
          {tour && (
            <div className="meta-row">
              <span className={statusClass(tour.status)}>{tour.status}</span>
              <span>{locations.length} key points</span>
              <span>{durations.length} durations</span>
            </div>
          )}
        </div>
        {tour && (
          <div className="toolbar">
            {tour.status !== "PUBLISHED" && (
              <button className="btn btn-primary" onClick={handlePublish}>
                Publish
              </button>
            )}
            {tour.status === "PUBLISHED" && (
              <button className="btn btn-coral" onClick={handleArchive}>
                Archive
              </button>
            )}
          </div>
        )}
      </header>

      {error && <div className="alert alert-error">{error}</div>}
      {notice && <div className="alert alert-success">{notice}</div>}

      {tour && (
        <div className="map-layout">
          <aside className="map-sidebar">
            <section className="form-panel">
              <form className="form" onSubmit={handleUpdateTour}>
                <div className="section-title">
                  <h2>Tour Details</h2>
                </div>

                <div className="field">
                  <label htmlFor="tourName">Name</label>
                  <input
                    id="tourName"
                    value={tourName}
                    onChange={(e) => setTourName(e.target.value)}
                  />
                </div>

                <div className="field">
                  <label htmlFor="tourDescription">Description</label>
                  <textarea
                    id="tourDescription"
                    value={tourDescription}
                    onChange={(e) => setTourDescription(e.target.value)}
                  />
                </div>

                <div className="form-grid">
                  <div className="field">
                    <label htmlFor="difficulty">Difficulty</label>
                    <select
                      id="difficulty"
                      value={difficulty}
                      onChange={(e) => setDifficulty(e.target.value)}
                    >
                      <option value="EASY">Easy</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HARD">Hard</option>
                    </select>
                  </div>

                  <div className="field">
                    <label htmlFor="price">Price</label>
                    <input
                      id="price"
                      value={price}
                      type="number"
                      onChange={(e) => setPrice(Number(e.target.value))}
                    />
                  </div>
                </div>

                <div className="field">
                  <label htmlFor="tags">Tags</label>
                  <input
                    id="tags"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                  />
                </div>

                <button className="btn btn-primary" type="submit">
                  Save Tour Details
                </button>
              </form>
            </section>

            <section className="tool-panel">
              <div className="section-header">
                <div className="section-title">
                  <h2>Durations</h2>
                  <p className="muted">{durations.length} transport options</p>
                </div>
              </div>

              <div className="list-stack">
                {durations.map((duration) => (
                  <div className="compact-card" key={duration.id}>
                    <div className="spaced-row">
                      <div>
                        <strong>{duration.transportType}</strong>
                        <p className="muted">{duration.durationMinutes} minutes</p>
                      </div>
                      <button
                        className="btn btn-danger btn-small"
                        onClick={() => handleRemoveDuration(duration.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="form">
                <div className="form-grid">
                  <div className="field">
                    <label htmlFor="transportType">Transport</label>
                    <select
                      id="transportType"
                      value={newTransportType}
                      onChange={(e) => setNewTransportType(e.target.value)}
                    >
                      <option value="WALKING">Walking</option>
                      <option value="BICYCLE">Bicycle</option>
                      <option value="CAR">Car</option>
                    </select>
                  </div>

                  <div className="field">
                    <label htmlFor="durationMinutes">Minutes</label>
                    <input
                      id="durationMinutes"
                      type="number"
                      value={newDurationMinutes}
                      onChange={(e) => setNewDurationMinutes(Number(e.target.value))}
                    />
                  </div>
                </div>
                <button className="btn btn-outline" onClick={handleAddDuration}>
                  Add Duration
                </button>
              </div>
            </section>

            <section className="tool-panel">
              <div className="section-title">
                <h2>Route Points</h2>
                <p className="muted">{locations.length} locations</p>
              </div>
              <div className="location-list">
                {locations.map((location) => (
                  <button
                    className="location-item"
                    key={location.id}
                    onClick={() => openEditModal(location)}
                  >
                    <h3>{location.name}</h3>
                    <p>{location.description}</p>
                    <p className="muted">
                      {location.latitude.toFixed(5)}, {location.longitude.toFixed(5)}
                    </p>
                  </button>
                ))}
              </div>
            </section>
          </aside>

          <section className="map-frame map-frame-large">
            <MapContainer>
              <MapView center={[45.2671, 19.8335]} zoom={13} />
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

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
                  position={[location.latitude, location.longitude]}
                  eventHandlers={{
                    click: () => openEditModal(location),
                  }}
                />
              ))}

              {locations.length > 1 && (
                <Polyline
                  positions={locations.map((location) => [
                    location.latitude,
                    location.longitude,
                  ])}
                />
              )}
            </MapContainer>
          </section>
        </div>
      )}

      {showModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <div className="form">
              <div className="section-title">
                <p className="eyebrow">Location</p>
                <h2>{editingLocation ? "Edit Location" : "Create Location"}</h2>
              </div>

              <div className="field">
                <label htmlFor="locationName">Name</label>
                <input
                  id="locationName"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="field">
                <label htmlFor="locationDescription">Description</label>
                <textarea
                  id="locationDescription"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              {selectedLocation && (
                <div className="compact-card">
                  <p>
                    {selectedLocation.latitude.toFixed(5)},{" "}
                    {selectedLocation.longitude.toFixed(5)}
                  </p>
                </div>
              )}

              <div className="button-row">
                <button
                  className="btn btn-primary"
                  onClick={editingLocation ? handleEditLocation : handleCreateLocation}
                >
                  Save
                </button>

                {editingLocation && (
                  <button className="btn btn-danger" onClick={handleDeleteLocation}>
                    Delete
                  </button>
                )}

                <button className="btn btn-ghost" onClick={resetModal}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Edit;
