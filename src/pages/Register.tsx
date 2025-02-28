import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { MessageCircle, UserPlus, AlertCircle, CheckCircle } from 'lucide-react';

const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }
    
    setError('');
    setLoading(true);
    
    try {
      const { error } = await signUp(email, password);
      if (error) throw error;
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to create an account');
    } finally {
      setLoading(false);
    }
  };

  // Password strength checker
  const getPasswordStrength = (password: string) => {
    if (!password) return 0;
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    return strength;
  };

  const passwordStrength = getPasswordStrength(password);

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center justify-center">
            <MessageCircle className="h-10 w-10 text-indigo-600" />
          </Link>
          <h1 className="text-2xl font-bold mt-4 text-gray-900">Create your account</h1>
          <p className="text-gray-600 mt-2">Get started with Widget Chat</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-soft p-8 border border-gray-100">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-md flex items-start">
              <AlertCircle className="h-5 w-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="form-label" htmlFor="email">
                Email address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                placeholder="you@example.com"
                required
              />
            </div>
            
            <div>
              <label className="form-label" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
                placeholder="••••••••"
                required
              />
              
              {password && (
                <div className="mt-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-500">Password strength:</span>
                    <span className="text-xs font-medium">
                      {passwordStrength === 0 && 'Very weak'}
                      {passwordStrength === 1 && 'Weak'}
                      {passwordStrength === 2 && 'Medium'}
                      {passwordStrength === 3 && 'Strong'}
                      {passwordStrength === 4 && 'Very strong'}
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${
                        passwordStrength === 0 ? 'bg-red-500 w-1/5' :
                        passwordStrength === 1 ? 'bg-orange-500 w-2/5' :
                        passwordStrength === 2 ? 'bg-yellow-500 w-3/5' :
                        passwordStrength === 3 ? 'bg-lime-500 w-4/5' :
                        'bg-green-500 w-full'
                      }`}
                    ></div>
                  </div>
                  
                  <ul className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1">
                    <li className="flex items-center text-xs">
                      {password.length >= 8 ? (
                        <CheckCircle className="h-3 w-3 text-green-500 mr-1 flex-shrink-0" />
                      ) : (
                        <div className="h-3 w-3 border border-gray-300 rounded-full mr-1 flex-shrink-0"></div>
                      )}
                      <span className={password.length >= 8 ? "text-gray-700" : "text-gray-500"}>
                        8+ characters
                      </span>
                    </li>
                    <li className="flex items-center text-xs">
                      {/[A-Z]/.test(password) ? (
                        <CheckCircle className="h-3 w-3 text-green-500 mr-1 flex-shrink-0" />
                      ) : (
                        <div className="h-3 w-3 border border-gray-300 rounded-full mr-1 flex-shrink-0"></div>
                      )}
                      <span className={/[A-Z]/.test(password) ? "text-gray-700" : "text-gray-500"}>
                        Uppercase letter
                      </span>
                    </li>
                    <li className="flex items-center text-xs">
                      {/[0-9]/.test(password) ? (
                        <CheckCircle className="h-3 w-3 text-green-500 mr-1 flex-shrink-0" />
                      ) : (
                        <div className="h-3 w-3 border border-gray-300 rounded-full mr-1 flex-shrink-0"></div>
                      )}
                      <span className={/[0-9]/.test(password) ? "text-gray-700" : "text-gray-500"}>
                        Number
                      </span>
                    </li>
                    <li className="flex items-center text-xs">
                      {/[^A-Za-z0-9]/.test(password) ? (
                        <CheckCircle className="h-3 w-3 text-green-500 mr-1 flex-shrink-0" />
                      ) : (
                        <div className="h-3 w-3 border border-gray-300 rounded-full mr-1 flex-shrink-0"></div>
                      )}
                      <span className={/[^A-Za-z0-9]/.test(password) ? "text-gray-700" : "text-gray-500"}>
                        Special character
                      </span>
                    </li>
                  </ul>
                </div>
              )}
            </div>
            
            <div>
              <label className="form-label" htmlFor="confirm-password">
                Confirm Password
              </label>
              <input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`form-input ${
                  confirmPassword && password !== confirmPassword 
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                    : ''
                }`}
                placeholder="••••••••"
                required
              />
              {confirmPassword && password !== confirmPassword && (
                <p className="mt-1 text-xs text-red-600">Passwords do not match</p>
              )}
            </div>
            
            <button
              type="submit"
              disabled={loading || (confirmPassword && password !== confirmPassword)}
              className="btn-primary w-full py-2.5"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating account...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Create account
                </span>
              )}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-indigo-600 hover:text-indigo-500 font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <Link to="/" className="text-sm text-gray-600 hover:text-gray-900">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;