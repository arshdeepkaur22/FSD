import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Trophy, Medal, Users, Search, Star, Filter, ChevronDown, ArrowUpDown } from 'lucide-react';

// Helper function for className conditionals
const cn = (...classes) => {
  return classes.filter(Boolean).join(' ');
};

// Inline Navbar component
const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 bg-[#1E1E1E]/80 backdrop-blur-md shadow-lg rounded-lg border-b-2 border-purple-800 mb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center py-4">
          <div className="mb-4 md:mb-0">
            <h1 className="text-2xl font-bold tracking-tight text-purple-400">ProjectHub</h1>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-3">
            <Link to="/">
              <button className="bg-purple-800 hover:bg-purple-700 px-4 py-2 rounded transition-colors">
                Projects
              </button>
            </Link>
            <Link to="/students">
              <button className="bg-purple-800 hover:bg-purple-700 px-4 py-2 rounded transition-colors">
                Students
              </button>
            </Link>
            <button className="bg-purple-600 px-4 py-2 rounded transition-colors">
              Leader Board
            </button>
            <div className="bg-purple-700 p-2 rounded-full cursor-pointer hover:bg-purple-600 transition-colors">
              <Users size={20} />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

// Mock data for leaderboard
const leaderboardData = [
  {
    id: 1,
    teamName: 'Digital Dreamweavers',
    projectTitle: 'Climate Change Visualization',
    sdg: 'Climate Action',
    rating: 4.9,
    points: 95,
    teamMembers: ['Alice Johnson', 'Bob Smith', 'Charlie Brown'],
    projectImage: 'https://via.placeholder.com/150/300a72/ffffff?text=Project',
  },
  {
    id: 2,
    teamName: 'Code Crafters',
    projectTitle: 'Clean Water Access Tracker',
    sdg: 'Clean Water',
    rating: 4.8,
    points: 92,
    teamMembers: ['David Wilson', 'Emma Davis', 'Fred Taylor'],
    projectImage: 'https://via.placeholder.com/150/5f2993/ffffff?text=Project',
  },
  {
    id: 3,
    teamName: 'Algo Innovators',
    projectTitle: 'Renewable Energy Dashboard',
    sdg: 'Clean Energy',
    rating: 4.7,
    points: 89,
    teamMembers: ['Gina Martin', 'Harry Johnson', 'Irene Smith'],
    projectImage: 'https://via.placeholder.com/150/8b5cf6/ffffff?text=Project',
  },
  {
    id: 4,
    teamName: 'Tech Trailblazers',
    projectTitle: 'Zero Hunger Initiative',
    sdg: 'Zero Hunger',
    rating: 4.6,
    points: 85,
    teamMembers: ['Jack Robinson', 'Kelly Adams', 'Liam Parker'],
    projectImage: 'https://via.placeholder.com/150/4c1d95/ffffff?text=Project',
  },
  {
    id: 5,
    teamName: 'Digital Solutions',
    projectTitle: 'Education Access Platform',
    sdg: 'Quality Education',
    rating: 4.5,
    points: 82,
    teamMembers: ['Mike Thompson', 'Nancy Reed', 'Olivia Wilson'],
    projectImage: 'https://via.placeholder.com/150/7e22ce/ffffff?text=Project',
  },
  {
    id: 6,
    teamName: 'Python Pioneers',
    projectTitle: 'Gender Equality Analytics',
    sdg: 'Gender Equality',
    rating: 4.3,
    points: 78,
    teamMembers: ['Peter Wright', 'Quinn Evans', 'Rachel Lee'],
    projectImage: 'https://via.placeholder.com/150/6b21a8/ffffff?text=Project',
  },
  {
    id: 7,
    teamName: 'AI Architects',
    projectTitle: 'Decent Work Analyzer',
    sdg: 'Decent Work',
    rating: 4.2,
    points: 75,
    teamMembers: ['Steve Clark', 'Tina Martinez', 'Umar Khan'],
    projectImage: 'https://via.placeholder.com/150/581c87/ffffff?text=Project',
  },
  {
    id: 8,
    teamName: 'Web Wizards',
    projectTitle: 'Industry Innovation Platform',
    sdg: 'Industry Innovation',
    rating: 4.1,
    points: 72,
    teamMembers: ['Victor Barnes', 'Wendy Moore', 'Xavier Johnson'],
    projectImage: 'https://via.placeholder.com/150/3b0764/ffffff?text=Project',
  }
];

const SDG_OPTIONS = [
  'No Poverty', 'Zero Hunger', 'Good Health', 
  'Quality Education', 'Gender Equality', 
  'Clean Water', 'Clean Energy', 'Decent Work',
  'Industry Innovation', 'Reduced Inequalities', 
  'Sustainable Cities', 'Responsible Consumption', 
  'Climate Action', 'Life Below Water', 
  'Life on Land', 'Peace and Justice', 
  'Partnerships'
];

const Leaderboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sdgFilter, setSdgFilter] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'points', direction: 'desc' });
  const [filteredTeams, setFilteredTeams] = useState(leaderboardData);

  // Apply filters and sorting when relevant states change
  useEffect(() => {
    let filtered = leaderboardData;
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(team => 
        team.teamName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        team.projectTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        team.teamMembers.some(member => member.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Apply SDG filter
    if (sdgFilter) {
      filtered = filtered.filter(team => team.sdg === sdgFilter);
    }
    
    // Apply sorting
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    
    setFilteredTeams(filtered);
  }, [searchTerm, sdgFilter, sortConfig]);

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSdgFilter('');
    setSortConfig({ key: 'points', direction: 'desc' });
  };

  const getLeaderIcon = (index) => {
    if (index === 0) return <Trophy size={24} className="text-yellow-400" />;
    if (index === 1) return <Medal size={24} className="text-gray-400" />;
    if (index === 2) return <Medal size={24} className="text-amber-700" />;
    return <span className="text-lg font-bold">{index + 1}</span>;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0F0F] to-[#1A1A2E] text-white">
      {/* Navbar */}
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-purple-300">Project Leaderboard</h1>
          <Link
            to="/"
            className="flex items-center text-purple-400 hover:text-purple-300 transition"
          >
            <ArrowLeft className="mr-2" size={20} />
            <span>Back to Projects</span>
          </Link>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-black bg-opacity-60 p-4 rounded-lg mb-6 border border-purple-800">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-3 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Search teams or projects..." 
                className="w-full bg-gray-900 border border-purple-900 rounded-md py-2 pl-10 pr-4 text-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <select 
                className="bg-gray-900 border border-purple-900 rounded-md py-2 px-4 text-white"
                value={sdgFilter}
                onChange={(e) => setSdgFilter(e.target.value)}
              >
                <option value="">All SDGs</option>
                {SDG_OPTIONS.map(sdg => (
                  <option key={sdg} value={sdg}>{sdg}</option>
                ))}
              </select>
              <button 
                onClick={resetFilters}
                className="bg-purple-900 hover:bg-purple-800 rounded-md p-2"
                title="Reset filters"
              >
                <ArrowUpDown size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Leaderboard Table */}
        <div className="bg-black bg-opacity-60 rounded-lg border border-purple-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-purple-900">
                <tr>
                  <th className="px-4 py-3 text-left">#</th>
                  <th className="px-4 py-3 text-left">Team</th>
                  <th className="px-4 py-3 text-left">Project</th>
                  <th className="px-4 py-3 text-left">SDG</th>
                  <th className="px-4 py-3 text-center cursor-pointer" onClick={() => requestSort('rating')}>
                    <div className="flex items-center justify-center">
                      Rating
                      <ChevronDown 
                        size={16} 
                        className={cn(
                          "ml-1 transition-transform", 
                          sortConfig.key === 'rating' && sortConfig.direction === 'asc' && "transform rotate-180"
                        )}
                      />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-center cursor-pointer" onClick={() => requestSort('points')}>
                    <div className="flex items-center justify-center">
                      Points
                      <ChevronDown 
                        size={16} 
                        className={cn(
                          "ml-1 transition-transform", 
                          sortConfig.key === 'points' && sortConfig.direction === 'asc' && "transform rotate-180"
                        )}
                      />
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredTeams.map((team, index) => (
                  <tr 
                    key={team.id} 
                    className={cn(
                      "border-b border-purple-900/30 hover:bg-purple-900/20 transition-colors",
                      index < 3 && "bg-purple-900/10"
                    )}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-900/30">
                        {getLeaderIcon(index)}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full overflow-hidden mr-3 bg-purple-800">
                          <img 
                            src={team.projectImage} 
                            alt={team.teamName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="font-medium">{team.teamName}</div>
                          <div className="text-sm text-gray-400">{team.teamMembers.join(', ')}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-medium">{team.projectTitle}</td>
                    <td className="px-4 py-3">
                      <span className="bg-purple-800 text-xs px-2 py-1 rounded">
                        {team.sdg}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center">
                        <span>{team.rating}</span>
                        <Star size={16} className="text-yellow-400 ml-1" />
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="font-bold text-lg text-purple-300">{team.points}</div>
                    </td>
                  </tr>
                ))}
                {filteredTeams.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                      No teams match your search criteria
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-6 bg-black bg-opacity-60 p-4 rounded-lg border border-purple-800">
          <h3 className="text-lg font-semibold mb-3 text-purple-300">Scoring System</h3>
          <ul className="text-sm text-gray-300 space-y-2">
            <li className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-purple-500 mr-2"></div>
              <span>Projects are scored based on ratings, feedback from faculty, and SDG alignment</span>
            </li>
            <li className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-purple-500 mr-2"></div>
              <span>Ratings contribute 60% of the total score</span>
            </li>
            <li className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-purple-500 mr-2"></div>
              <span>Additional points are awarded for innovation and technical implementation</span>
            </li>
            <li className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-purple-500 mr-2"></div>
              <span>Rankings are updated weekly</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
