import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getMyBlogs } from "../api/blog.ts";
import { getMyPurchases } from "../api/purchase.ts";
import { getMyTours } from "../api/tour.ts";
import { getMe, getRecommendations, updateUser } from "../api/user.ts";

type User = {
  id: string;
  firstName: string;
  lastName: string;
  profileImagePath: string | null;
  bio: string | null;
  motto: string | null;
  role: string;
};

type Comment = {
  id: string;
  authorId: number;
  content: string;
  createdAt: string;
  updatedAt: string;
};

type Blog = {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  comments: Comment[];
  likes: number;
};

type Tour = {
  id: number;
  name: string;
  description: string;
  tags: string[];
  price: number;
  difficulty: string;
  status: string;
  firstTourLocationId: number;
};

function initials(user: User) {
  return `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}` || "TL";
}

function statusClass(status: string) {
  if (status == null) return "";
  const normalized = status.toLowerCase();
  return `status-pill status-${normalized}`;
}

function formatDate(value: string) {
  return new Date(value).toLocaleString();
}

function Profile() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [tours, setTours] = useState<Tour[]>([]);
  const [purchases, setPurchases] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<User[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    profileImagePath: "",
    bio: "",
    motto: "",
  });
  const [error, setError] = useState("");

  const fetchUser = async () => {
    try {
      const response = await getMe();

      if (!response.ok) {
        setError(await response.text());
        return;
      }

      const data = await response.json();
      setUser(data);
      setFormData({
        firstName: data.firstName || "",
        lastName: data.lastName || "",
        profileImagePath: data.profileImagePath || "",
        bio: data.bio || "",
        motto: data.motto || "",
      });
    } catch (err) {
      console.error(err);
      setError("Failed to load profile.");
    }
  };

  const fetchBlogs = async () => {
    try {
      const response = await getMyBlogs();
      if (!response.ok) {
        setError(await response.text());
        return;
      }
      setBlogs(await response.json());
    } catch (err) {
      console.error("Error fetching blogs:", err);
    }
  };

  const fetchTours = async () => {
    try {
      const response = await getMyTours();
      if (!response.ok) {
        setError(await response.text());
        return;
      }
      setTours(await response.json());
    } catch (err) {
      console.error("Error fetching tours:", err);
    }
  };

  const fetchPurchases = async () => {
    try {
      const response = await getMyPurchases();
      if (response.ok) {
        setPurchases(await response.json());
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchRecommendations = async () => {
    try {
      const response = await getRecommendations();
      if (!response.ok) {
        setError(await response.text());
        return;
      }
      setRecommendations(await response.json());
    } catch (err) {
      console.error("Error fetching recommendations:", err);
    }
  };

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    try {
      const response = await updateUser(formData);

      if (!response.ok) {
        setError(await response.text());
        return;
      }

      setEditing(false);
      fetchUser();
    } catch (err) {
      console.error(err);
      setError("Failed to update profile.");
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    if (!user) return;

    if (user.role === "GUIDE") fetchTours();
    if (user.role === "TOURIST") fetchPurchases();

    fetchBlogs();
    fetchRecommendations();
  }, [user]);

  const renderTourSection = (title: string, status: string) => {
    const filteredTours = tours.filter((tour) => tour.status === status);

    return (
      <section>
        <div className="section-header">
          <div className="section-title">
            <h2>{title}</h2>
            <p className="muted">{filteredTours.length} tours</p>
          </div>
        </div>

        {filteredTours.length === 0 ? (
          <div className="empty-state">
            <h3>No {title.toLowerCase()}</h3>
          </div>
        ) : (
          <div className="list-stack">
            {filteredTours.map((tour) => (
              <article className="card" key={tour.id}>
                <div className="card-body">
                  <div className="spaced-row">
                    <Link to={`/tour/${tour.id}`}>
                      <h3>{tour.name}</h3>
                    </Link>
                    <span className={statusClass(tour.status)}>{tour.status}</span>
                  </div>
                  <p className="description">{tour.description}</p>
                  <div className="meta-row">
                    <span>{tour.difficulty}</span>
                    <span className="price">${tour.price}</span>
                  </div>
                  {tour.tags.length > 0 && (
                    <div className="tag-list">
                      {tour.tags.map((tag) => (
                        <span className="tag" key={tag}>
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    );
  };

  if (!user) {
    return (
      <div className="state-page">
        <div className="state-card">
          <p className="eyebrow">Loading</p>
          <h1>Loading profile</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <header className="profile-hero">
        <div className="avatar">
          {user.profileImagePath ? (
            <img src={user.profileImagePath} alt={`${user.firstName} ${user.lastName}`} />
          ) : (
            initials(user)
          )}
        </div>

        <div className="page-title">
          <p className="eyebrow">Profile</p>
          <h1>
            {user.firstName} {user.lastName}
          </h1>
          <p className="subtitle">{user.motto || "No motto set."}</p>
          <div className="meta-row">
            <span className="badge badge-green">{user.role}</span>
            {user.bio && <span>{user.bio}</span>}
          </div>
        </div>

        <button className="btn btn-outline" onClick={() => setEditing(true)}>
          Edit Profile
        </button>
      </header>

      {error && <div className="alert alert-error">{error}</div>}

      {editing && (
        <section className="form-panel">
          <form className="form" onSubmit={handleSave}>
            <div className="section-header">
              <div className="section-title">
                <h2>Edit profile</h2>
                <p className="muted">Personal details and public profile.</p>
              </div>
            </div>

            <div className="form-grid">
              <div className="field">
                <label htmlFor="firstName">First name</label>
                <input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                />
              </div>

              <div className="field">
                <label htmlFor="lastName">Last name</label>
                <input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="field">
              <label htmlFor="profileImagePath">Profile image path</label>
              <input
                id="profileImagePath"
                value={formData.profileImagePath}
                onChange={(e) =>
                  setFormData({ ...formData, profileImagePath: e.target.value })
                }
              />
            </div>

            <div className="field">
              <label htmlFor="bio">Bio</label>
              <textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              />
            </div>

            <div className="field">
              <label htmlFor="motto">Motto</label>
              <input
                id="motto"
                value={formData.motto}
                onChange={(e) => setFormData({ ...formData, motto: e.target.value })}
              />
            </div>

            <div className="button-row">
              <button className="btn btn-primary" type="submit">
                Save
              </button>
              <button
                className="btn btn-ghost"
                type="button"
                onClick={() => setEditing(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </section>
      )}

      <div className="split-grid">
        <section>
          <div className="section-header">
            <div className="section-title">
              <h2>Recommended for You</h2>
              <p className="muted">People near your network.</p>
            </div>
          </div>

          {recommendations.length === 0 ? (
            <div className="empty-state">
              <h3>No recommendations</h3>
            </div>
          ) : (
            <div className="list-stack">
              {recommendations.map((rec) => (
                <Link className="compact-card click-card" key={rec.id} to={`/user/${rec.id}`}>
                  <div className="inline-row">
                    <div className="avatar avatar-small">{initials(rec)}</div>
                    <div>
                      <h3>
                        {rec.firstName} {rec.lastName}
                      </h3>
                      <p>{rec.motto || rec.role}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        <section>
          <div className="section-header">
            <div className="section-title">
              <h2>My Blogs</h2>
              <p className="muted">{blogs.length} posts</p>
            </div>
            <Link className="btn btn-outline btn-small" to="/blog/create">
              Write
            </Link>
          </div>

          {blogs.length === 0 ? (
            <div className="empty-state">
              <h3>No blog posts</h3>
            </div>
          ) : (
            <div className="list-stack">
              {blogs.map((blog) => (
                <article className="card" key={blog.id}>
                  <div className="card-body">
                    <div className="spaced-row">
                      <Link to={`/blog/${blog.id}`}>
                        <h3>{blog.title}</h3>
                      </Link>
                      <span className="badge badge-coral">{blog.likes} likes</span>
                    </div>
                    <div className="markdown">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {blog.description}
                      </ReactMarkdown>
                    </div>
                    <p className="muted">Created {formatDate(blog.createdAt)}</p>
                    {blog.comments.length > 0 && (
                      <div className="comment-list">
                        {blog.comments.map((comment) => (
                          <div className="comment-item" key={comment.id}>
                            <p>{comment.content}</p>
                            <p className="muted">{formatDate(comment.createdAt)}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>

      {user.role === "TOURIST" && (
        <section>
          <div className="section-header">
            <div className="section-title">
              <h2>Purchased Tours</h2>
              <p className="muted">{purchases.length} orders</p>
            </div>
          </div>

          {purchases.length === 0 ? (
            <div className="empty-state">
              <h3>No purchased tours</h3>
            </div>
          ) : (
            <div className="content-grid">
              {purchases.map((order) => (
                <article className="card" key={order.id}>
                  <div className="card-body">
                    <div className="spaced-row">
                      <h3>Order {order.id}</h3>
                      <span className={statusClass(order.status)}>{order.status}</span>
                    </div>
                    <p className="price">${order.totalPrice}</p>
                    <div className="list-stack">
                      {order.tours.map((tour: any) => (
                        <Link className="compact-card click-card" key={tour.id} to={`/tour/${tour.id}`}>
                          <div className="spaced-row">
                            <span>{tour.name}</span>
                            <strong>${tour.price}</strong>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      )}

      {user.role === "GUIDE" && (
        <div className="page">
          {renderTourSection("Draft Tours", "DRAFT")}
          {renderTourSection("Published Tours", "PUBLISHED")}
          {renderTourSection("Archived Tours", "ARCHIVED")}
        </div>
      )}
    </div>
  );
}

export default Profile;
