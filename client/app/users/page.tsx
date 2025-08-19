"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore/lite";
import { db } from "../firebase";

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const usersCol = collection(db, "users");
        const snapshot = await getDocs(usersCol);
        const userList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setUsers(userList);
        console.log(snapshot)
      } catch (err) {
        console.error("Error fetching users:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, []);

  if (loading) return <div>Loading users...</div>;

  return (
    <div>
      <h1 className="text-xl font-bold">Users</h1>
      {users.length === 0 ? (
        <p>No users found</p>
      ) : (
        <ul className="list-disc pl-6">
          {users.map(user => (
            <li key={user.id}>{JSON.stringify(user)}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
