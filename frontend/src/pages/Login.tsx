import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Mail, Lock, Loader2, AlertCircle, TrendingUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { loginUser } from '../services/auth';

export const Login = () => {
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
      const response = await loginUser(data);
      login(response.user, response.token);
      navigate('/dashboard', { replace: true });
    } catch (error: any) {
      setServerError(
        error.response?.data?.message || 'Failed to connect to the server. Please try again.'
      );
    }
  };

  return (
    <div className="min-h-screen w-full lg:grid lg:grid-cols-2 bg-white">
      
      {/* Left Form Section */}
      <div className="flex flex-col justify-center items-center px-6 py-12 lg:px-12 xl:px-24">
        <div className="w-full max-w-md">
          
          {/* Logo & Header */}
          <div className="mb-10">
            <div className="flex items-center gap-2 text-blue-600 mb-6">
              <TrendingUp className="h-8 w-8" />
              <span className="text-2xl font-extrabold tracking-tight text-gray-900">Smart Leads</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Welcome back</h2>
            <p className="mt-2 text-sm text-gray-600">
              Don't have an account?{' '}
              <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
                Sign up for access
              </Link>
            </p>
          </div>

          {/* Server Error Alert */}
          {serverError && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-md flex items-start shadow-sm">
              <AlertCircle className="h-5 w-5 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800 font-medium">{serverError}</p>
            </div>
          )}

          {/* Form */}
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  className={`block w-full pl-10 pr-3 py-2.5 border ${
                    errors.email ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent'
                  } rounded-lg shadow-sm sm:text-sm outline-none transition-all duration-200 bg-gray-50 focus:bg-white`}
                  placeholder="admin@example.com"
                  {...register('email', { 
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  })}
                />
              </div>
              {errors.email && (
                <p className="mt-1.5 text-sm text-red-600 font-medium flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" /> {errors.email.message as string}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  className={`block w-full pl-10 pr-3 py-2.5 border ${
                    errors.password ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent'
                  } rounded-lg shadow-sm sm:text-sm outline-none transition-all duration-200 bg-gray-50 focus:bg-white`}
                  placeholder="••••••••"
                  {...register('password', { 
                    required: 'Password is required',
                    minLength: { value: 6, message: 'Password must be at least 6 characters' }
                  })}
                />
              </div>
              {errors.password && (
                <p className="mt-1.5 text-sm text-red-600 font-medium flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" /> {errors.password.message as string}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-md text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200 mt-4"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin h-5 w-5 mr-2" />
                  Authenticating...
                </>
              ) : (
                'Sign In to Dashboard'
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Right Image Section */}
      <div className="hidden lg:block relative bg-slate-900">
        <img
          className="absolute inset-0 h-full w-full object-cover"
          src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop"
          alt="Dashboard analytics background"
          crossOrigin="anonymous"
        />
        
        {/* Navy blue gradient overlay so the image isn't too bright and the text is readable */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-slate-900/20" />
        
        {/* Overlay Text */}
        <div className="absolute bottom-16 left-16 right-16">
          <div className="max-w-lg">
            <h3 className="text-3xl font-bold text-white mb-4">Supercharge your sales pipeline.</h3>
            <p className="text-slate-200 text-lg leading-relaxed">
              Manage leads, track conversions, and analyze your team's performance all in one highly optimized dashboard.
            </p>
          </div>
        </div>
      </div>
      
    </div>
  );
};