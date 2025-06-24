import React, { useState } from 'react';

const SignupModal = ({ onClose, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({ userName: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch("http://localhost:5000/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Signup failed");
      } else {
        localStorage.setItem("token", data.token);
        alert("Signup successful!");
        window.location.reload(); 
        onClose();
      }
    } catch (err) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
      <div className="bg-white rounded-xl p-6 shadow-lg w-96 relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-600 hover:text-red-500 text-xl">
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-4 text-center">Sign Up</h2>

        <form className="space-y-4" onSubmit={handleSignup}>
          <input type="text" name="userName" placeholder="Name" className="w-full p-2 border rounded" onChange={handleChange} required />
          <input type="email" name="email" placeholder="Email" className="w-full p-2 border rounded" onChange={handleChange} required />
          <input type="password" name="password" placeholder="Password" className="w-full p-2 border rounded" onChange={handleChange} required />
          <button type="submit" disabled={loading} className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded">
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}

        <p className="text-center text-sm mt-4">
          Already have an account?{' '}
          <span onClick={onSwitchToLogin} className="text-green-600 hover:underline cursor-pointer">Login</span>
        </p>
      </div>
    </div>
  );
};

export default SignupModal;

