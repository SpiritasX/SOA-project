import {useEffect, useState} from "react";
import {getMyBlogs} from "../api/blog.ts";

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
  const [ error, setError ] = useState('');

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

  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <div>
      <h1>Profile</h1>
      <ul>
        {blogs.map((blog: BlogPost) => (
          <li key={blog.id}>
            <h2>{blog.title}</h2>
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