import Svg from './git_hub.jsx'
const Navbar = () => {

  return (
    <nav className="bg-gray-900">
      <div className="max-w-6xl mx-auto px-0.5">
        <div className="flex justify-between items-center h-14">
          {/* Logo */}
          <div className="flex items-center justify-items-start">
            <h1 className='text-4xl text font-bold text-center text-blue-200'>
              <span className="text-green-500">
                &lt;</span>Pass
              <span className="text-green-500">
                OP/&gt;</span>
            </h1>
          </div>

          <div className="flex items-center justify-items-end ">

            <button className="bg-green-600 flex text-white  py-1 rounded-full hover:bg-green-700 transition-colors duration-200  hover:text-blue-200">
              <Svg/>
              <div className="m-auto text-lg font-semibold px-2" >GitHub</div>

            </button>
          </div>

        </div>


      </div>
    </nav>
  );
};

export default Navbar;