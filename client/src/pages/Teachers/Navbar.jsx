import { Link } from "react-router-dom";
import { Users } from "lucide-react";

const Navbar = ({ activeView, setActiveView }) => {
  return (
    <nav className="sticky top-0 z-50 bg-[#1E1E1E]/80 backdrop-blur-md shadow-lg rounded-lg border-b-2 border-purple-800 mb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center py-4">
          <div className="mb-4 md:mb-0">
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Creative Coding Showcase Platform
            </h1>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-3">
            <button
              className={`px-4 py-2 rounded transition-colors ${
                activeView === "projects"
                  ? "bg-purple-600"
                  : "bg-purple-800 hover:bg-purple-700"
              }`}
              onClick={() => setActiveView("projects")}
            >
              Projects
            </button>
            <button
              className={`px-4 py-2 rounded transition-colors ${
                activeView === "students"
                  ? "bg-purple-600"
                  : "bg-purple-800 hover:bg-purple-700"
              }`}
              onClick={() => setActiveView("students")}
            >
              Students
            </button>
            <Link to="/leaderboard">
              <button className="bg-purple-800 hover:bg-purple-700 px-4 py-2 rounded transition-colors">
                Leader Board
              </button>
            </Link>
            <Link to="/students">
              <button className="bg-purple-800 hover:bg-purple-700 px-4 py-2 rounded transition-colors">
                Students Page
              </button>
            </Link>
            <div className="bg-purple-700 p-2 rounded-full cursor-pointer hover:bg-purple-600 transition-colors">
              <Users size={20} />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
