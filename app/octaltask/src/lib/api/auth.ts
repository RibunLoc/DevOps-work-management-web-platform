// src/lib/api/auth.ts
import axios from 'axios';
import Cookies from 'js-cookie';

// const API_BASE = import.meta.env.VITE_API_BASE; // Đổi URL khi deploy
const getApiBase = () => window.__ENV__?.VITE_API_BASE || "http://localhost:3000"; // URL dành cho nginx 

export const login = async (email: string, password: string) => {
  const API_BASE = getApiBase();
  try {
    const res = await axios.post(`${API_BASE}/auth/login`, { email, password });
    return res.data;
  } catch (err: any) {
    throw err.response?.data || err;
  }
};

export const signup = async (email: string, password: string,name: string) => {
  const API_BASE = getApiBase();
  try {
    console.log(API_BASE);
    const res = await axios.post(`${API_BASE}/auth/signup`, { email, password, name });
    return res.data;
  } catch (err: any) {
    throw err.response?.data || err;
  }
};

export const forgotPassword = async (email: string) => {
  const API_BASE = getApiBase();
  try {
    const res = await axios.post(`${API_BASE}/auth/forgot-password`, { email });
    return res.data;
  } catch (err: any) {
    throw err.response?.data || err;
  }
};

export const resetPassword = async (token: string, password: string) => {
  const API_BASE = getApiBase();
  try {
    const res = await axios.post(`${API_BASE}/auth/reset-password`, { token, password });
    return res.data;
  } catch (err: any) {
    throw err.response?.data || err;
  }
};

export const authInformation = async () => {
  try {
    const token = Cookies.get('token');
    if (!token) throw new Error('No token found');

    console.log(token);
    const res = await axios.get(`${API_BASE}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  } catch (err: any) {
    throw err.response?.data || err;
  }
};
