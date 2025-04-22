import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../components/Axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

const UpdateStudent = () => {
  const { fileNo } = useParams();
  const [studentData, setStudentData] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const branches = [
    "CSE",
    "ECE",
    "EE",
    "Cyber",
    "Mining",
    "ME",
    "Automobile",
    "Civil",
  ];

  useEffect(() => {
    if (fileNo) fetchStudent();
  }, [fileNo]);

  const fetchStudent = async () => {
    try {
      const res = await api.get(
        `/api/librarian/search-student?page=1&limit=1&fileNo=${fileNo}`
      );
      setStudentData(res.data.students[0]);
    } catch (err) {
      MySwal.fire(
        "Not Found",
        err.response?.data?.message || "Error fetching student",
        "error"
      );
    }
  };

  const handleChange = (e) => {
    setStudentData({ ...studentData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validateForm = () => {
    let newErrors = {};
    if (!studentData.name.trim()) newErrors.name = "Name is required.";
    if (!studentData.email.trim()) newErrors.email = "Email is required.";
    if (!/^\S+@\S+\.\S+$/.test(studentData.email))
      newErrors.email = "Invalid email format.";
    if (!studentData.parentName.trim())
      newErrors.parentName = "Parent Name is required.";
    if (!/^[6789]\d{9}$/.test(studentData.mobile))
      newErrors.mobile = "Enter a valid 10-digit Indian mobile number.";
    if (!studentData.department.trim())
      newErrors.department = "Department is required.";
    if (!studentData.branch) newErrors.branch = "Please select a branch.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdate = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const res = await api.put("/api/librarian/update-student", studentData);
      MySwal.fire("Success", res.data.message, "success");
    } catch (err) {
      MySwal.fire(
        "Error",
        err.response?.data?.message || "Update failed",
        "error"
      );
    }
    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-green-100 via-blue-50 to-purple-100 p-4 sm:p-6">
      <div className="w-full max-w-lg md:max-w-2xl bg-white shadow-xl rounded-2xl p-6 sm:p-8 transition-all duration-300 hover:shadow-2xl">
        <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-6">
          Update Student
        </h2>

        {studentData ? (
          <div className="space-y-4 sm:space-y-5">
            <InputField
              name="name"
              value={studentData.name}
              onChange={handleChange}
              placeholder="Full Name"
              error={errors.name}
            />
            <InputField
              name="email"
              value={studentData.email}
              onChange={handleChange}
              placeholder="Email"
              error={errors.email}
            />
            <InputField
              name="parentName"
              value={studentData.parentName}
              onChange={handleChange}
              placeholder="Parent Name"
              error={errors.parentName}
            />
            <InputField
              name="mobile"
              value={studentData.mobile}
              onChange={handleChange}
              placeholder="Mobile"
              error={errors.mobile}
            />
            <InputField
              name="department"
              value={studentData.department}
              onChange={handleChange}
              placeholder="Department"
              error={errors.department}
            />

            {/* Branch Dropdown */}
            <div className="relative">
              <select
                name="branch"
                value={studentData.branch}
                onChange={handleChange}
                className={`w-full p-3 border rounded-lg bg-gray-50 text-gray-900 transition-all duration-300 
                            ${
                              errors.branch
                                ? "border-red-500 focus:ring-red-400"
                                : "border-gray-300 focus:ring-indigo-400 hover:bg-gray-100"
                            }`}
              >
                <option value="">Select Branch</option>
                {branches.map((branch) => (
                  <option key={branch} value={branch}>
                    {branch}
                  </option>
                ))}
              </select>
              {errors.branch && (
                <p className="text-red-500 text-sm mt-1">{errors.branch}</p>
              )}
            </div>

            {/* Submit */}
            <button
              onClick={handleUpdate}
              disabled={loading}
              className="w-full p-3 rounded-lg text-white font-semibold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500
             hover:from-indigo-600 hover:to-pink-600 hover:scale-105 active:scale-95 disabled:opacity-50
             transition-all duration-200 flex justify-center items-center shadow-lg"
            >
              {loading ? <LoadingSpinner /> : "Update"}
            </button>
          </div>
        ) : (
          <p className="text-center text-gray-700">Fetching student data...</p>
        )}
      </div>
    </div>
  );
};

// Reusable Input Field Component
const InputField = ({ name, value, onChange, placeholder, error }) => (
  <div>
    <input
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full p-3 border rounded-lg bg-gray-50 text-gray-900 transition-all duration-300 
                 ${
                   error
                     ? "border-red-500 focus:ring-red-400"
                     : "border-gray-300 focus:ring-indigo-400 hover:bg-gray-100 hover:shadow-md"
                 } text-sm sm:text-base`}
    />
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);

// Spinner
const LoadingSpinner = () => (
  <svg
    className="w-6 h-6 animate-spin text-white"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    ></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8v8H4z"
    ></path>
  </svg>
);

export default UpdateStudent;
