import React, { useState } from 'react';
import axios from '../../components/Axios';
import Swal from 'sweetalert2';

const LibrarianUploadBook = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [results, setResults] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (
        selectedFile.type.includes('excel') ||
        selectedFile.type.includes('spreadsheetml')
      ) {
        setFile(selectedFile);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Invalid File',
          text: 'Please upload a valid Excel file (.xlsx, .xls)',
        });
      }
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      Swal.fire({
        icon: 'warning',
        title: 'No File Selected',
        text: 'Please select a file to upload.',
      });
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      setUploading(true);

      const response = await axios.post('/api/librarian/upload-books', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setResults(response.data);

      if (response.data.success && response.data.insertedBooks > 0) {
        Swal.fire({
          icon: 'success',
          title: 'Upload Successful',
          text: `✅ Successfully uploaded ${response.data.insertedBooks} books!`,
        });
      } else {
        Swal.fire({
          icon: 'warning',
          title: 'Partial Success',
          text:
            response.data.message ||
            'Some entries could not be uploaded. Please review the invalid rows.',
        });
      }
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Upload Failed',
        text: err.response?.data?.message || 'Something went wrong while uploading.',
      });
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

            <button
              type="submit"
              disabled={uploading || !file}
              className="w-full bg-green-600 text-white py-3 rounded-md font-medium hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-progress"
            >
              {uploading ? 'Uploading...' : 'Upload Books'}
            </button>
          </form>

          {/* Show results only if invalidBooks or summary is available */}
          {results && (
            <div className="mt-8 space-y-6">
              {results.invalidBooks && results.invalidBooks.length > 0 && (
                <div className="bg-red-50 p-4 rounded-lg">
                  <h4 className="text-red-800 font-medium mb-4">
                    ⚠️ {results.invalidBooks.length} entries had errors:
                  </h4>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {results.invalidBooks.map((invalid, index) => (
                      <div
                        key={index}
                        className="bg-white p-3 rounded-md shadow-sm border"
                      >
                        <p className="text-sm font-medium text-red-700">
                          Row {index + 1}: {invalid.reason}
                        </p>
                        {invalid.row && (
                          <div className="text-xs text-gray-600 mt-1 space-y-1">
                            <div> <strong>Title:</strong> {invalid.row.Title}</div>
                            <div> <strong>Author:</strong> {invalid.row.Author}</div>
                            <div> <strong>Details:</strong> {invalid.row.Details}</div>
                            <div> <strong>Stock:</strong> {invalid.row.Stock}</div>
                            <div> <strong>Price:</strong> {invalid.row.Price}</div>
                            <div> <strong>Course:</strong> {invalid.row.Course}</div>
                            <div> <strong>Branch:</strong> {invalid.row.Branch}</div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {results.book && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="text-blue-800 font-medium">Upload Summary</h4>
                  <pre className="text-sm text-gray-700 mt-2 whitespace-pre-wrap">
                    {JSON.stringify(results.book, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LibrarianUploadBook;
