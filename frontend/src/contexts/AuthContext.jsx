// src/contexts/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

// ============================================
// API CONFIGURATION
// ============================================
const API_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
    baseURL: API_URL,
    headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    timeout: 10000 // 10 seconds timeout
});

// ============================================
// REQUEST INTERCEPTOR - Add Token to Headers
// ============================================
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// ============================================
// RESPONSE INTERCEPTOR - Handle Token Expiry
// ============================================
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// ============================================
// AUTH PROVIDER
// ============================================
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [authError, setAuthError] = useState(null);

    // ============================================
    // CHECK AUTHENTICATION ON MOUNT
    // ============================================
    useEffect(() => {
        checkAuth();
    }, []);

    // ============================================
    // CHECK AUTH FUNCTION
    // ============================================
    const checkAuth = async () => {
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        
        if (token && storedUser) {
            try {
                // Verify token with backend
                const response = await api.get('/auth/me');
                const userData = response.data;
                
                // If user is an object, set it
                if (userData && typeof userData === 'object') {
                    setUser(userData);
                    setIsAuthenticated(true);
                    localStorage.setItem('user', JSON.stringify(userData));
                } else {
                    // If response is not an object, use stored user
                    const parsedUser = JSON.parse(storedUser);
                    setUser(parsedUser);
                    setIsAuthenticated(true);
                }
            } catch (error) {
                console.error('Auth check failed:', error);
                // If token is invalid, clear storage
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                setUser(null);
                setIsAuthenticated(false);
                setAuthError('Session expired. Please login again.');
            }
        } else {
            // No token found
            setUser(null);
            setIsAuthenticated(false);
        }
        setLoading(false);
    };

    // ============================================
    // LOGIN FUNCTION
    // ============================================
    const login = async (username, password) => {
        setLoading(true);
        setAuthError(null);
        
        try {
            // Validate input
            if (!username || !password) {
                return {
                    success: false,
                    error: 'Username and password are required'
                };
            }

            // Make API call
            const response = await api.post('/auth/login', { 
                username: username.trim(), 
                password: password 
            });
            
            const { token, user: userData } = response.data;

            // Validate response
            if (!token || !userData) {
                return {
                    success: false,
                    error: 'Invalid response from server'
                };
            }

            // Ensure user has role
            const userWithRole = {
                ...userData,
                role: userData.role || 'EMPLOYEE' // Default role if not provided
            };

            // Store in localStorage
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(userWithRole));

            // Update state
            setUser(userWithRole);
            setIsAuthenticated(true);
            
            // Return success with user data
            return { 
                success: true, 
                user: userWithRole 
            };

        } catch (error) {
            console.error('Login error:', error);
            
            // Handle different error types
            let errorMessage = 'Login failed. Please try again.';
            
            if (error.response) {
                // Server responded with error
                errorMessage = error.response.data?.error || 
                              error.response.data?.message || 
                              'Invalid credentials. Please try again.';
                
                // Handle specific status codes
                if (error.response.status === 401) {
                    errorMessage = 'Invalid username or password';
                } else if (error.response.status === 404) {
                    errorMessage = 'User not found';
                } else if (error.response.status === 500) {
                    errorMessage = 'Server error. Please try again later.';
                }
            } else if (error.request) {
                // Request made but no response
                errorMessage = 'No response from server. Please check your connection.';
            } else if (error.code === 'ECONNABORTED') {
                errorMessage = 'Request timeout. Please try again.';
            }

            setAuthError(errorMessage);
            return {
                success: false,
                error: errorMessage
            };
        } finally {
            setLoading(false);
        }
    };

    // ============================================
    // LOGOUT FUNCTION
    // ============================================
    const logout = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    // Notify backend about logout
                    await api.post('/auth/logout');
                } catch (error) {
                    console.error('Logout API error:', error);
                }
            }
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            // Clear all storage
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            
            // Reset state
            setUser(null);
            setIsAuthenticated(false);
            setLoading(false);
        }
    };

    // ============================================
    // REGISTER FUNCTION
    // ============================================
    const register = async (username, password, role = 'EMPLOYEE', fullName = null, email = null) => {
        setLoading(true);
        setAuthError(null);
        
        try {
            if (!username || !password) {
                return {
                    success: false,
                    error: 'Username and password are required'
                };
            }

            if (password.length < 6) {
                return {
                    success: false,
                    error: 'Password must be at least 6 characters'
                };
            }

            const response = await api.post('/auth/register', {
                username: username.trim(),
                password,
                role,
                fullName,
                email
            });

            return {
                success: true,
                data: response.data,
                message: 'Registration successful! Please login.'
            };

        } catch (error) {
            console.error('Registration error:', error);
            
            let errorMessage = 'Registration failed. Please try again.';
            
            if (error.response?.data?.error) {
                errorMessage = error.response.data.error;
            } else if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            }

            setAuthError(errorMessage);
            return {
                success: false,
                error: errorMessage
            };
        } finally {
            setLoading(false);
        }
    };

    // ============================================
    // UPDATE USER FUNCTION
    // ============================================
    const updateUser = async (userData) => {
        try {
            const response = await api.put('/auth/update', userData);
            const updatedUser = response.data;
            
            // Update state and storage
            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));
            
            return {
                success: true,
                user: updatedUser
            };
        } catch (error) {
            console.error('Update user error:', error);
            return {
                success: false,
                error: error.response?.data?.error || 'Failed to update user'
            };
        }
    };

    // ============================================
    // GET USER ROLE
    // ============================================
    const getUserRole = () => {
        return user?.role || 'EMPLOYEE';
    };

    // ============================================
    // CHECK IF USER IS ADMIN
    // ============================================
    const isAdmin = () => {
        return user?.role === 'ADMIN';
    };

    // ============================================
    // CHECK IF USER IS EMPLOYEE
    // ============================================
    const isEmployee = () => {
        return user?.role === 'EMPLOYEE';
    };

    // ============================================
    // CONTEXT VALUE
    // ============================================
    const contextValue = {
        // State
        user,
        isAuthenticated,
        loading,
        authError,
        
        // Functions
        login,
        logout,
        register,
        checkAuth,
        updateUser,
        
        // Helpers
        getUserRole,
        isAdmin,
        isEmployee,
        
        // Axios instance
        api
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

// ============================================
// CUSTOM HOOK - useAuth
// ============================================
export const useAuth = () => {
    const context = useContext(AuthContext);
    
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    
    return context;
};

// ============================================
// EXPORT API INSTANCE FOR DIRECT USE
// ============================================
export { api };