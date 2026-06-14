import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getFeed } from "../api/blog";
import { getPublishedTours } from "../api/tour";
import { getUser } from "../api/user";
import { getMyPurchases } from "../api/purchase";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

type Comment = {
  id: string;
  authorId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
};

type BlogPost = {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  authorId: string;
  authorName: string;
  comments: Comment[];
  likes: number;
};

type Tour = {
  id: number;
  name: string;
  description: string;
  difficulty: string;
  distance: number;
  price: number;
  tags?: string[];
};

function formatDate(value: string) {
  return new Date(value).toLocaleString();
}

function difficultyClass(difficulty: string) {
  if (difficulty === "HARD") return "badge badge-coral";
  if (difficulty === "MEDIUM") return "badge badge-amber";
  return "badge badge-green";
}

function Home() {
  const { addToCart, items } = useCart();
  const { auth } = useAuth();
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [tours, setTours] = useState<Tour[]>([]);
  const [purchasedTourIds, setPurchasedTourIds] = useState<number[]>([]);
  const [loadingBlogs, setLoadingBlogs] = useState(false);
  const [loadingTours, setLoadingTours] = useState(false);
  const [error, setError] = useState("");

  const fetchBlogs = async () => {
    setLoadingBlogs(true);
    try {
      const response = await getFeed();

      if (!response.ok) {
        setError(await response.text());
        return;
      }

      const blogsData = await response.json();
      const blogsWithAuthors = await Promise.all(
        blogsData.map(async (blog: BlogPost) => {
          const userRes = await getUser(Number(blog.authorId));
          if (!userRes.ok) {
            return {
              ...blog,
              authorName: `User ${blog.authorId}`,
            };
          }

          const user = await userRes.json();
          return {
            ...blog,
            authorName: `${user.firstName} ${user.lastName}`,
          };
        })
      );

      setBlogs(blogsWithAuthors);
    } catch (err) {
      console.error(err);
      setError("Failed to load feed.");
    } finally {
      setLoadingBlogs(false);
    }
  };

  const fetchTours = async () => {
    setLoadingTours(true);
    try {
      const response = await getPublishedTours();

      if (!response.ok) {
        setError(await response.text());
        return;
      }

      setTours(await response.json());
    } catch (err) {
      console.error(err);
      setError("Failed to load tours.");
    } finally {
      setLoadingTours(false);
    }
  };

  const fetchPurchases = async () => {
    if (auth.role !== "TOURIST") {
      setPurchasedTourIds([]);
      return;
    }

    const res = await getMyPurchases();
    if (!res.ok) return;

    const purchases = await res.json();
    const tourIds = new Set<number>();
    purchases.forEach((purchase: any) => {
      purchase.tours.forEach((tour: Tour) => tourIds.add(tour.id));
    });
    setPurchasedTourIds(Array.from(tourIds));
  };

  useEffect(() => {
    if (auth.loading) return;

    if (!auth.token) {
      setBlogs([]);
      setTours([]);
      setPurchasedTourIds([]);
      return;
    }

    setError("");
    fetchBlogs();
    fetchTours();
    fetchPurchases();
  }, [auth.loading, auth.role, auth.token]);

  if (!auth.token && !auth.loading) {
    return (
      <div className="auth-layout">
        <section className="auth-copy">
          <p className="eyebrow">Social touring</p>
          <h1>Discover guided tours through people you follow.</h1>
          <p className="subtitle">Travel stories, guided routes, and active tours.</p>
          <div className="button-row">
            <Link className="btn btn-primary" to="/login">
              Login
            </Link>
            <Link className="btn btn-outline" to="/register">
              Register
            </Link>
          </div>
        </section>
        <section className="tool-panel">
          <div className="three-grid">
            <div className="compact-card">
              <p className="eyebrow">Tours</p>
              <h2>Publish</h2>
              <p>Guide route drafts and published offers.</p>
            </div>
            <div className="compact-card">
              <p className="eyebrow">Stories</p>
              <h2>Follow</h2>
              <p>Posts from followed travelers.</p>
            </div>
            <div className="compact-card">
              <p className="eyebrow">Execution</p>
              <h2>Explore</h2>
              <p>Purchased tours and route progress.</p>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="page">
      <header className="page-header">
        <div className="page-title">
          <p className="eyebrow">Explore</p>
          <h1>Your travel workspace</h1>
          <p className="subtitle">Recent social activity and available routes.</p>
        </div>
        <div className="toolbar">
          <span className="badge badge-green">{blogs.length} blog posts</span>
          <span className="badge">{tours.length} published tours</span>
        </div>
      </header>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="split-grid">
        <section>
          <div className="section-header">
            <div className="section-title">
              <h2>Feed</h2>
              <p className="muted">Blog posts from your network.</p>
            </div>
            <Link className="btn btn-outline btn-small" to="/blog/create">
              Write
            </Link>
          </div>

          <div className="list-stack">
            {loadingBlogs && (
              <div className="empty-state">
                <h3>Loading feed</h3>
              </div>
            )}

            {!loadingBlogs && blogs.length === 0 && (
              <div className="empty-state">
                <h3>No posts yet</h3>
                <p>Your feed is quiet.</p>
              </div>
            )}

            {blogs.map((blog) => (
              <article className="card click-card" key={blog.id}>
                <Link className="card-body" to={`/blog/${blog.id}`}>
                  <div className="spaced-row">
                    <h2>{blog.title}</h2>
                    <span className="badge badge-coral">{blog.likes} likes</span>
                  </div>
                  <p className="description">{blog.description}</p>
                  <div className="meta-row">
                    <span>By {blog.authorName}</span>
                    <span>{formatDate(blog.createdAt)}</span>
                  </div>
                </Link>
                <div className="card-body">
                  <Link className="btn btn-ghost btn-small" to={`/user/${blog.authorId}`}>
                    View author
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section>
          <div className="section-header">
            <div className="section-title">
              <h2>Published Tours</h2>
              <p className="muted">Routes currently available.</p>
            </div>
            {auth.role === "TOURIST" && (
              <Link className="btn btn-outline btn-small" to="/cart">
                Cart
              </Link>
            )}
          </div>

          <div className="list-stack">
            {loadingTours && (
              <div className="empty-state">
                <h3>Loading tours</h3>
              </div>
            )}

            {!loadingTours && tours.length === 0 && (
              <div className="empty-state">
                <h3>No published tours</h3>
                <p>No routes are available.</p>
              </div>
            )}

            {tours.map((tour) => {
              const purchased = purchasedTourIds.includes(tour.id);
              const inCart = items.some((item) => item.id === tour.id);

              return (
                <article className="card" key={tour.id}>
                  <div className="card-body">
                    <div className="spaced-row">
                      <Link to={`/tour/${tour.id}`}>
                        <h2>{tour.name}</h2>
                      </Link>
                      <span className="price">${tour.price}</span>
                    </div>

                    <p className="description">{tour.description}</p>

                    <div className="meta-row">
                      <span className={difficultyClass(tour.difficulty)}>
                        {tour.difficulty}
                      </span>
                      <span>{tour.distance.toFixed(2)} km</span>
                      {purchased && (
                        <span className="badge badge-green">Purchased</span>
                      )}
                    </div>

                    {tour.tags && tour.tags.length > 0 && (
                      <div className="tag-list">
                        {tour.tags.map((tag) => (
                          <span className="tag" key={tag}>
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="button-row">
                      <Link className="btn btn-outline" to={`/tour/${tour.id}`}>
                        Details
                      </Link>
                      {auth.role === "TOURIST" && !purchased && (
                        <button
                          className="btn btn-primary"
                          disabled={inCart}
                          onClick={() =>
                            addToCart({
                              id: tour.id,
                              name: tour.name,
                              price: tour.price,
                            })
                          }
                        >
                          {inCart ? "In cart" : "Add to cart"}
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}

export default Home;
