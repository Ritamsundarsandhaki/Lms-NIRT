import React, { useState } from 'react';
import axios from '../../components/Axios';

const LibrarianUploadBook = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [results, setResults] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.type.includes('excel') || selectedFile.type.includes('spreadsheetml')) {
        setFile(selectedFile);
        setError('');
      } else {
        setError('Please upload a valid Excel file (.xlsx, .xls)');
      }
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file to upload');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      setUploading(true);
      const response = await axios.post('/api/librarian/upload-books', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        setResults(response.data);
        setError('');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error uploading file');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">📚 Upload Books</h1>
        
        <div className="bg-white rounded-xl shadow-md p-6">
          <form onSubmit={handleUpload} className="space-y-6">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <div className="flex flex-col items-center justify-center space-y-4">
                {/* Custom Upload Icon */}
                <svg 
                  className="h-12 w-12 text-blue-500" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" 
                  />
                </svg>
                
                <div className="text-gray-600">
                  <p className="font-medium">Drag and drop your Excel file here</p>
                  <p className="text-sm">or</p>
                </div>
                
                <label className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                  Browse Files
                  <input
                    type="file"
                    className="hidden"
                    accept=".xlsx, .xls"
                    onChange={handleFileChange}
                  />
                </label>
                {file && <p className="text-sm text-gray-500 mt-2">{file.name}</p>}
              </div>
            </div>

            {error && <p className="text-red-600 text-center">{error}</p>}

            <button
              type="submit"
              disabled={uploading || !file}
              className="w-full bg-green-600 text-white py-3 rounded-md font-medium hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-progress"
            >
              {uploading ? 'Uploading...' : 'Upload Books'}
            </button>
          </form>

          {results && (
            <div className="mt-8 space-y-6">
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="text-green-800 font-medium text-lg">
                  ✅ Successfully uploaded {results.insertedBooks} books!
                </h3>
              </div>

              {results.invalidBooks.length > 0 && (
                <div className="bg-red-50 p-4 rounded-lg">
                  <h4 className="text-red-800 font-medium mb-4">
                    ⚠️ {results.invalidBooks.length} entries had errors:
                  </h4>
                  <div className="space-y-3">
                    {results.invalidBooks.map((invalid, index) => (
                      <div key={index} className="bg-white p-3 rounded-md shadow-sm">
                        <p className="text-sm font-medium text-red-700">
                          Row {invalid.row}: {invalid.reason}
                        </p>
                        {invalid.row && (
                          <pre className="text-xs text-gray-600 mt-1">
                            {JSON.stringify(invalid.row, null, 2)}
                          </pre>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="text-blue-800 font-medium">Upload Summary</h4>
                <pre className="text-sm text-gray-700 mt-2 whitespace-pre-wrap">
                  {JSON.stringify(results.book, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LibrarianUploadBook;