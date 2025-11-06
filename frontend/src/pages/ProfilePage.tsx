import React from 'react';

const ProfilePage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-28 text-center min-h-screen">
      <h1 className="text-5xl font-extrabold text-white mb-4">Your Profile</h1>
      <p className="text-xl text-slate-400 max-w-3xl mx-auto mb-16">
        Manage your account, view your usage, and update your preferences.
      </p>
      <div className="bg-slate-800 p-8 rounded-xl border border-slate-700 max-w-xl mx-auto">
        <h2 className="text-2xl font-bold text-white mb-4">Account Details</h2>
        <div className="text-left text-slate-300 space-y-4">
          <div>
            <span className="font-bold text-white">Name:</span> John Doe
          </div>
          <div>
            <span className="font-bold text-white">Email:</span>{' '}
            johndoe@example.com
          </div>
          <div>
            <span className="font-bold text-white">Plan:</span> Pro
          </div>
        </div>
        <button className="mt-8 w-full bg-sky-600 hover:bg-sky-700 text-white font-bold py-3 rounded-lg transition-colors">
          Edit Profile
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
