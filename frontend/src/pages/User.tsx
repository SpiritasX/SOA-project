import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getUser } from "../api/user";
import {
  getFollowingStatus,
  follow,
  unfollow
} from "../api/follower.ts";

type User = {
  id: string;
  firstName: string;
  lastName: string;
  profileImagePath: string;
  bio: string;
  motto: string;
  role: string;
};

type BlogPost = {
  id: string;
  title: string;
};

function User() {
  const { id } = useParams();

  const [user, setUser] = useState<User | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [error, setError] = useState("");

  const fetchUser = async () => {
    try {
      const res = await getUser(Number(id));

      if (!res.ok) {
        setError(await res.text());
        return;
      }

      const data = await res.json();

      setUser(data);
      setBlogs(data.blogs || []);

    } catch (e) {
      console.error(e);
    }
  };

  const fetchFollowStatus = async () => {
    try {
      const res = await getFollowingStatus(Number(id));

      if (res.ok) {
        const data = await res.json();
        setIsFollowing(data.following);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleFollow = async () => {
    try {
      const res = await (isFollowing ? unfollow(Number(id)) : follow(Number(id)));

      if (!res.ok) {
        setError(await res.text());
        return;
      }

      setIsFollowing(!isFollowing);

    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchUser();
    fetchFollowStatus();
  }, [id]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>
        {user.firstName} {user.lastName}
      </h1>

      <p>{user.bio}</p>

      <p>
        <strong>Motto:</strong>
        {" "}
        {user.motto}
      </p>

      <button onClick={handleToggleFollow}>
        { isFollowing ? "Unfollow" : "Follow" }
      </button>

      <hr />

      <h2>Blogs</h2>

      <ul>
        {blogs.map((blog) => (
          <li key={blog.id}>
            {blog.title}
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

export default User;