
import SignupModal from './SignupModal.jsx';
import LoginModal from './LoginModal.jsx';
import { useEffect, useState } from "react";

const Navbar = () => {
  const [showSignup, setShowSignup] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await fetch(`${import.meta.env.VITE_SERVER_URI}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          setAuthenticated(true);
        } else {
          localStorage.removeItem("token");
          setAuthenticated(false);
        }
      } catch (err) {
        setAuthenticated(false);
      }
    };

    verifyToken();
  }, []);

  return (
    <>
      {/* Modals */}
      {showSignup && (
        <SignupModal
          onClose={() => setShowSignup(false)}
          onSwitchToLogin={() => {
            setShowSignup(false);
            setShowLogin(true);
          }}
        />
      )}

      {showLogin && (
        <LoginModal
          onClose={() => setShowLogin(false)}
          onSwitchToSignup={() => {
            setShowLogin(false);
            setShowSignup(true);
          }}
        />
      )}

      <nav className={`bg-gray-900 ${showSignup || showLogin ? 'backdrop-blur-sm' : ''}`}>
        <div className="max-w-6xl mx-auto px-0.5">
          <div className="flex justify-between items-center h-14">
            {/* Logo */}
            <div className="flex items-center justify-items-start">
              <h1 className="text-4xl font-bold text-blue-200">
                <span className="text-green-500">&lt;</span>Pass
                <span className="text-green-500">OP/&gt;</span>
              </h1>
            </div>

            {/* Buttons */}
            <div className="flex items-center">
              {authenticated ? (<button
                onClick={() => setShowSignup(true)}
                className="flex items-center justify-center gap-2 px-4 py-2 m-2 bg-gradient-to-r from-green-700 to-teal-500 text-white font-semibold rounded-full shadow-md hover:from-green-600 hover:to-teal-600 hover:shadow-lg hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50"
              >
                <img
                  width="24"
                  height="24"
                  src="https://img.icons8.com/external-royyan-wijaya-detailed-outline-royyan-wijaya/24/external-user-interface-royyan-wijaya-detailed-outline-royyan-wijaya-2.png"
                  alt="signup"
                />

                <div className="text-lg font-semibold px-2">Logout</div>



              </button>
              ) : (
                <button
                  onClick={() => setShowSignup(true)}
                  className="flex items-center justify-center gap-2 px-2 py-1  bg-gradient-to-r from-green-700 to-teal-500 text-white font-semibold rounded-full shadow-md hover:from-green-600 hover:to-teal-600 hover:shadow-lg hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50"
                >
                  <img
                    width="20"
                    height="20"
                    src="https://img.icons8.com/external-royyan-wijaya-detailed-outline-royyan-wijaya/24/external-user-interface-royyan-wijaya-detailed-outline-royyan-wijaya-2.png"
                    alt="signup"
                  />

                  <div className="text-lg font-semibold ">SignUp</div>

                </button>
              )}
              
                
                
              
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
