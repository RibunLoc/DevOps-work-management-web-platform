import axios from 'axios';
import Cookies from 'js-cookie';
//import { CardTitle } from '@/components/ui/card';
 
const getApiBase = () => window.__ENV__?.VITE_API_BASE || "http://localhost:3000"; // URL dành cho nginx

// List handle 
export const createList = async (name: string, icon: string, color: string) => {
  try {
    const token = Cookies.get('token');
    const API_BASE = getApiBase();
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
    const API_BASE = getApiBase();
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
    const API_BASE = getApiBase();
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
    const API_BASE = getApiBase();
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
    const API_BASE = getApiBase();
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
    const API_BASE = getApiBase();
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
        listId: parseInt(listId)
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
    const API_BASE = getApiBase();
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
    const API_BASE = getApiBase();
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
    const API_BASE = getApiBase();
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
    isStarred?: boolean;
    dueDate?: string;
    listId?: number | string;
  }
) => {
  try {
    const API_BASE = getApiBase();
    const token = Cookies.get('token');
    if (!token) throw new Error('No token found');
    const formatted = {
        ...updates,
        listId: updates.listId ? parseInt(updates.listId.toString(), 10) : undefined,
      };
    const res = await axios.patch(
      `${API_BASE}/tasks/${id}`,
      formatted, 
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
  const API_BASE = getApiBase();
  const token = Cookies.get('token');
  if (!token) throw new Error('No token found');

  const res = await axios.get(`${API_BASE}/tasks/${taskId}/subtasks`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  return res.data;
};

export const createSubtaskByTaskId = async (taskId: string | number, content: string, isCompleted = false) => {
  const API_BASE = getApiBase();
  const token = Cookies.get('token');
  if (!token) throw new Error('No token found');

  const res = await axios.post(
    `${API_BASE}/tasks/${taskId}/subtasks`,
    { content, isCompleted },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};

export const deleteSubtaskById = async (subtaskId: string | number) => {
  const API_BASE = getApiBase();
  const token = Cookies.get('token');
  if (!token) throw new Error('No token found');

  const res = await axios.delete(`${API_BASE}/subtasks/${subtaskId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};


// Comments handle
export const getCommentsByTaskId = async (taskId: number | string) => {
  const API_BASE = getApiBase();
  const token = Cookies.get('token');
  if (!token) throw new Error('No token found');

  const res = await axios.get(`${API_BASE}/tasks/${taskId}/comments`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  return res.data;
};

export const createComment = async (taskId: string, content: string) => {
  const API_BASE = getApiBase();
  const token = Cookies.get('token');
  if (!token) throw new Error('No token found');

  const res = await axios.post(
    `${API_BASE}/tasks/${taskId}/comments`,
    { content },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};

export const deleteCommentById = async (commentId: string) => {
  const API_BASE = getApiBase();
  const token = Cookies.get('token');
  if (!token) throw new Error('No token found');

  const res = await axios.delete(`${API_BASE}/comments/${commentId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

// Star/Unstar task
export const toggleStarTask = async (taskId: string | number, isStarred: boolean) => {
  try {
    const token = Cookies.get('token');
    if (!token) throw new Error('No token found');

    const res = await axios.patch(
      `${API_BASE}/tasks/${taskId}`,
      { isStarred },
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

// Complete/Uncomplete task
export const toggleCompleteTask = async (taskId: string | number, isCompleted: boolean) => {
  try {
    const token = Cookies.get('token');
    if (!token) throw new Error('No token found');

    const res = await axios.patch(
      `${API_BASE}/tasks/${taskId}`,
      { isCompleted },
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