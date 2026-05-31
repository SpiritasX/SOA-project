import {useEffect, useState} from "react";
import { getMyBlogs } from "../api/blog.ts";
import { getMyTours } from "../api/tour.ts";
import { getMyPurchases } from "../api/purchase.ts";
import { getMe, updateUser, getRecommendations } from "../api/user.ts";
import { Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

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

type Blog = {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  comments: Comment[];
  likes: string;
}

type Tour = {
  id: number;
  name: string;
  description: string;
  tags: string[];
  price: number;
  difficulty: string;
  status: string;
  // authorId: number;
  firstTourLocationId: number;
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
  const [ error, setError ] = useState('');

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

    } catch (error) {
      console.error(error);
    }
  };

  const fetchBlogs = async () => {
    try {
      const response = await getMyBlogs();
      if (!response.ok) {
        setError(await response.text());
        return;
      }
      const data = await response.json();
      setBlogs(data);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    }
  }

  const fetchTours = async () => {
    try {
      const response = await getMyTours();
      if (!response.ok) {
        setError(await response.text());
        return;
      }
      const data = await response.json();
      setTours(data);
    } catch (error) {
      console.error('Error fetching tours:', error);
    }
  }

  const fetchPurchases = async () => {
    try {
      const response = await getMyPurchases();
      if (response.ok) {
        const data = await response.json();
        setPurchases(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchRecommendations = async () => {
    try {
      const response = await getRecommendations();
      if (!response.ok) {
        setError(await response.text());
        return;
      }
      const data = await response.json();
      setRecommendations(data);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    }
  };

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
  }, []);

  useEffect(() => {
    if (!user) return;

    if (user.role === 'GUIDE')
      fetchTours();

    if (user.role === 'TOURIST')
      fetchPurchases();

    fetchBlogs();
    fetchRecommendations();
  }, [user]);

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
      <div style={{ marginTop: "30px" }}>
        <h2>Recommended for You</h2>
        {recommendations.length > 0 ? (
          <ul>
            {recommendations.map((rec) => (
              <li key={rec.id}>
                <Link to={`/user/${rec.id}`}>
                  {rec.firstName} {rec.lastName}
                </Link>
                {rec.motto && <span> - {rec.motto}</span>}
              </li>
            ))}
          </ul>
        ) : (
          <p>No recommendations at the moment.</p>
        )}
      </div>

      <div style={{ marginTop: "30px" }}>
        <h2>My Blogs</h2>
        <ul>
          {blogs.map((blog: Blog) => (
            <li key={blog.id}>
              <Link to={`/blog/${blog.id}`}>
                <h2>{blog.title}</h2>
              </Link>
              <div>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {blog.description}
                </ReactMarkdown>
              </div>
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
      </div>
      {user && user.role === 'TOURIST' && (
        <div style={{ marginTop: '30px' }}>
          <h2>Purchased Tours</h2>
          {purchases.length === 0 ? (
            <p>You haven't purchased any tours yet.</p>
          ) : (
            <ul>
              {purchases.map((order: any) => (
                <li key={order.id} style={{ marginBottom: "20px", borderBottom: "1px solid #eee", paddingBottom: "10px" }}>
                  <p><strong>Order ID:</strong> {order.id}</p>
                  <p><strong>Total Price:</strong> ${order.totalPrice}</p>
                  <ul>
                    {order.tours.map((tour: any) => (
                      <li key={tour.id}>
                        <Link to={`/tour/${tour.id}`}>
                          {tour.name} - ${tour.price}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
      {user && user.role === 'GUIDE' && (
        <div style={{ marginTop: '30px' }}>
          <h2>Draft Tours</h2>
          <ul>
            {tours
              .filter((tour: Tour) => tour.status === 'DRAFT')
              .map((tour: Tour) => (
                <li key={tour.id}>
                  <Link to={`/tour/${tour.id}`}>
                    <h3>{tour.name}</h3>
                  </Link>
                  <p>{tour.description}</p>
                  <p>Tags: {tour.tags.join(', ')}</p>
                  <p>Price: {tour.price}</p>
                  <p>Difficulty: {tour.difficulty}</p>
                </li>
              ))}
          </ul>

          <h2>Published Tours</h2>
          <ul>
            {tours
              .filter((tour: Tour) => tour.status === 'PUBLISHED')
              .map((tour: Tour) => (
                <li key={tour.id}>
                  <Link to={`/tour/${tour.id}`}>
                    <h3>{tour.name}</h3>
                  </Link>
                  <p>{tour.description}</p>
                  <p>Tags: {tour.tags.join(', ')}</p>
                  <p>Price: {tour.price}</p>
                  <p>Difficulty: {tour.difficulty}</p>
                </li>
              ))}
          </ul>

          <h2>Archived Tours</h2>
          <ul>
            {tours
              .filter((tour: Tour) => tour.status === 'ARCHIVED')
              .map((tour: Tour) => (
                <li key={tour.id}>
                  <Link to={`/tour/${tour.id}`}>
                    <h3>{tour.name}</h3>
                  </Link>
                  <p>{tour.description}</p>
                  <p>Tags: {tour.tags.join(', ')}</p>
                  <p>Price: {tour.price}</p>
                  <p>Difficulty: {tour.difficulty}</p>
                </li>
              ))}
          </ul>
        </div>
      )}
      <div>
        {error && <p style={{color: 'red'}}>{error}</p>}
      </div>
    </div>
  )
}

export default Profile;