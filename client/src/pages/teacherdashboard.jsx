import React, { useState } from 'react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent, 
  CardFooter 
} from '@/components/ui/card';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  School, 
  Users, 
  Folder, 
  BarChart, 
  Settings, 
  Eye, 
  Play, 
  Download,
  Award 
} from 'lucide-react';

const initialProjects = [
  {
    id: '1',
    studentName: 'Alice Johnson',
    projectName: 'Space Invaders Game',
    projectType: 'Game Development',
    submissionDate: '2024-03-20',
    projectFile: '/path/to/alice_space_invaders.zip',
    runnable: true,
    previewImage: '/api/placeholder/300/200',
    grade: null,
    status: 'Submitted',
    feedback: ''
  },
  {
    id: '2',
    studentName: 'Bob Smith',
    projectName: 'Weather App',
    projectType: 'Web Application',
    submissionDate: '2024-03-22',
    projectFile: '/path/to/bob_weather_app.zip',
    runnable: true,
    previewImage: '/api/placeholder/300/200',
    grade: null,
    status: 'Under Review',
    feedback: ''
  },
  {
    id: '3',
    studentName: 'Charlie Brown',
    projectName: 'Data Visualization Tool',
    projectType: 'Data Science',
    submissionDate: '2024-03-25',
    projectFile: '/path/to/charlie_data_viz.zip',
    runnable: false,
    previewImage: '/api/placeholder/300/200',
    grade: null,
    status: 'Needs Improvement',
    feedback: ''
  }
];

const TeacherDashboard: React.FC = () => {
  const [projects, setProjects] = useState(initialProjects);
  const [selectedProject, setSelectedProject] = useState<typeof initialProjects[0] | null>(null);
  const [gradingProject, setGradingProject] = useState<typeof initialProjects[0] | null>(null);
  const [activeTab, setActiveTab] = useState('projects');

  const handleViewDetails = (project: typeof initialProjects[0]) => {
    setSelectedProject(project);
  };

  const handleRunProject = (project: typeof initialProjects[0]) => {
    alert(`Running project: ${project.projectName} by ${project.studentName}`);
  };

  const handleDownloadProject = (project: typeof initialProjects[0]) => {
    alert(`Downloading project: ${project.projectFile}`);
  };

  const handleGradeProject = (project: typeof initialProjects[0], grade: string, feedback: string) => {
    const updatedProjects = projects.map(p => 
      p.id === project.id 
        ? {...p, grade, status: 'Graded', feedback} 
        : p
    );
    setProjects(updatedProjects);
    setGradingProject(null);
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Submitted': return 'bg-purple-100 text-purple-800';
      case 'Under Review': return 'bg-purple-200 text-purple-900';
      case 'Needs Improvement': return 'bg-purple-300 text-purple-950';
      case 'Graded': return 'bg-purple-400 text-white';
      default: return 'bg-purple-50 text-purple-700';
    }
  };

  return (
    <div className="min-h-screen bg-purple-50 text-purple-900">
      {/* Navbar */}
      <nav className="bg-purple-100 shadow-md">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center">
            <School className="h-8 w-8 text-purple-600 mr-3" />
            <h1 className="text-2xl font-bold text-purple-800">Teacher Dashboard</h1>
          </div>
          <div className="flex space-x-4">
            {['Projects', 'Students', 'Analytics', 'Settings'].map((tab) => (
              <Button 
                key={tab}
                variant={activeTab.toLowerCase() === tab.toLowerCase() ? 'default' : 'ghost'}
                className={`text-purple-700 ${activeTab.toLowerCase() === tab.toLowerCase() ? 'bg-purple-600 text-white' : 'hover:bg-purple-200'}`}
                onClick={() => setActiveTab(tab.toLowerCase())}
              >
                {tab}
              </Button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Card key={project.id} className="w-full bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border-purple-200">
              <CardHeader className="pb-2 bg-purple-50">
                <CardTitle className="text-xl text-purple-800">{project.projectName}</CardTitle>
                <p className="text-sm text-purple-600">{project.studentName}</p>
              </CardHeader>
              <CardContent>
                <img 
                  src={project.previewImage} 
                  alt={`Preview of ${project.projectName}`} 
                  className="w-full h-48 object-cover rounded-md mb-4 border-2 border-purple-100"
                />
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-purple-600">Submitted: {project.submissionDate}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                      {project.status}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-purple-700">{project.projectType}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between pt-2 bg-purple-50">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-purple-700 border-purple-300 hover:bg-purple-100"
                  onClick={() => handleViewDetails(project)}
                >
                  <Eye className="mr-2 h-4 w-4 text-purple-600" /> Details
                </Button>
                <Button 
                  variant="default" 
                  size="sm" 
                  className="bg-purple-600 text-white hover:bg-purple-700"
                  onClick={() => handleRunProject(project)}
                  disabled={!project.runnable}
                >
                  <Play className="mr-2 h-4 w-4" /> Run
                </Button>
                <Dialog open={gradingProject?.id === project.id} onOpenChange={() => setGradingProject(null)}>
                  <DialogTrigger asChild>
                    <Button 
                      variant="secondary" 
                      size="sm" 
                      className="bg-purple-200 text-purple-800 hover:bg-purple-300"
                      onClick={() => setGradingProject(project)}
                    >
                      <Award className="mr-2 h-4 w-4 text-purple-600" /> Grade
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-purple-50 text-purple-900">
                    <DialogHeader>
                      <DialogTitle className="text-purple-800">Grade Project: {project.projectName}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="grade" className="text-purple-700">Grade (A+, A, B+, etc.)</Label>
                        <Input 
                          id="grade" 
                          placeholder="Enter grade" 
                          className="mt-2 border-purple-300 focus:border-purple-500 focus:ring-purple-500"
                          defaultValue={project.grade || ''}
                        />
                      </div>
                      <div>
                        <Label htmlFor="feedback" className="text-purple-700">Feedback</Label>
                        <textarea 
                          id="feedback" 
                          className="w-full border rounded p-2 mt-2 border-purple-300 focus:border-purple-500 focus:ring-purple-500"
                          rows={4}
                          placeholder="Provide detailed feedback"
                          defaultValue={project.feedback}
                        />
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button 
                          variant="outline" 
                          className="text-purple-700 border-purple-300 hover:bg-purple-100"
                          onClick={() => setGradingProject(null)}
                        >
                          Cancel
                        </Button>
                        <Button 
                          className="bg-purple-600 text-white hover:bg-purple-700"
                          onClick={() => {
                            const gradeInput = document.getElementById('grade') as HTMLInputElement;
                            const feedbackInput = document.getElementById('feedback') as HTMLTextAreaElement;
                            handleGradeProject(project, gradeInput.value, feedbackInput.value);
                          }}
                        >
                          Save Grade
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Project Details Modal */}
        {selectedProject && (
          <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
            <DialogContent className="bg-purple-50 text-purple-900">
              <DialogHeader>
                <DialogTitle className="text-purple-800">{selectedProject.projectName}</DialogTitle>
              </DialogHeader>
              <div className="space-y-3">
                <p><strong className="text-purple-700">Student:</strong> {selectedProject.studentName}</p>
                <p><strong className="text-purple-700">Project Type:</strong> {selectedProject.projectType}</p>
                <p><strong className="text-purple-700">Submitted:</strong> {selectedProject.submissionDate}</p>
                <p><strong className="text-purple-700">Status:</strong> 
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedProject.status)}`}>
                    {selectedProject.status}
                  </span>
                </p>
                {selectedProject.grade && (
                  <>
                    <p><strong className="text-purple-700">Grade:</strong> {selectedProject.grade}</p>
                    <p><strong className="text-purple-700">Feedback:</strong> {selectedProject.feedback}</p>
                  </>
                )}
              </div>
              <div className="flex justify-end">
                <Button 
                  variant="destructive" 
                  className="bg-purple-600 text-white hover:bg-purple-700"
                  onClick={() => setSelectedProject(null)}
                >
                  Close
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
};

export default TeacherDashboard;