import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, RefreshCw, UserPlus, Trash2, Edit, ChevronDown, Users } from 'lucide-react';

// Inline Navbar component
const Navbar = ({ activeView }) => {
  return (
    <nav className="sticky top-0 z-50 bg-[#1E1E1E]/80 backdrop-blur-md shadow-lg rounded-lg mb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center py-4">
          <div className="mb-4 md:mb-0">
            <h1 className="text-2xl font-bold tracking-tight text-purple-400">Creative Coding Showcase Platform</h1>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-3">
            <Link to="/">
              <button className={`px-4 py-2 rounded transition-colors ${activeView !== 'students' ? 'bg-purple-600' : 'bg-purple-800 hover:bg-purple-700'}`}>
                Projects
              </button>
            </Link>
            <button className={`px-4 py-2 rounded transition-colors bg-purple-600`}>
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

// Mock data for students
const studentsData = [
    {
      id: 1,
      name: 'Alice Johnson',
      email: 'alice.johnson@university.edu',
      studentId: 'STU001',
      department: 'Computer Science',
      year: '3rd',
      projects: 2,
      averageGrade: 'A'
    },
    {
      id: 2,
      name: 'Bob Smith',
      email: 'bob.smith@university.edu',
      studentId: 'STU002',
      department: 'Digital Media',
      year: '2nd',
      projects: 1,
      averageGrade: 'B+'
    },
    {
      id: 3,
      name: 'Charlie Brown',
      email: 'charlie.brown@university.edu',
      studentId: 'STU003',
      department: 'Computer Science',
      year: '4th',
      projects: 3,
      averageGrade: 'A-'
    },
    {
      id: 4,
      name: 'Diana Prince',
      email: 'diana.prince@university.edu',
      studentId: 'STU004',
      department: 'Information Technology',
      year: '3rd',
      projects: 2,
      averageGrade: 'B'
    },
    {
      id: 5,
      name: 'Edward Norton',
      email: 'edward.norton@university.edu',
      studentId: 'STU005',
      department: 'Computer Engineering',
      year: '2nd',
      projects: 1,
      averageGrade: 'A'
    },
    {
      id: 6,
      name: 'Fiona Gallagher',
      email: 'fiona.gallagher@university.edu',
      studentId: 'STU006',
      department: 'Digital Media',
      year: '3rd',
      projects: 2,
      averageGrade: 'B+'
    },
    {
      id: 7,
      name: 'George Harris',
      email: 'george.harris@university.edu',
      studentId: 'STU007',
      department: 'Information Technology',
      year: '4th',
      projects: 3,
      averageGrade: 'B-'
    },
    {
      id: 8,
      name: 'Hannah Montana',
      email: 'hannah.montana@university.edu',
      studentId: 'STU008',
      department: 'Computer Science',
      year: '1st',
      projects: 1,
      averageGrade: 'A-'
    }
  ];
  
  const DEPARTMENTS = ['All Departments', 'Computer Science', 'Digital Media', 'Information Technology', 'Computer Engineering'];
  const YEARS = ['All Years', '1st', '2nd', '3rd', '4th'];
  
  const Students = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [departmentFilter, setDepartmentFilter] = useState('All Departments');
    const [yearFilter, setYearFilter] = useState('All Years');
    const [filteredStudents, setFilteredStudents] = useState(studentsData);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
    // Apply filters whenever search or filter states change
    useEffect(() => {
      let filtered = studentsData;
      
      // Apply search term filter
      if (searchTerm) {
        filtered = filtered.filter(student => 
          student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.studentId.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      // Apply department filter
      if (departmentFilter !== 'All Departments') {
        filtered = filtered.filter(student => student.department === departmentFilter);
      }
      
      // Apply year filter
      if (yearFilter !== 'All Years') {
        filtered = filtered.filter(student => student.year === yearFilter);
      }
      
      setFilteredStudents(filtered);
    }, [searchTerm, departmentFilter, yearFilter]);
  
    const resetFilters = () => {
      setSearchTerm('');
      setDepartmentFilter('All Departments');
      setYearFilter('All Years');
    };
  
    const handleAddStudent = () => {
      setIsAddModalOpen(true);
    };
  
    const handleEditStudent = (student) => {
      setSelectedStudent(student);
      setIsEditModalOpen(true);
    };
  
    const handleDeleteStudent = (student) => {
      setSelectedStudent(student);
      setIsDeleteModalOpen(true);
    };
  
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0F0F0F] via-[#1A1A2E] to-[#0F0F0F] text-white p-4">
        {/* Navbar */}
        <Navbar activeView="students" />
  
        {/* Students Dashboard Container */}
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-center text-purple-300">Students Management</h2>
          
          {/* Search and Filter Bar */}
          <div className="bg-[#1E1E1E]/80 backdrop-blur-md p-4 rounded-lg mb-6 border border-purple-800">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-3 text-gray-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Search students..." 
                  className="w-full bg-[#0F0F0F] border border-purple-900 rounded-md py-2 pl-10 pr-4 text-white"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <select 
                  className="bg-[#0F0F0F] border border-purple-900 rounded-md py-2 px-4 text-white"
                  value={departmentFilter}
                  onChange={(e) => setDepartmentFilter(e.target.value)}
                >
                  {DEPARTMENTS.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
                <select 
                  className="bg-[#0F0F0F] border border-purple-900 rounded-md py-2 px-4 text-white"
                  value={yearFilter}
                  onChange={(e) => setYearFilter(e.target.value)}
                >
                  {YEARS.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
                <button 
                  onClick={resetFilters}
                  className="bg-purple-700 hover:bg-purple-600 rounded-md p-2"
                  title="Reset filters"
                >
                  <RefreshCw size={20} />
                </button>
                <button 
                  onClick={handleAddStudent}
                  className="bg-green-700 hover:bg-green-600 rounded-md p-2 flex items-center gap-1"
                  title="Add new student"
                >
                  <UserPlus size={20} />
                  <span className="hidden sm:inline">Add Student</span>
                </button>
              </div>
            </div>
          </div>
  
          {/* Students Table */}
          <div className="bg-[#1E1E1E]/80 backdrop-blur-md rounded-lg border border-purple-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-purple-900/50 text-left">
                  <tr>
                    <th className="px-6 py-3">Name</th>
                    <th className="px-6 py-3">Student ID</th>
                    <th className="px-6 py-3">Department</th>
                    <th className="px-6 py-3">Year</th>
                    <th className="px-6 py-3">Projects</th>
                    <th className="px-6 py-3">Avg. Grade</th>
                    <th className="px-6 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-purple-800/30">
                  {filteredStudents.length > 0 ? (
                    filteredStudents.map(student => (
                      <tr key={student.id} className="hover:bg-purple-900/20 transition-colors">
                        <td className="px-6 py-4">
                          <div>
                            <div className="font-medium">{student.name}</div>
                            <div className="text-xs text-gray-400">{student.email}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4">{student.studentId}</td>
                        <td className="px-6 py-4">{student.department}</td>
                        <td className="px-6 py-4">{student.year}</td>
                        <td className="px-6 py-4">{student.projects}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium
                            ${student.averageGrade.startsWith('A') ? 'bg-green-900 text-green-300' : 
                            student.averageGrade.startsWith('B') ? 'bg-blue-900 text-blue-300' : 
                            student.averageGrade.startsWith('C') ? 'bg-yellow-900 text-yellow-300' : 
                            'bg-red-900 text-red-300'}`
                          }>
                            {student.averageGrade}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button 
                              onClick={() => handleEditStudent(student)}
                              className="p-1 hover:bg-purple-800 rounded-full transition-colors"
                              title="Edit student"
                            >
                              <Edit size={16} />
                            </button>
                            <button 
                              onClick={() => handleDeleteStudent(student)}
                              className="p-1 hover:bg-red-900 rounded-full transition-colors"
                              title="Delete student"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="px-6 py-8 text-center text-gray-400">
                        <p>No students match your search criteria.</p>
                        <button onClick={resetFilters} className="mt-2 text-purple-400 hover:text-purple-300 underline">
                          Reset Filters
                        </button>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
  
        {/* Add Student Modal */}
        {isAddModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-[#1E1E1E] border-2 border-purple-800 rounded-lg p-6 w-full max-w-lg shadow-2xl">
              <h3 className="text-xl font-bold mb-4 text-purple-300">Add New Student</h3>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Full Name</label>
                  <input type="text" className="w-full bg-[#0F0F0F] border border-purple-700 rounded p-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input type="email" className="w-full bg-[#0F0F0F] border border-purple-700 rounded p-2" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Student ID</label>
                    <input type="text" className="w-full bg-[#0F0F0F] border border-purple-700 rounded p-2" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Year</label>
                    <select className="w-full bg-[#0F0F0F] border border-purple-700 rounded p-2">
                      {YEARS.filter(year => year !== 'All Years').map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Department</label>
                  <select className="w-full bg-[#0F0F0F] border border-purple-700 rounded p-2">
                    {DEPARTMENTS.filter(dept => dept !== 'All Departments').map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
                <div className="flex justify-between pt-4">
                  <button 
                    type="button"
                    className="bg-red-800 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors"
                    onClick={() => setIsAddModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    type="button"
                    className="bg-green-700 hover:bg-green-600 text-white px-4 py-2 rounded transition-colors"
                    onClick={() => setIsAddModalOpen(false)}
                  >
                    Add Student
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
  
        {/* Edit Student Modal */}
        {isEditModalOpen && selectedStudent && (
          <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-[#1E1E1E] border-2 border-purple-800 rounded-lg p-6 w-full max-w-lg shadow-2xl">
              <h3 className="text-xl font-bold mb-4 text-purple-300">Edit Student</h3>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Full Name</label>
                  <input type="text" className="w-full bg-[#0F0F0F] border border-purple-700 rounded p-2" defaultValue={selectedStudent.name} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input type="email" className="w-full bg-[#0F0F0F] border border-purple-700 rounded p-2" defaultValue={selectedStudent.email} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Student ID</label>
                    <input type="text" className="w-full bg-[#0F0F0F] border border-purple-700 rounded p-2" defaultValue={selectedStudent.studentId} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Year</label>
                    <select className="w-full bg-[#0F0F0F] border border-purple-700 rounded p-2" defaultValue={selectedStudent.year}>
                      {YEARS.filter(year => year !== 'All Years').map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Department</label>
                  <select className="w-full bg-[#0F0F0F] border border-purple-700 rounded p-2" defaultValue={selectedStudent.department}>
                    {DEPARTMENTS.filter(dept => dept !== 'All Departments').map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
                <div className="flex justify-between pt-4">
                  <button 
                    type="button"
                    className="bg-red-800 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors"
                    onClick={() => setIsEditModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    type="button"
                    className="bg-green-700 hover:bg-green-600 text-white px-4 py-2 rounded transition-colors"
                    onClick={() => setIsEditModalOpen(false)}
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
  
        {/* Delete Confirmation Modal */}
        {isDeleteModalOpen && selectedStudent && (
          <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-[#1E1E1E] border-2 border-purple-800 rounded-lg p-6 w-full max-w-md shadow-2xl">
              <h3 className="text-xl font-bold mb-4 text-purple-300">Confirm Deletion</h3>
              <p className="text-gray-300 mb-6">
                Are you sure you want to delete student <span className="font-medium text-white">{selectedStudent.name}</span>? 
                This action cannot be undone.
              </p>
              <div className="flex justify-between">
                <button 
                  className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded transition-colors"
                  onClick={() => setIsDeleteModalOpen(false)}
                >
                  Cancel
                </button>
                <button 
                  className="bg-red-700 hover:bg-red-600 text-white px-4 py-2 rounded transition-colors"
                  onClick={() => setIsDeleteModalOpen(false)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };
  
  export default Students;
  