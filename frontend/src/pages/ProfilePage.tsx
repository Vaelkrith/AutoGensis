import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

const API_URL = 'http://127.0.0.1:8000';

interface UserProfile {
    name: string;
    email: string;
    age: number | null;
    profession: string | null;
    created_at: string;
}

const getInitials = (name: string) => {
    const names = name.split(' ');
    const initials = names.map(n => n[0]).join('');
    return initials.slice(0, 2).toUpperCase();
};

const formatProfession = (profession: string | null) => {
    if (!profession) return "Not specified";
    return profession.charAt(0).toUpperCase() + profession.slice(1).replace(/-/g, ' ').replace(/_/g, ' ');
};

// Define tab types
type ProfileTab = 'profile' | 'security' | 'plan';

const ProfilePage: React.FC = () => {
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<ProfileTab>('profile');
    const { token, logout } = useAuth();

    useEffect(() => {
        const fetchUserProfile = async () => {
            if (!token) {
                toast.error("You are not logged in.");
                logout();
                return;
            }

            try {
                const response = await fetch(`${API_URL}/api/users/me`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.status === 401) {
                    toast.error('Session expired. Please log in again.');
                    logout();
                    return;
                }
                if (!response.ok) {
                    throw new Error('Failed to fetch user profile.');
                }

                const data: UserProfile = await response.json();
                setUserProfile(data); 
            } catch (error) {
                console.error("Failed to fetch profile:", error);
                toast.error(error instanceof Error ? error.message : "Could not load profile.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserProfile();
    }, [token, logout]);

    const renderTabContent = () => {
        if (!userProfile) return null;

        switch (activeTab) {
            case 'profile':
                return (
                    <div className="space-y-4">
                        <div className="flex items-center mb-8 p-4">
                            <div className="w-20 h-20 rounded-full bg-sky-600 flex items-center justify-center text-white text-3xl font-bold mr-6 flex-shrink-0">
                                {getInitials(userProfile.name)}
                            </div>
                            <div>
                                <h2 className="text-3xl font-bold text-white">{userProfile.name}</h2>
                                <p className="text-lg text-slate-400">{formatProfession(userProfile.profession)}</p>
                            </div>
                        </div>
                        
                        <div className="space-y-4">
                            <div className="flex flex-col sm:flex-row p-4 bg-slate-900/50 rounded-lg">
                                <span className="font-semibold text-slate-300 w-32 mb-1 sm:mb-0">Name</span>
                                <span className="text-white">{userProfile.name}</span>
                            </div>
                            <div className="flex flex-col sm:flex-row p-4 bg-slate-900/50 rounded-lg">
                                <span className="font-semibold text-slate-300 w-32 mb-1 sm:mb-0">Email</span>
                                <span className="text-white">{userProfile.email}</span>
                            </div>
                            <div className="flex flex-col sm:flex-row p-4 bg-slate-900/50 rounded-lg">
                                <span className="font-semibold text-slate-300 w-32 mb-1 sm:mb-0">Age</span>
                                <span className="text-white">{userProfile.age || "Not specified"}</span>
                            </div>
                            <div className="flex flex-col sm:flex-row p-4 bg-slate-900/50 rounded-lg">
                                <span className="font-semibold text-slate-300 w-32 mb-1 sm:mb-0">Member Since</span>
                                <span className="text-white">{new Date(userProfile.created_at).toLocaleDateString()}</span>
                            </div>
                        </div>
                         <button className="mt-8 w-auto bg-sky-600 hover:bg-sky-700 text-white font-bold py-3 px-6 rounded-lg transition-colors cursor-not-allowed opacity-50">
                            Edit Profile (Coming Soon)
                        </button>
                    </div>
                );
            case 'security':
                return (
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-4">Security Settings</h2>
                        <p className="text-slate-400 mb-6">Change your account password.</p>
                        <div className="space-y-4">
                            <div className="relative">
                                <label className="block text-sm font-medium text-slate-300 mb-2">Current Password</label>
                                <input type="password" disabled className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 cursor-not-allowed opacity-50" placeholder="••••••••" />
                            </div>
                            <div className="relative">
                                <label className="block text-sm font-medium text-slate-300 mb-2">New Password</label>
                                <input type="password" disabled className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 cursor-not-allowed opacity-50" placeholder="••••••••" />
                            </div>
                        </div>
                        <button className="mt-6 w-auto bg-sky-600 text-white font-bold py-3 px-6 rounded-lg transition-colors cursor-not-allowed opacity-50">
                            Change Password (Coming Soon)
                        </button>
                    </div>
                );
            case 'plan':
                 return (
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-4">My Plan</h2>
                        <p className="text-slate-400 mb-6">View your current plan and usage.</p>
                        <div className="p-4 bg-slate-900/50 rounded-lg mb-4">
                            <span className="font-semibold text-slate-300">Current Plan: </span>
                            <span className="text-white font-bold text-sky-400">Hobby (Free)</span>
                        </div>
                         <div className="p-4 bg-slate-900/50 rounded-lg">
                            <span className="font-semibold text-slate-300">Usage this month: </span>
                            <span className="text-white">3 / 5 Generations Used (Placeholder)</span>
                        </div>
                         <button className="mt-6 w-auto bg-sky-600 hover:bg-sky-700 text-white font-bold py-3 px-6 rounded-lg transition-colors cursor-not-allowed opacity-50">
                            Manage Plan (Coming Soon)
                        </button>
                    </div>
                );
            default:
                return null;
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen container mx-auto px-4 py-28 flex items-center justify-center">
                <svg className="animate-spin h-10 w-10 text-sky-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-28 min-h-screen">
            <h1 className="text-5xl font-extrabold text-white mb-12">
                Account Settings
            </h1>
            
            <div className="bg-slate-800 rounded-xl border border-slate-700 max-w-4xl mx-auto">
                <nav className="flex border-b border-slate-700">
                    <TabButton
                        title="Profile"
                        isActive={activeTab === 'profile'}
                        onClick={() => setActiveTab('profile')}
                    />
                    <TabButton
                        title="Security"
                        isActive={activeTab === 'security'}
                        onClick={() => setActiveTab('security')}
                    />
                    <TabButton
                        title="My Plan"
                        isActive={activeTab === 'plan'}
                        onClick={() => setActiveTab('plan')}
                    />
                </nav>
                <div className="p-8">
                    {renderTabContent()}
                </div>
            </div>
        </div>
    );
};

interface TabButtonProps {
    title: string;
    isActive: boolean;
    onClick: () => void;
}

const TabButton: React.FC<TabButtonProps> = ({ title, isActive, onClick }) => {
    return (
        <button
            onClick={onClick}
            className={`py-4 px-6 font-semibold transition-colors ${
                isActive
                    ? 'text-sky-400 border-b-2 border-sky-400'
                    : 'text-slate-400 hover:bg-slate-700/50 hover:text-white'
            }`}
        >
            {title}
        </button>
    );
};

export default ProfilePage;