import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getFeed } from "../api/blog";
import { getUser } from "../api/user";
import { getPublishedTours } from "../api/tour";
import { getMyPurchases } from "../api/purchase";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

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

function Home() {
  const { addToCart } = useCart();
  const { auth } = useAuth();
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [tours, setTours] = useState<any[]>([]);
  const [purchasedTourIds, setPurchasedTourIds] = useState<number[]>([]);
  const [error, setError] = useState("");

  const fetchBlogs = async () => {
    try {
      const response = await getFeed();

      if (!response.ok) {
        setError(await response.text());
        return;
      }

      const blogsData = await response.json();

      const blogsWithAuthors = await Promise.all(
        blogsData.map(async (blog: any) => {
          const userRes = await getUser(blog.authorId);
          const user = await userRes.json();

          return {
            ...blog,
            authorName: `${user.firstName} ${user.lastName}`,
          };
        })
      );

      setBlogs(blogsWithAuthors);

    } catch (error) {
      console.error(error);
    }
  };

  const fetchTours = async () => {
    try {
      const response = await getPublishedTours();

      if (!response.ok) {
        setError(await response.text());
        return;
      }

      const toursData = await response.json();
      setTours(toursData);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchPurchases = async () => {
    if (auth.role === "TOURIST") {
      const res = await getMyPurchases();
      if (!res.ok) return [];
      const purchases = await res.json();
      const tourIds = new Set<number>();
      purchases.forEach((p: any) => {
        p.tours.forEach((t: any) => tourIds.add(t.id));
      });
      setPurchasedTourIds(Array.from(tourIds));
    }
  };

  useEffect(() => {
    fetchBlogs();
    fetchTours();
    fetchPurchases();
  }, [auth]);

  return (
    <div style={{ display: "flex", gap: "20px" }}>
      <div style={{ flex: 1 }}>
        <h1>Your Feed (Blogs)</h1>

        <ul>
          {blogs.map((blog) => (
            <li key={blog.id}>
              <Link to={`/blog/${blog.id}`}>
                <h2>{blog.title}</h2>
              </Link>

              <p>{blog.description}</p>

              <p>
                Author:{" "}
                <Link to={`/user/${blog.authorId}`}>{blog.authorName}</Link>
              </p>

              <p>Likes: {blog.likes}</p>

              <p>Created: {new Date(blog.createdAt).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      </div>

      <div style={{ flex: 1 }}>
        <h1>Published Tours</h1>

        <ul>
          {tours.map((tour) => (
            <li key={tour.id}>
              <Link to={`/tour/${tour.id}`}>
                <h2>{tour.name}</h2>
              </Link>

              <p>{tour.description}</p>
              <p>Difficulty: {tour.difficulty}</p>
              <p>Distance: {tour.distance.toFixed(2)} km</p>
              <p>Price: ${tour.price}</p>
              
              {auth.role === "TOURIST" && (
                purchasedTourIds.includes(tour.id) ? (
                  <p style={{ color: "green", fontWeight: "bold" }}>Purchased</p>
                ) : (
                  <button
                    onClick={() => addToCart({ id: tour.id, name: tour.name, price: tour.price })}
                    style={{
                      marginBottom: "10px",
                      padding: "5px 10px",
                      backgroundColor: "#28a745",
                      color: "white",
                      border: "none",
                      borderRadius: "3px",
                      cursor: "pointer",
                    }}
                  >
                    Add to Cart
                  </button>
                )
              )}
              
              {tour.tags && tour.tags.length > 0 && (
                <div style={{ marginBottom: "10px" }}>
                  Tags:{" "}
                  {tour.tags.map((tag: string) => (
                    <span
                      key={tag}
                      style={{
                        marginRight: "5px",
                        padding: "2px 5px",
                        background: "#eee",
                        borderRadius: "3px",
                      }}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>

      {error && (
        <p style={{ color: "red", position: "fixed", bottom: 0 }}>{error}</p>
      )}
    </div>
  );
}

export default Home;