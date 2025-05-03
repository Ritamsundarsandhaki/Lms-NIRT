import React, { useState } from 'react';
import axios from '../../components/Axios';
import Swal from 'sweetalert2';
import { Eye, EyeOff } from 'lucide-react'; // Eye icons (optional but recommended)

function ChangePassword() {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState('');
  const [loading, setLoading] = useState(false);

  const toggleOldPassword = () => setShowOldPassword(!showOldPassword);
  const toggleNewPassword = () => setShowNewPassword(!showNewPassword);

  const checkPasswordStrength = (password) => {
    if (password.length < 6) {
      return 'Weak';
    } else if (password.match(/[A-Z]/) && password.match(/[0-9]/) && password.length >= 8) {
      return 'Strong';
    } else {
      return 'Medium';
    }
  };

  const handleNewPasswordChange = (e) => {
    const value = e.target.value;
    setNewPassword(value);
    setPasswordStrength(checkPasswordStrength(value));
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.put('/api/librarian/changePassword', {
        oldPassword,
        newPassword,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: response.data.message || 'Password changed successfully!',
      });

      setOldPassword('');
      setNewPassword('');
      setPasswordStrength('');
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Failed to change password.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-100 to-purple-200">
      <form onSubmit={handleChangePassword} className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <h2 className="text-3xl font-bold mb-8 text-center text-blue-600">Change Password</h2>

        {/* Old Password */}
        <div className="mb-6 relative">
          <label className="block text-gray-700 mb-2 font-medium">Old Password</label>
          <input
            type={showOldPassword ? 'text' : 'password'}
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
            placeholder="Enter your old password"
          />
          <div
            className="absolute right-3 top-10 cursor-pointer text-gray-500"
            onClick={toggleOldPassword}
          >
            {showOldPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </div>
        </div>

        {/* New Password */}
        <div className="mb-4 relative">
          <label className="block text-gray-700 mb-2 font-medium">New Password</label>
          <input
            type={showNewPassword ? 'text' : 'password'}
            value={newPassword}
            onChange={handleNewPasswordChange}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
            placeholder="Enter your new password"
          />
          <div
            className="absolute right-3 top-10 cursor-pointer text-gray-500"
            onClick={toggleNewPassword}
          >
            {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </div>
        </div>

        {/* Password Strength Meter */}
        {newPassword && (
          <div className="mb-6">
            <p className={`text-sm font-semibold ${passwordStrength === 'Weak' ? 'text-red-500' : passwordStrength === 'Medium' ? 'text-yellow-500' : 'text-green-500'}`}>
              Password Strength: {passwordStrength}
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300"
        >
          {loading ? 'Changing...' : 'Change Password'}
        </button>
      </form>
    </div>
  );
}

export default ChangePassword;
