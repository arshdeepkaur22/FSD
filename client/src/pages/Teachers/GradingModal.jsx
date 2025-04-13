const GradingModal = ({ project, onGradeStudent, onClose }) => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
        <div className="bg-[#1E1E1E] border-2 border-purple-800 rounded-lg p-6 w-full max-w-lg shadow-2xl">
          <h3 className="text-xl font-bold mb-4 text-purple-300">Grade {project.teamName} Team</h3>
          <div className="mb-4">
            {project.teamMembers.map((member, index) => (
              <div key={index} className="flex justify-between items-center mb-3 pb-3 border-b border-gray-700">
                <span className="text-gray-200">{member.name} - {member.role}</span>
                <select 
                  className="bg-[#0F0F0F] border border-purple-700 rounded p-2"
                  value={member.grade}
                  onChange={(e) => onGradeStudent(index, e.target.value)}
                >
                  <option value="">Select Grade</option>
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                  <option value="D">D</option>
                  <option value="F">F</option>
                </select>
              </div>
            ))}
          </div>
          <div className="flex justify-between">
            <button 
              className="bg-red-800 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors"
              onClick={onClose}
            >
              Cancel
            </button>
            <button 
              className="bg-green-700 hover:bg-green-600 text-white px-4 py-2 rounded transition-colors"
              onClick={onClose}
            >
              Save Grades
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  export default GradingModal;
  