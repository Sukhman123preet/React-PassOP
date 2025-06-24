import { useRef, useState, useEffect } from "react";
import toast, { Toaster } from 'react-hot-toast';

function Manager() {
  const ref = useRef();
  const pass_ref = useRef();
  const [form, SetForm] = useState({ website: "", username: "", password: "" });
  const [passwordArray, setPasswordArray] = useState([]);

  function validate_pass() {
    const urlRegex = /^(https?:\/\/)?([\w.-]+)\.([a-z]{2,})([\/\w.-]*)*\/?$/i;
    const usernameRegex = /^[a-zA-Z]+$/;
    const isWebsiteValid = urlRegex.test(form.website);
    const isUsernameValid = usernameRegex.test(form.username);
    const isPasswordValid = form.password.length >= 6;

    if (!isWebsiteValid) return "Please Enter Valid Url!";
    if (!isUsernameValid) return "Please only use letters (a-z or A-Z) in the username";
    if (!isPasswordValid) return "Password of length less than 6 not allowed!";
    return "OK";
  }

  useEffect(() => {
    const fetchPasswords = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${import.meta.env.VITE_SERVER_URI}/api/passwords`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error("Failed to fetch passwords");
        const data = await response.json();
        setPasswordArray(data);
      } catch (error) {
        console.error("Error fetching passwords:", error);
        toast.error("Session expired or unauthorized.");
      }
    };
    fetchPasswords();
  }, []);

  const savePassword = async (_id = '-1') => {
    try {
      const msg = validate_pass();
      if (msg !== "OK") throw new Error(msg);

      setPasswordArray(passwordArray.filter(item => item._id !== _id));

      const token = localStorage.getItem("token");
      const response = await fetch(`${import.meta.env.VITE_SERVER_URI}/api/save`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();
      if (!response.ok) {
        const message = response.status === 500 ? data.error : "Bad Request: Please check your API Request.";
        throw new Error(message);
      }

      toast.success("Password saved!");
      setPasswordArray((prev) => [...prev, { ...form, _id: data._id }]);
      SetForm({ website: "", username: "", password: "" });
    } catch (err) {
      toast.error(err.message);
    }
  };

  const showPassword = () => {
    const isPasswordVisible = pass_ref.current.type === "text";
    pass_ref.current.type = isPasswordVisible ? "password" : "text";
    ref.current.src = isPasswordVisible ? "icons/eyecross.png" : "icons/eye.png";
  };

  const deletePassword = async (_id) => {
    let c = confirm("Do you really want to delete this password?");
    if (!c) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${import.meta.env.VITE_SERVER_URI}/api/delete/${_id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setPasswordArray(passwordArray.filter(item => item._id !== _id));
        toast.success("Password Deleted successfully!");
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Delete failed.");
      }
    } catch (err) {
      toast.error("Error occurred while deleting!");
    }
  };

  const editPassword = (_id) => {
    SetForm(passwordArray.find(i => i._id === _id));
  };

  const handleChange = (e) => {
    SetForm({ ...form, [e.target.name]: e.target.value });
  };

  const showToast = (str) => {
    navigator.clipboard.writeText(str);
    toast.success("Copied to clipboard!");
  };

  const inputClass = 'rounded-full border border-green-500 w-full p-4 py-1 focus:shadow-md focus:shadow-green-500 outline-none';

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <div className="relative min-h-screen">
        <div className="absolute top-0 z-[-2] h-full w-full bg-[#000000] bg-[radial-gradient(#ffffff33_1px,#00091d_1px)] bg-[size:20px_20px]"></div>

        <div className='p-4 mx-4 bg-slate-950 rounded-md bg-opacity-50 flex items-center justify-center flex-col'>
          <div className="text-4xl font-bold text-center text-blue-200">
            <span className="text-green-500">&lt;</span>Pass<span className="text-green-500">OP/&gt;</span>
          </div>
          <div className="text-blue-200">Your own password manager</div>
        </div>

        <div className="flex flex-col gap-8 items-center px-2 lg:px-40 m-6 bg-slate-950 rounded-md bg-opacity-50">
          <input value={form.website} onChange={handleChange} placeholder='Enter website URL' className={inputClass} type="text" name="website" />
          <div className="flex flex-col md:flex-row w-full justify-between gap-8">
            <input onChange={handleChange} placeholder='Enter Username' value={form.username} className={inputClass} type="text" name="username" />
            <div className="relative w-full">
              <input onChange={handleChange} placeholder='Enter Password' value={form.password} className={inputClass} name="password" type="password" ref={pass_ref} />
              <span className='absolute right-1 top-1 cursor-pointer'>
                <img ref={ref} className='p-1' width={26} src="icons/eye.png" alt="eye" onClick={showPassword} />
              </span>
            </div>
          </div>

          <button className='flex justify-center items-center gap-2 bg-green-400 hover:bg-green-300 rounded-full px-8 py-2 w-fit border border-green-900' onClick={() => savePassword(form._id)}>
            <lord-icon src="https://cdn.lordicon.com/jgnvfzqg.json" trigger="hover" />
            Save
          </button>

          <div className="w-full">
            <h2 className="font-bold text-2xl py-4 text-white">Your Passwords</h2>
            {passwordArray.length === 0 ? (
              <div className="text-gray-400">No passwords to show</div>
            ) : (
              <table className="table-auto w-full rounded-md overflow-hidden mb-10">
                <thead className="bg-green-800 text-white">
                  <tr>
                    <th className="py-2">Site</th>
                    <th className="py-2">Username</th>
                    <th className="py-2">Password</th>
                    <th className="py-2">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-green-100 text-center">
                  {passwordArray.map((item, index) => (
                    <tr key={index} className="hover:bg-green-200">
                      <td className="py-2 border border-white">
                        <div className="flex items-center justify-center gap-2">
                          <a href={item.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline cursor-pointer">
                            {item.website}
                          </a>
                          <span className="cursor-pointer" onClick={() => showToast(item.website)}>
                            <lord-icon style={{ width: "25px", height: "25px", paddingTop: "3px", paddingLeft: "3px" }} src="https://cdn.lordicon.com/iykgtsbt.json" trigger="hover" />
                          </span>
                        </div>
                      </td>
                      <td className="py-2 border border-white">
                        <div className="flex items-center justify-center gap-2">
                          {item.username}
                          <span className="cursor-pointer" onClick={() => showToast(item.username)}>
                            <lord-icon style={{ width: "25px", height: "25px", paddingTop: "3px", paddingLeft: "3px" }} src="https://cdn.lordicon.com/iykgtsbt.json" trigger="hover" />
                          </span>
                        </div>
                      </td>
                      <td className="py-2 border border-white">
                        <div className="flex items-center justify-center gap-2">
                          {item.password}
                          <span className="cursor-pointer" onClick={() => showToast(item.password)}>
                            <lord-icon style={{ width: "25px", height: "25px", paddingTop: "3px", paddingLeft: "3px" }} src="https://cdn.lordicon.com/iykgtsbt.json" trigger="hover" />
                          </span>
                        </div>
                      </td>
                      <td className="py-2 border border-white flex justify-center gap-4">
                        <span className="cursor-pointer" onClick={() => editPassword(item._id)}>
                          <lord-icon src="https://cdn.lordicon.com/gwlusjdu.json" trigger="hover" style={{ width: "25px", height: "25px" }} />
                        </span>
                        <span className="cursor-pointer" onClick={() => deletePassword(item._id)}>
                          <lord-icon src="https://cdn.lordicon.com/skkahier.json" trigger="hover" style={{ width: "25px", height: "25px" }} />
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Manager;
