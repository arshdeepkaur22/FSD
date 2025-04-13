import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Award, Users, Star, ChevronDown, RefreshCw, ArrowUpDown } from 'lucide-react';
import FeedbackModal from './FeedbackModal';
import GradingModal from './GradingModal';

// Inline Navbar component
const Navbar = ({ activeView, setActiveView }) => {
  return (
    <nav className="sticky top-0 z-50 bg-[#1E1E1E]/80 backdrop-blur-md shadow-lg rounded-lg mb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center py-4">
          <div className="mb-4 md:mb-0">
            <h1 className="text-2xl font-bold tracking-tight text-purple-400">ProjectHub</h1>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-3">
            <button 
              className={`px-4 py-2 rounded transition-colors ${activeView === 'projects' ? 'bg-purple-600' : 'bg-purple-800 hover:bg-purple-700'}`}
              onClick={() => setActiveView('projects')}
            >
              Projects
            </button>
            <button 
              className={`px-4 py-2 rounded transition-colors ${activeView === 'students' ? 'bg-purple-600' : 'bg-purple-800 hover:bg-purple-700'}`}
              onClick={() => setActiveView('students')}
            >
              Students
            </button>
            <Link to="/leaderboard">
              <button className="bg-purple-800 hover:bg-purple-700 px-4 py-2 rounded transition-colors">
                Leader Board
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

// Mock data for projects
const projectsData = [
  {
    id: 1,
    teamName: 'Digital Dreamweavers',
    projectTitle: 'Climate Change Visualization',
    category: 'Data Visualization',
    submissionStatus: 'In Review',
    projectLink: 'http://localhost:5173/project/1',
    description: 'An interactive visualization of global climate change impacts using Python-generated graphics.',
    technologies: ['Pygame', 'Matplotlib', 'Data Visualization'],
    teamMembers: [
      { name: 'Alice Johnson', role: 'Lead Developer', grade: '' },
      { name: 'Bob Smith', role: 'Data Analyst', grade: '' },
      { name: 'Charlie Brown', role: 'UI Designer', grade: '' }
    ],
    feedback: [],
    rating: 4.5,
    submissionDate: '2024-04-01'
  },
  {
    id: 2,
    teamName: 'Innovative Minds',
    projectTitle: 'Sustainable Water Filtration',
    category: 'Engineering',
    submissionStatus: 'Approved',
    projectLink: 'http://localhost:5173/project/2',
    description: 'A low-cost water filtration system design with 3D-printed components for developing regions.',
    technologies: ['3D Modeling', 'Engineering', 'CAD'],
    teamMembers: [
      { name: 'Diana Prince', role: 'Engineer', grade: '' },
      { name: 'Bruce Wayne', role: '3D Designer', grade: '' }
    ],
    feedback: [],
    rating: 5.0,
    submissionDate: '2024-03-28'
  },
  {
    id: 3,
    teamName: 'Code for Good',
    projectTitle: 'Food Waste Tracker',
    category: 'Sustainable Cities',
    submissionStatus: 'In Review',
    projectLink: 'http://localhost:5173/project/3',
    description: 'Mobile app connecting restaurants with excess food to local shelters and food banks.',
    technologies: ['React Native', 'Firebase', 'Google Maps API'],
    teamMembers: [
      { name: 'Clark Kent', role: 'Mobile Developer', grade: '' },
      { name: 'Lois Lane', role: 'UX Designer', grade: '' },
      { name: 'Jimmy Olsen', role: 'Backend Developer', grade: '' }
    ],
    feedback: [],
    rating: 4.2,
    submissionDate: '2024-03-30'
  },
  {
    id: 4,
    teamName: 'Tech4Change',
    projectTitle: 'AR Educational Experience',
    category: 'Quality Education',
    submissionStatus: 'Pending',
    projectLink: 'http://localhost:5173/project/4',
    description: 'Augmented reality application for interactive learning about endangered ecosystems.',
    technologies: ['Unity', 'ARKit', 'Blender'],
    teamMembers: [
      { name: 'Peter Parker', role: 'AR Developer', grade: '' },
      { name: 'Mary Jane', role: '3D Artist', grade: '' }
    ],
    feedback: [],
    rating: 3.8,
    submissionDate: '2024-04-02'
  },
  {
    id: 5,
    teamName: 'Sustainable Systems',
    projectTitle: 'Urban Garden Planner',
    category: 'Sustainable Cities',
    submissionStatus: 'Approved',
    projectLink: 'http://localhost:5173/project/5',
    description: 'Urban planning tool for city administrators to identify optimal community garden locations.',
    technologies: ['GIS', 'Python', 'Tableau'],
    teamMembers: [
      { name: 'Tony Stark', role: 'Data Scientist', grade: '' },
      { name: 'Steve Rogers', role: 'UI Developer', grade: '' },
      { name: 'Natasha Romanoff', role: 'Project Manager', grade: '' }
    ],
    feedback: [],
    rating: 4.7,
    submissionDate: '2024-03-15'
  },
  {
    id: 6,
    teamName: 'EcoCoders',
    projectTitle: 'Ocean Cleanup Drone',
    category: 'Life Below Water',
    submissionStatus: 'In Review',
    projectLink: 'http://localhost:5173/project/6',
    description: 'Prototype design and control software for autonomous plastic-collecting marine drones.',
    technologies: ['Arduino', 'C++', 'ROS'],
    teamMembers: [
      { name: 'Wade Wilson', role: 'Hardware Engineer', grade: '' },
      { name: 'Logan Howlett', role: 'Software Engineer', grade: '' }
    ],
    feedback: [],
    rating: 4.1,
    submissionDate: '2024-04-04'
  }
];

const Dashboard = () => {
  const [selectedProject, setSelectedProject] = useState(null);
  const [feedbackModal, setFeedbackModal] = useState(false);
  const [gradingModal, setGradingModal] = useState(false);
  const [activeView, setActiveView] = useState('projects');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [filteredProjects, setFilteredProjects] = useState(projectsData);
  const [feedbackText, setFeedbackText] = useState('');
  const [suggestedCategory, setSuggestedCategory] = useState('');

  // Apply filters whenever search or filter states change
  useEffect(() => {
    let filtered = projectsData;
    
    // Apply search term filter
    if (searchTerm) {
      filtered = filtered.filter(project => 
        project.projectTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.teamName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply status filter
    if (statusFilter) {
      filtered = filtered.filter(project => project.submissionStatus === statusFilter);
    }
    
    setFilteredProjects(filtered);
  }, [searchTerm, statusFilter]);

  const handleProvideSDGFeedback = (project) => {
    setSelectedProject(project);
    setFeedbackModal(true);
  };

  const handleViewProject = (project) => {
    window.open(project.projectLink, '_blank');
  };

  const handleOpenGradingModal = (project) => {
    setSelectedProject(project);
    setGradingModal(true);
  };

  const handleGradeStudent = (memberIndex, grade) => {
    const updatedProject = {...selectedProject};
    updatedProject.teamMembers[memberIndex].grade = grade;
    setSelectedProject(updatedProject);
  };

  const handleSubmitFeedback = () => {
    console.log('Feedback submitted:', {
      projectId: selectedProject.id,
      feedback: feedbackText,
      suggestedCategory: suggestedCategory
    });
    
    setFeedbackModal(false);
    setFeedbackText('');
    setSuggestedCategory('');
  };

  const resetFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
  };

  const ProjectCard = ({ project }) => {
    return (
      <div className="bg-[#1E1E1E] rounded-lg overflow-hidden border border-purple-800 hover:border-purple-600 transition-all shadow-lg">
        <div className="bg-gradient-to-r from-purple-900 to-purple-800 px-4 py-3 flex justify-between items-center">
          <h3 className="font-bold truncate text-white">{project.projectTitle}</h3>
          <span className={`text-xs px-2 py-1 rounded ${
            project.submissionStatus === 'Approved' ? 'bg-green-500 text-black' :
            project.submissionStatus === 'In Review' ? 'bg-yellow-500 text-black' :
            'bg-gray-500 text-white'
          }`}>
            {project.submissionStatus}
          </span>
        </div>
        <div className="p-4">
          <div className="mb-3">
            <div className="flex justify-between items-center">
              <p className="font-medium">Team: {project.teamName}</p>
              <div className="flex items-center">
                <Star className="text-yellow-400 mr-1" size={16} />
                <span className="text-yellow-400">{project.rating}</span>
              </div>
            </div>
            <p className="mt-1">
              <span className="bg-purple-800 text-white text-xs px-2 py-1 rounded">
                {project.category}
              </span>
            </p>
            <p className="mt-3 text-gray-300 text-sm line-clamp-2">{project.description}</p>
          </div>
          <div className="mb-3">
            <p className="font-medium mb-1">Technologies:</p>
            <div className="flex flex-wrap gap-1">
              {project.technologies.map((tech, index) => (
                <span key={index} className="bg-[#2C2C2C] text-gray-300 text-xs px-2 py-1 rounded">
                  {tech}
                </span>
              ))}
            </div>
          </div>
          <div>
            <p className="font-medium mb-1">Team Members:</p>
            <ul className="text-sm text-gray-300">
              {project.teamMembers.map((member, index) => (
                <li key={index} className="mb-1">
                  {member.name} - {member.role}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="bg-[#0F0F0F] p-3 flex justify-between gap-2">
          <button 
            className="bg-purple-700 hover:bg-purple-600 text-white px-3 py-1 rounded text-sm flex-1 transition-colors"
            onClick={() => handleViewProject(project)}
          >
            View Project
          </button>
          <button 
            className="bg-purple-800 hover:bg-purple-700 text-white px-3 py-1 rounded text-sm flex-1 transition-colors"
            onClick={() => handleProvideSDGFeedback(project)}
          >
            SDG Feedback
          </button>
          <button 
            className="bg-green-700 hover:bg-green-600 text-white px-3 py-1 rounded text-sm flex-1 transition-colors"
            onClick={() => handleOpenGradingModal(project)}
          >
            Grading
          </button>
        </div>
      </div>
    );
  };

  const renderStudentsView = () => {
    return (
      <div className="bg-[#1E1E1E]/80 backdrop-blur-md p-6 rounded-lg border-2 border-purple-800">
        <h3 className="text-xl font-bold mb-4">Students Management</h3>
        <p className="text-gray-300">Visit the <Link to="/students" className="text-purple-400 hover:text-purple-300 underline">Students page</Link> for full management features.</p>
      </div>
    );
  };

  const renderProjectsView = () => {
    return (
      <div>
        {/* Search and Filter Bar */}
        <div className="bg-[#1E1E1E]/80 backdrop-blur-md p-4 rounded-lg mb-6 border border-purple-800">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-3 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Search projects..." 
                className="w-full bg-[#0F0F0F] border border-purple-900 rounded-md py-2 pl-10 pr-4 text-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <select 
                className="bg-[#0F0F0F] border border-purple-900 rounded-md py-2 px-4 text-white"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">Status: All</option>
                <option value="In Review">In Review</option>
                <option value="Approved">Approved</option>
                <option value="Pending">Pending</option>
              </select>
              <button 
                onClick={resetFilters}
                className="bg-purple-700 hover:bg-purple-600 rounded-md p-2"
                title="Reset filters"
              >
                <RefreshCw size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.length > 0 ? (
            filteredProjects.map(project => (
              <ProjectCard key={project.id} project={project} />
            ))
          ) : (
            <div className="col-span-3 text-center py-12 text-gray-400">
              <p>No projects match your search criteria.</p>
              <button onClick={resetFilters} className="mt-4 bg-purple-700 hover:bg-purple-600 text-white px-4 py-2 rounded">
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch(activeView) {
      case 'projects':
        return renderProjectsView();
      case 'students':
        return renderStudentsView();
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0F0F] via-[#1A1A2E] to-[#0F0F0F] text-white p-4">
      <Navbar activeView={activeView} setActiveView={setActiveView} />

      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-center text-purple-300">Faculty Coordinator Dashboard</h2>
        {renderContent()}
      </div>

      {feedbackModal && selectedProject && (
        <FeedbackModal
          project={selectedProject}
          feedbackText={feedbackText}
          setFeedbackText={setFeedbackText}
          suggestedCategory={suggestedCategory}
          setSuggestedCategory={setSuggestedCategory}
          onSubmit={handleSubmitFeedback}
          onClose={() => setFeedbackModal(false)}
        />
      )}

      {gradingModal && selectedProject && (
        <GradingModal
          project={selectedProject}
          onGradeStudent={handleGradeStudent}
          onClose={() => setGradingModal(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;
