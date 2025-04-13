const FeedbackModal = ({
    project,
    feedbackText,
    setFeedbackText,
    suggestedSdg,
    setSuggestedSdg,
    onSubmit,
    onClose,
    sdgOptions
  }) => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
        <div className="bg-[#1E1E1E] border-2 border-purple-800 rounded-lg p-6 w-full max-w-lg shadow-2xl">
          <h3 className="text-xl font-bold mb-4 text-purple-300">Provide SDG Mapping Feedback</h3>
          <div className="mb-4">
            <p className="mb-2">Current SDG: <span className="bg-purple-800 px-2 py-1 rounded text-sm">{project.sdg}</span></p>
            <select 
              className="w-full bg-[#0F0F0F] border border-purple-700 rounded p-2 mt-2"
              value={suggestedSdg}
              onChange={(e) => setSuggestedSdg(e.target.value)}
            >
              <option value="">Suggest Alternative SDG</option>
              {sdgOptions.map(sdg => (
                <option key={sdg} value={sdg}>{sdg}</option>
              ))}
            </select>
          </div>
          <textarea 
            className="w-full bg-[#0F0F0F] border border-purple-700 rounded p-3 h-32 mb-4 text-white"
            placeholder="Provide detailed feedback on SDG mapping"
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
          ></textarea>
          <div className="flex justify-between">
            <button 
              className="bg-red-800 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors"
              onClick={onClose}
            >
              Cancel
            </button>
            <button 
              className="bg-green-700 hover:bg-green-600 text-white px-4 py-2 rounded transition-colors"
              onClick={onSubmit}
              disabled={!feedbackText}
            >
              Submit Feedback
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  export default FeedbackModal;
  