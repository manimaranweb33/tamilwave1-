"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type User = { id: string; email: string; name: string | null; role: string; createdAt: Date };

export function UsersManager({ users: initial }: { users: User[] }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("EDITOR");
  const [error, setError] = useState<string | null>(null);

  async function createUser(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const res = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name, role })
    });
    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Failed");
      return;
    }
    setEmail("");
    setPassword("");
    setName("");
    router.refresh();
  }

  return (
    <div>
      <form onSubmit={createUser} className="mb-8 grid max-w-md gap-3 rounded-xl border border-line p-4">
        <h2 className="font-black">Add user</h2>
        <input className="rounded-lg border border-line bg-panel px-3 py-2 text-sm" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" className="rounded-lg border border-line bg-panel px-3 py-2 text-sm" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <input className="rounded-lg border border-line bg-panel px-3 py-2 text-sm" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <select className="rounded-lg border border-line bg-panel px-3 py-2 text-sm" value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="EDITOR">Editor</option>
          <option value="VIEWER">Viewer</option>
          <option value="SUPER_ADMIN">Super Admin</option>
        </select>
        {error && <p className="text-xs text-red-400">{error}</p>}
        <button type="submit" className="rounded-lg bg-wave py-2 text-sm font-black text-black">Create</button>
      </form>
      <table className="w-full text-sm">
        <thead className="text-xs uppercase text-zinc-500">
          <tr>
            <th className="p-2 text-left">Email</th>
            <th className="p-2 text-left">Role</th>
          </tr>
        </thead>
        <tbody>
          {initial.map((u) => (
            <tr key={u.id} className="border-t border-line">
              <td className="p-2">{u.email}</td>
              <td className="p-2 text-zinc-500">{u.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
