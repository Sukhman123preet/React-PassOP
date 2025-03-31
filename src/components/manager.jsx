import { useRef, useState, useEffect } from "react";
import toast, { Toaster } from 'react-hot-toast';

function Manager() {
 
  const ref = useRef();
  const pass_ref = useRef()
  const [form, SetForm] = useState({ website: "", username: "", password: "" });
  const [passwordArray, setPasswordArray] = useState([]);

  function validate_pass() {
    const urlRegex = /^(https?:\/\/)?([\w.-]+)\.([a-z]{2,})([\/\w.-]*)*\/?$/i;
    const usernameRegex = /^[a-zA-Z]+$/;
    const isWebsiteValid = urlRegex.test(form.website);
    const isUsernameValid = usernameRegex.test(form.username);
    const isPasswordValid = form.password.length >= 6;

    if (!isWebsiteValid) {
      return "Please Enter Valid Url!";
    }
    else if (!isUsernameValid) {
      return "Please only use letters (a-z or A-Z) in the username ";
    }
    else if (!isPasswordValid) {
      return "Passwoord of length less than 6 not allowed !";
    }
    else {
      return "OK";
    }
  }

  useEffect(() => {
    const fetchPasswords = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_SERVER_URI}/api/passwords`);
        if (!response.ok) {
          throw new Error("Failed to fetch passwords");
        }
        const data = await response.json();
        console.log(data);
        setPasswordArray(data);
      } catch (error) {
        console.error("Error fetching passwords:", error);
      }
    };
    fetchPasswords();
  }, []);

  const savePassword = async (_id = '-1') => {
    try {
      const msg = validate_pass();
      if (msg != "OK") {
        throw new Error(msg);
      }
      setPasswordArray(passwordArray.filter(item => item._id !== _id));
      const response = await fetch(`${import.meta.env.VITE_SERVER_URI}/api/save`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      })
      const data = await response.json();
      if (!response.ok) {
        const message = response.status === 500 ? data.error : "Bad Request: Please check your API Request.";
        throw new Error(message);
      }
      else {
        toast.success("Password saved!");
        setPasswordArray((prev) => [...prev, { ...form, _id: data._id }]);
        SetForm({ website: "", username: "", password: "" });

      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  const showPassword = () => {
    if (ref.current.src.includes("icons/eye.png")) {
      pass_ref.current.type = "password";
      ref.current.src = "icons/eyecross.png";
    }
    else {
      pass_ref.current.type = "text";
      ref.current.src = "icons/eye.png";
    }
  }

  const deletePassword = async (_id) => {
    console.log("Deleting password with id ", _id);
    let c = confirm("Do you really want to delete this password?");
    if (c) {
      try {
        // Send DELETE request to the backend
        const response = await fetch(`${import.meta.env.VITE_SERVER_URI}/api/delete/${_id}`, {
          method: "DELETE",
        })
        if (response.ok) {
          setPasswordArray(passwordArray.filter(item => item._id !== _id));
          toast.success("Password Deleted successfully!");
        } else {
          console.error("Failed to delete password:", errorData.error);
        }
      } catch (err) {
        toast.error("Error occured while Deleting!");
      }
    }
  };

  const editPassword = (_id) => {
    console.log("Editing password with id ", _id);
    SetForm(passwordArray.filter(i => i._id === _id)[0]);
  }
  const handleChange = (e) => {
    SetForm({ ...form, [e.target.name]: e.target.value });
  }
  const showToast = (str) => {
    let ope = "Copied to clipboard !";
    navigator.clipboard.writeText(str);
    toast.success(ope);
  }
  const inputClass = 'rounded-full border border-green-500 w-full p-4 py-1  focus:shadow-md focus:shadow-green-500  outline-none'
  return (
    <><Toaster
      position="top-right"
      reverseOrder={false}
    />
      <div className="relative min-h-screen ">
        <div className="absolute top-0 z-[-2] h-full w-full bg-[#000000] bg-[radial-gradient(#ffffff33_1px,#00091d_1px)] bg-[size:20px_20px]"></div>

        <div className=' p-4 mx-4 bg-slate-950 rounded-md bg-opacity-50 flex items-center justify-center flex-col'>
          <div className="text-4xl text font-bold text-center text-blue-200">
            <span className="text-green-500">
              &lt;</span>Pass
            <span className="text-green-500">
              OP/&gt;</span>
          </div>
          <div className="text-blue-200">Your own password manager</div>
        </div>
        <div className="flex flex-col gap-8 items-center px-2 lg:px-40 m-6 bg-slate-950 rounded-md bg-opacity-50 ">
          <input value={form.website} onChange={handleChange} placeholder='Enter website URL' className={inputClass} type="text" name="website" id="website" />
          <div className="flex flex-col md:flex-row w-full justify-between gap-8">
            <div className="flex-1">
              <input onChange={handleChange} placeholder='Enter Username' value={form.username} className={inputClass} type="text" name="username" id="username" />
            </div>
            <div className="flex-1 relative">
              <input onChange={handleChange} placeholder='Enter Password' value={form.password} className={inputClass} name="password" id="password" type="text" ref={pass_ref} />
              <span className='absolute right-1 top-1 cursor-pointer'>
                <img ref={ref} className='p-1' width={26} src="icons/eye.png" alt="eye" onClick={showPassword} />
              </span>
            </div>
          </div>
          <button className='flex justify-center items-center gap-2 bg-green-400 hover:bg-green-300 rounded-full px-8 py-2 w-fit border border-green-900' onClick={() => savePassword(form._id)}>
            <lord-icon
              src="https://cdn.lordicon.com/jgnvfzqg.json"
              trigger="hover" >
            </lord-icon>
            Save</button>

          <div className="w-full ">
            <h2 className="font-bold text-2xl py-4 text-white">Your Passwords</h2>
            {passwordArray.length === 0 && <div className="text-gray-400">No passwords to show</div>}
            {passwordArray.length !== 0 && (
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
                          <div
                            className="lordiconcopy size-7 cursor-pointer"
                            onClick={() => {
                              showToast(item.website);
                            }}
                          >
                            <lord-icon
                              style={{ width: "25px", height: "25px", paddingTop: "3px", paddingLeft: "3px" }}
                              src="https://cdn.lordicon.com/iykgtsbt.json"
                              trigger="hover"
                            ></lord-icon>
                          </div>
                        </div>
                      </td>
                      <td className="py-2 border border-white">
                        <div className="flex items-center justify-center gap-2">
                          <span>{item.username}</span>
                          <div
                            className="lordiconcopy size-7 cursor-pointer"
                            onClick={() => {
                              showToast(item.username);
                            }}
                          >
                            <lord-icon
                              style={{ width: "25px", height: "25px", paddingTop: "3px", paddingLeft: "3px" }}
                              src="https://cdn.lordicon.com/iykgtsbt.json"
                              trigger="hover"
                            ></lord-icon>
                          </div>
                        </div>
                      </td>
                      <td className="py-2 border border-white">
                        <div className="flex items-center justify-center gap-2">
                          <span>{item.password}</span>
                          <div
                            className="lordiconcopy size-7 cursor-pointer"
                            onClick={() => {
                              showToast(item.password);
                            }}
                          >
                            <lord-icon
                              style={{ width: "25px", height: "25px", paddingTop: "3px", paddingLeft: "3px" }}
                              src="https://cdn.lordicon.com/iykgtsbt.json"
                              trigger="hover"
                            ></lord-icon>
                          </div>
                        </div>
                      </td>
                      <td className="py-2 border border-white flex justify-center gap-4">
                        <span className="cursor-pointer" onClick={() => editPassword(item._id)}>
                          <lord-icon
                            src="https://cdn.lordicon.com/gwlusjdu.json"
                            trigger="hover"
                            style={{ width: "25px", height: "25px" }}
                          ></lord-icon>
                        </span>
                        <span className="cursor-pointer" onClick={() => deletePassword(item._id)}>
                          <lord-icon
                            src="https://cdn.lordicon.com/skkahier.json"
                            trigger="hover"
                            style={{ width: "25px", height: "25px" }}
                          ></lord-icon>
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
  )
}
export default Manager


