import { useEffect, useState } from "react";
import { blockUser, getUsers, unblockUser } from "../api/user.ts";

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

function statusClass(status: string) {
  return `status-pill status-${status.toLowerCase()}`;
}

function Admin() {
  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [size, setSize] = useState(2);
  const [totalElements, setTotalElements] = useState(0);
  const [error, setError] = useState("");

  const fetchUsers = async () => {
    setError("");
    const response = await getUsers(page, size);

    if (!response.ok) {
      setError(await response.text());
      return;
    }

    const data: Page<User> = await response.json();
    setUsers(data.content);
    setTotalPages(data.totalPages);
    setTotalElements(data.totalElements);
  };

  useEffect(() => {
    fetchUsers();
  }, [page, size]);

  const handleToggleBlock = async (user: User) => {
    setError("");
    const response =
      user.status === "BLOCKED"
        ? await unblockUser(Number(user.id))
        : await blockUser(Number(user.id));

    if (!response.ok) {
      setError(await response.text());
      return;
    }

    fetchUsers();
  };

  return (
    <div className="page">
      <header className="page-header">
        <div className="page-title">
          <p className="eyebrow">Administration</p>
          <h1>User Management</h1>
          <p className="subtitle">
            Review platform accounts and block or unblock access.
          </p>
        </div>
        <div className="toolbar">
          <span className="badge">{totalElements} users</span>
          <span className="badge badge-green">Page {page + 1}</span>
        </div>
      </header>

      {error && <div className="alert alert-error">{error}</div>}

      <section className="table-panel">
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Role</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>
                  {user.firstName} {user.lastName}
                </td>
                <td>{user.role}</td>
                <td>
                  <span className={statusClass(user.status)}>{user.status}</span>
                </td>
                <td>
                  <button
                    className={
                      user.status === "BLOCKED"
                        ? "btn btn-outline btn-small"
                        : "btn btn-danger btn-small"
                    }
                    onClick={() => handleToggleBlock(user)}
                  >
                    {user.status === "BLOCKED" ? "Unblock" : "Block"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <div className="toolbar">
        <button
          className="btn btn-outline"
          disabled={page === 0}
          onClick={() => setPage(page - 1)}
        >
          Previous
        </button>
        <span className="role-pill">
          Page {page + 1} of {totalPages || 1}
        </span>
        <button
          className="btn btn-outline"
          disabled={page + 1 >= totalPages}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
        <button
          className="btn btn-ghost"
          disabled={size <= 1}
          onClick={() => {
            setSize(size - 1);
            setPage(0);
          }}
        >
          Size -
        </button>
        <span className="role-pill">Size {size}</span>
        <button
          className="btn btn-ghost"
          onClick={() => {
            setSize(size + 1);
            setPage(0);
          }}
        >
          Size +
        </button>
      </div>
    </div>
  );
}

export default Admin;
