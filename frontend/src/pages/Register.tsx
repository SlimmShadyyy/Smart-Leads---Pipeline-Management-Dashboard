import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Mail, Lock, User, Loader2, AlertCircle, TrendingUp, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { registerUser } from '../services/auth';

export const Register = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data: any) => {
    setServerError(null);
    try {
      const response = await registerUser(data);
      // Automatically log the user in after successful registration
      login(response.user, response.token);
      navigate('/dashboard', { replace: true });
    } catch (error: any) {
      setServerError(
        error.response?.data?.message || 'Registration failed. Please try again.'
      );
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-slate-50 p-4">
      
      {/* Pure CSS Glowing Orbs (Same as Login for consistency) */}
      <div className="absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-blue-400/40 rounded-full blur-[120px] mix-blend-multiply pointer-events-none" />
      <div className="absolute top-[10%] right-[-10%] w-[35rem] h-[35rem] bg-purple-400/40 rounded-full blur-[120px] mix-blend-multiply pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[15%] w-[45rem] h-[45rem] bg-indigo-300/40 rounded-full blur-[120px] mix-blend-multiply pointer-events-none" />

      {/* Floating Glassmorphism Card */}
      <div className="relative z-10 w-full max-w-[420px] bg-white/70 backdrop-blur-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] ring-1 ring-white/50 rounded-3xl p-8 sm:p-10 my-8">
        
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center gap-2 text-blue-600 mb-4 bg-blue-50 py-2 px-4 rounded-2xl ring-1 ring-blue-100">
            <TrendingUp className="h-6 w-6" />
            <span className="text-xl font-bold tracking-tight text-gray-900">Smart Leads</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Create an account</h2>
          <p className="mt-2 text-sm text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-500 transition-colors">
              Sign in
            </Link>
          </p>
        </div>

        {/* Server Error Alert */}
        {serverError && (
          <div className="mb-6 bg-red-50/80 backdrop-blur-sm border-l-4 border-red-500 p-4 rounded-r-xl flex items-start shadow-sm">
            <AlertCircle className="h-5 w-5 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-800 font-medium">{serverError}</p>
          </div>
        )}

        {/* Form */}
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          
          {/* Full Name Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1 ml-1">Full Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className={`block w-full pl-11 pr-4 py-3 border ${
                  errors.name ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                } rounded-xl shadow-sm sm:text-sm outline-none transition-all duration-200 bg-white/50 focus:bg-white`}
                placeholder="John Doe"
                {...register('name', { required: 'Name is required' })}
              />
            </div>
            {errors.name && <p className="mt-1.5 ml-1 text-sm text-red-600 font-medium">{errors.name.message as string}</p>}
          </div>

          {/* Email Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1 ml-1">Email address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                className={`block w-full pl-11 pr-4 py-3 border ${
                  errors.email ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                } rounded-xl shadow-sm sm:text-sm outline-none transition-all duration-200 bg-white/50 focus:bg-white`}
                placeholder="john@example.com"
                {...register('email', { 
                  required: 'Email is required',
                  pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Invalid email address' }
                })}
              />
            </div>
            {errors.email && <p className="mt-1.5 ml-1 text-sm text-red-600 font-medium">{errors.email.message as string}</p>}
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1 ml-1">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="password"
                className={`block w-full pl-11 pr-4 py-3 border ${
                  errors.password ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                } rounded-xl shadow-sm sm:text-sm outline-none transition-all duration-200 bg-white/50 focus:bg-white`}
                placeholder="••••••••"
                {...register('password', { 
                  required: 'Password is required',
                  minLength: { value: 6, message: 'Password must be at least 6 characters' }
                })}
              />
            </div>
            {errors.password && <p className="mt-1.5 ml-1 text-sm text-red-600 font-medium">{errors.password.message as string}</p>}
          </div>

          {/* Role Selection (Crucial for Assignment Requirements) */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1 ml-1">Account Role</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Shield className="h-5 w-5 text-gray-400" />
              </div>
              <select
                className="block w-full pl-11 pr-4 py-3 border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent rounded-xl shadow-sm sm:text-sm outline-none transition-all duration-200 bg-white/50 focus:bg-white appearance-none"
                {...register('role')}
                defaultValue="Sales User"
              >
                <option value="Sales User">Sales User</option>
                <option value="Admin">Admin</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center items-center py-3 px-4 mt-6 rounded-xl shadow-md text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin h-5 w-5 mr-2" />
                Creating account...
              </>
            ) : (
              'Sign Up'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};