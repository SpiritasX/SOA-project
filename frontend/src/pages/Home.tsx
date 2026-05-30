import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getFeed } from "../api/blog";
import { getUser } from "../api/user";
import { getPublishedTours } from "../api/tour";

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
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [tours, setTours] = useState<any[]>([]);
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

  useEffect(() => {
    fetchBlogs();
    fetchTours();
  }, []);

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