import React, { useState } from "react";
import { supabase } from '../components/Auth/supabaseClient'; // Import Supabase client

const AddStudent = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  // Function to add student
  const handleAddStudent = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      // Step 1: Register student in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw authError;

      // Step 2: Insert student details into the "students" table
      const { error: dbError } = await supabase.from("students").insert([
        {
          id: authData.user.id, // Store the auth user ID
          name,
          email,
        },
      ]);

      if (dbError) throw dbError;

      setMessage("✅ Student added successfully!");
      setName("");
      setEmail("");
      setPassword("");
    } catch (error) {
      setMessage(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4">Add New Student</h2>
      {message && <p className="mb-4 text-center font-medium">{message}</p>}
      <form onSubmit={handleAddStudent} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Full Name</label>
          <input
            type="text"
            className="w-full p-2 border rounded-md"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            className="w-full p-2 border rounded-md"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Password</label>
          <input
            type="password"
            className="w-full p-2 border rounded-md"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md"
          disabled={loading}
        >
          {loading ? "Adding..." : "Add Student"}
        </button>
      </form>
    </div>
  );
};

export default AddStudent;
