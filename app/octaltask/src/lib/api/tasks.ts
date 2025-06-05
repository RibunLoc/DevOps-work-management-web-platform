import axios from 'axios';
import Cookies from 'js-cookie';
import { CardTitle } from '@/components/ui/card';

const API_BASE = import.meta.env.VITE_API_BASE; 

// List handle 
export const createList = async (name: string, icon: string, color: string) => {
  try {
    const token = Cookies.get('token');
    if (!token) throw new Error('No token found');

    const currentDate = new Date().toISOString(); // lấy ngày hệ thống hiện tại

    const res = await axios.post(
      `${API_BASE}/lists`, // endpoint 
      {
        name,
        icon,
        color,
        dueDate: currentDate // gửi ngày hiện tại làm dueDate
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;
  } catch (err: any) {
    throw err.response?.data || err;
  }
};


export const getLists = async () => {
  try {
    const token = Cookies.get('token');
    if (!token) throw new Error('No token found');

    console.log(token);
    const res = await axios.get(`${API_BASE}/lists`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  } catch (err: any) {
    throw err.response?.data || err;
  }
};

export const getListsById = async (id: string) => {
  try {
    const token = Cookies.get('token');
    if (!token) throw new Error('No token found');

    console.log(token);
    const res = await axios.get(`${API_BASE}/lists/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  } catch (err: any) {
    throw err.response?.data || err;
  }
};

export const deleteListById = async (id: string | number) => {
  try {
    const token = Cookies.get('token');
    if (!token) throw new Error('No token found');

    const res = await axios.delete(`${API_BASE}/lists/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  } catch (err: any) {
    throw err.response?.data || err;
  }
};

export const updateListById = async (
  id: string | number,
  updates: {
    name?: string;
    icon?: string;
    color?: string;
  }
) => {
  try {
    const token = Cookies.get('token');
    if (!token) throw new Error('No token found');

    const res = await axios.patch(
      `${API_BASE}/lists/${id}`,
      updates,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;
  } catch (err: any) {
    throw err.response?.data || err;
  }
};

// Task handle

const formatDueDate = (dateStr: string): string => {
  const date = new Date(`${dateStr}T23:59:59+07:00`);
  return date.toISOString(); // 2025-06-01T16:59:59.000Z
};


export const createTask = async (
  title: string,
  listId: string,
  description: string = '',
  dueDate?: string
) => {
  try {
    const token = Cookies.get('token');
    if (!token) throw new Error('No token found');

    const formattedDueDate = dueDate ? formatDueDate(dueDate) : null;

    const res = await axios.post(
      `${API_BASE}/tasks`,
      {
        title,
        description,
        isCompleted: false,
        dueDate: formattedDueDate || null,
        listId: parseInt(listId),
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;
  } catch (err: any) {
    throw err.response?.data || err;
  }
};

export const getTasks = async () => {
  try {
    const token = Cookies.get('token');
    if (!token) throw new Error('No token found');

    const res = await axios.get(`${API_BASE}/tasks`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return res.data;
  } catch (err: any) {
    throw err.response?.data || err;
  }
};

export const getTaskById = async (id: string) => {
  try {
    const token = Cookies.get('token');
    if (!token) throw new Error('No token found');

    const res = await axios.get(`${API_BASE}/tasks/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return res.data;
  } catch (err: any) {
    throw err.response?.data || err;
  }
};

export const deleteTaskById = async (id: string | number) => {
  try {
    const token = Cookies.get('token');
    if (!token) throw new Error('No token found');

    const res = await axios.delete(`${API_BASE}/tasks/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return res.data;
  } catch (err: any) {
    throw err.response?.data || err;
  }
};

export const updateTaskById = async (
  id: string | number,
  updates: {
    title?: string;
    description?: string;
    isCompleted?: boolean;
    dueDate?: string;
    listId?: string | number;
  }
) => {
  try {
    const token = Cookies.get('token');
    if (!token) throw new Error('No token found');

    const formattedUpdates = {
      ...updates,
      dueDate: updates.dueDate ? formatDueDate(updates.dueDate) : undefined,
    };


    const res = await axios.patch(
      `${API_BASE}/tasks/${id}`,
       formattedUpdates,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;
  } catch (err: any) {
    throw err.response?.data || err;
  }
};

// Subtasks handle
export const getSubtasksByTaskId = async (taskId: number | string) => {
  const token = Cookies.get('token');
  if (!token) throw new Error('No token found');

  const res = await axios.get(`${API_BASE}/tasks/${taskId}/subtasks`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  return res.data;
};

// Comments handle
export const getCommentsByTaskId = async (taskId: number | string) => {
  const token = Cookies.get('token');
  if (!token) throw new Error('No token found');

  const res = await axios.get(`${API_BASE}/tasks/${taskId}/comments`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  return res.data;
};