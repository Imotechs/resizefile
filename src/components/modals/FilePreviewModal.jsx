const FilePreviewModal = ({ processedFile, isVisible, onClose }) => {
    if (!isVisible) return null;
  
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
        {/* Modal Content */}
        <div className="bg-white rounded-lg shadow-lg w-11/12 max-w-2xl p-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800">File Preview</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-800 transition"
            >
              ✕
            </button>
          </div>
  
          <div className="mt-4">
            {processedFile ? (
              <embed
                src={processedFile}
                width="100%"
                height="400"
                type="application/pdf"
                className="rounded-md border border-gray-300"
              />
            ) : (
              <p className="text-gray-500">No file to preview.</p>
            )}
          </div>
  
          <div className="mt-4 flex justify-end">
            <a
              href={processedFile}
              download="processed.pdf"
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              Download
            </a>
          </div>
        </div>
      </div>
    );
  };

  export default FilePreviewModal;