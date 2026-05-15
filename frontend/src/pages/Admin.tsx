import { useEffect, useState } from "react";
import {
  getUsers,
  blockUser,
  unblockUser
} from "../api/user.ts";

type User = {
  id: string;
  firstName: string;
  lastName: string;
  role: string;
  status: string;
};

type Page<T> = {
  content: T[];
  number: number;
  totalPages: number;
  totalElements: number;
  size: number;
};

function Admin() {
  const [ users, setUsers ] = useState<User[]>([]);
  const [ page, setPage ] = useState(0);
  const [ totalPages, setTotalPages ] = useState(0);
  const [ size, setSize ] = useState(2);

  const fetchUsers = async () => {
    const response = await getUsers(page, size);
    const data: Page<User> = await response.json();

    setUsers(data.content);
    setTotalPages(data.totalPages);
  };

  useEffect(() => {
    fetchUsers();
  }, [page, size]);

  const handleToggleBlock = async (user: User) => {
    if (user.status === "BLOCKED") {
      await unblockUser(Number(user.id));
    } else {
      await blockUser(Number(user.id));
    }

    fetchUsers();
  };

  return (
    <div>
      <h1>Admin</h1>
      <p>Welcome to the admin panel.</p>
      <div>
        <h2>Users</h2>
        <ul>
          {users.map((user: User) => (
            <li key={user.id}>
              {user.firstName} {user.lastName}
              {" - "}
              {user.role}
              {" - "}
              {user.status}

              <button
                style={{ marginLeft: "10px" }}
                onClick={() => handleToggleBlock(user)}
              >
                {user.status === "BLOCKED"
                  ? "Unblock"
                  : "Block"}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <button disabled={page === 0} onClick={() => setPage(page - 1)}>
          Previous
        </button>
        <span> Page {page + 1} of {totalPages} </span>
        <button disabled={page + 1 >= totalPages} onClick={() => setPage(page + 1)}>
          Next
        </button>
        <button
          disabled={size <= 1}
          onClick={
            () => {
              setSize(size - 1);
              setPage(0);
            }
          }
        >
          Size--
        </button>
        <span> Size {size} </span>
        <button
          onClick={
            () => {
              setSize(size + 1);
              setPage(0);
            }
          }
        >
          Size++
        </button>
      </div>
    </div>
  );
}

export default Admin;