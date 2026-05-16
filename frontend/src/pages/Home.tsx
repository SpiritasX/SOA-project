import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getFeed } from "../api/blog";
import { getUser } from "../api/user";

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

  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <div>
      <h1>Your Feed</h1>

      <ul>
        {blogs.map((blog) => (
          <li key={blog.id}>
            <Link to={`/blog/${blog.id}`}>
              <h2>{blog.title}</h2>
            </Link>

            <p>{blog.description}</p>

            <p>
              Author:
              {" "}
              <Link to={`/user/${blog.authorId}`}>
                {blog.authorName}
              </Link>
            </p>

            <p>
              Likes:
              {" "}
              {blog.likes}
            </p>

            <p>
              Created:
              {" "}
              {new Date(blog.createdAt).toLocaleString()}
            </p>
          </li>
        ))}
      </ul>

      {error && (
        <p style={{ color: "red" }}>
          {error}
        </p>
      )}
    </div>
  );
}

export default Home;