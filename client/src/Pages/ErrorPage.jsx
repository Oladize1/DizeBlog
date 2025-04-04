import React from 'react';
import { useNavigate } from 'react-router-dom';

const ErrorPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-600 to-blue-500 text-white">
      <div className="text-center">
        {/* Error Code */}
        <h1 className="text-9xl font-bold mb-4">404</h1>

        {/* Error Message */}
        <h2 className="text-4xl font-semibold mb-4">Oops! Page Not Found</h2>

        {/* Description */}
        <p className="text-lg mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>

        {/* Back to Home Button */}
        <button
          onClick={() => navigate('/')}
          className="px-6 py-3 bg-white text-purple-600 font-semibold  cursor-pointer  rounded-lg shadow-lg hover:bg-purple-50 transition duration-300"
        >
          Go Back Home
        </button>
      </div>
    </div>
  );
};

export default ErrorPage;