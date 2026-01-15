import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Loader2, CheckCircle, Eye, EyeOff } from 'lucide-react'; // Import Eye icons

export default function UpdatePassword() {
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false); // New state
    const [loading, setLoading] = useState(false);
    const { updatePassword } = useAuth();

    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { error } = await updatePassword(password);
            if (error) throw error;
            alert("Password updated successfully! Redirecting...");
        } catch (error) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
            <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full border border-slate-200">
                <div className="flex justify-center mb-4 text-indigo-600">
                    <CheckCircle size={48} />
                </div>
                <h2 className="text-2xl font-bold mb-2 text-center text-slate-900">Reset Your Password</h2>
                <p className="text-slate-500 mb-6 text-sm text-center">Enter your new password below to recover your account.</p>
                
                <form onSubmit={handleUpdate} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">New Password</label>
                        <div className="relative">
                            <input 
                                type={showPassword ? "text" : "password"} 
                                required
                                minLength={6}
                                placeholder="••••••••" 
                                className="w-full p-2 pr-10 border border-slate-200 rounded-lg outline-none focus:border-indigo-500"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                            />
                            {/* Toggle Button */}
                            <button 
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>
                    <button disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-lg flex justify-center items-center">
                        {loading ? <Loader2 className="animate-spin" size={20}/> : 'Update Password'}
                    </button>
                </form>
            </div>
        </div>
    );
}