import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", {
        username: Number(username),
        name,
        email,
        password,
        role,
      });
      localStorage.setItem("token", res.data.token);
      navigate("/");
    } catch (err) {
      setError("Error registering user");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white shadow-lg p-6 rounded-lg">
        <h2 className="text-2xl font-bold text-center">Register</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <form onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Name"
            className="w-full p-2 border rounded my-2"
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full p-2 border rounded my-2"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="number" // Ensure input is numeric
            placeholder="Username"
            className="w-full p-2 border rounded my-2"
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-2 border rounded my-2"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <select
            className="w-full p-2 border rounded my-2"
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
          </select>
          <button className="w-full bg-blue-500 text-white p-2 rounded mt-2">
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
