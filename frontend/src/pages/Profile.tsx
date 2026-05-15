import {useEffect, useState} from "react";
import {getMyBlogs} from "../api/blog.ts";
import { getUser, updateUser } from "../api/user.ts";
import { Link } from "react-router-dom";

type User = {
  id: string;
  firstName: string;
  lastName: string;
  profileImagePath: string;
  bio: string;
  motto: string;
  role: string;
};

type Comment = {
  id: string;
  authorId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

type BlogPost = {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  comments: Comment[];
  likes: string;
}

function Profile() {
  const [ blogs, setBlogs ] = useState<BlogPost[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    profileImagePath: "",
    bio: "",
    motto: "",
  });
  const [ error, setError ] = useState('');

  const fetchUser = async () => {
    try {
      const response = await getUser();

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

    } catch (error) {
      console.error(error);
    }
  };

  const fetchBlogs = async () => {
    try {
      const response = await getMyBlogs();
      if (!response.ok) {
        setError(await response.text());
      }
      const data = await response.json();
      setBlogs(data);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    }
  }

  const handleSave = async () => {
    try {
      const response = await updateUser(formData);

      if (!response.ok) {
        setError(await response.text());
        return;
      }

      setEditing(false);
      fetchUser();

    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchUser();
    fetchBlogs();
  }, []);

  return (
    <div>
      <h1>Profile</h1>
      <div style={{ marginBottom: "30px" }}>
        <h2>My Profile</h2>

        {user && (
          <>
            {editing ? (
              <div>
                <input
                  placeholder="First name"
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      firstName: e.target.value
                    })
                  }
                />

                <input
                  placeholder="Last name"
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      lastName: e.target.value
                    })
                  }
                />

                <input
                  placeholder="Profile image path"
                  value={formData.profileImagePath}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      profileImagePath: e.target.value
                    })
                  }
                />

                <textarea
                  placeholder="Bio"
                  value={formData.bio}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      bio: e.target.value
                    })
                  }
                />

                <input
                  placeholder="Motto"
                  value={formData.motto}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      motto: e.target.value
                    })
                  }
                />

                <br />

                <button onClick={handleSave}>
                  Save
                </button>

                <button onClick={() => setEditing(false)}>
                  Cancel
                </button>
              </div>
            ) : (
              <div>
                <p>
                  <strong>Name:</strong>
                  {" "}
                  {user.firstName} {user.lastName}
                </p>

                <p>
                  <strong>Role:</strong>
                  {" "}
                  {user.role}
                </p>

                <p>
                  <strong>Bio:</strong>
                  {" "}
                  {user.bio}
                </p>

                <p>
                  <strong>Motto:</strong>
                  {" "}
                  {user.motto}
                </p>

                <p>
                  <strong>Image:</strong>
                  {" "}
                  {user.profileImagePath}
                </p>

                <button onClick={() => setEditing(true)}>
                  Edit Profile
                </button>
              </div>
            )}
          </>
        )}
      </div>
      <ul>
        {blogs.map((blog: BlogPost) => (
          <li key={blog.id}>
            <Link to={`/blog/${blog.id}`}>
              <h2>{blog.title}</h2>
            </Link>
            <p>{blog.description}</p>
            <p>Created At: {new Date(blog.createdAt).toLocaleString()}</p>
            <ul>
              {blog.comments.map((comment: Comment) => (
                <li key={comment.id}>
                  <p>{comment.content}</p>
                  <p>Created At: {new Date(comment.createdAt).toLocaleString()}</p>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
      <div>
        {error && <p style={{color: 'red'}}>{error}</p>}
      </div>
    </div>
  )
}

export default Profile;