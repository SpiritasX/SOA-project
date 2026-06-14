import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { follow, getFollowingStatus, unfollow } from "../api/follower.ts";
import { getUser } from "../api/user";

type User = {
  id: string;
  firstName: string;
  lastName: string;
  profileImagePath: string | null;
  bio: string | null;
  motto: string | null;
  role: string;
};

type BlogPost = {
  id: string;
  title: string;
};

function initials(user: User) {
  return `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}` || "TL";
}

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
    } catch (err) {
      console.error(err);
      setError("Failed to load user.");
    }
  };

  const fetchFollowStatus = async () => {
    try {
      const res = await getFollowingStatus(Number(id));

      if (res.ok) {
        const data = await res.json();
        setIsFollowing(data.following);
      }
    } catch (err) {
      console.error(err);
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
    } catch (err) {
      console.error(err);
      setError("Failed to update follow status.");
    }
  };

  useEffect(() => {
    fetchUser();
    fetchFollowStatus();
  }, [id]);

  if (!user) {
    return (
      <div className="state-page">
        <div className="state-card">
          <p className="eyebrow">Loading</p>
          <h1>Loading user</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="page-narrow">
      <header className="profile-hero">
        <div className="avatar">
          {user.profileImagePath ? (
            <img src={user.profileImagePath} alt={`${user.firstName} ${user.lastName}`} />
          ) : (
            initials(user)
          )}
        </div>
        <div className="page-title">
          <p className="eyebrow">{user.role}</p>
          <h1>
            {user.firstName} {user.lastName}
          </h1>
          <p className="subtitle">{user.motto || "No motto set."}</p>
          {user.bio && <p>{user.bio}</p>}
        </div>
        <button className="btn btn-primary" onClick={handleToggleFollow}>
          {isFollowing ? "Unfollow" : "Follow"}
        </button>
      </header>

      {error && <div className="alert alert-error">{error}</div>}

      <section>
        <div className="section-header">
          <div className="section-title">
            <h2>Blogs</h2>
            <p className="muted">{blogs.length} posts</p>
          </div>
        </div>

        {blogs.length === 0 ? (
          <div className="empty-state">
            <h3>No public blogs</h3>
          </div>
        ) : (
          <div className="list-stack">
            {blogs.map((blog) => (
              <Link className="compact-card click-card" key={blog.id} to={`/blog/${blog.id}`}>
                <h3>{blog.title}</h3>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default User;
