// File: pages/api/todo/index.ts
import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

const API_URL = 'https://todo-list-r2os.onrender.com/todo';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Handle GET requests (fetching todos)
    if (req.method === 'GET') {
      const { status, title, limit } = req.query;
      
      const queryParams = new URLSearchParams();
      if (status !== undefined) queryParams.append('status', String(status));
      if (title) queryParams.append('title', String(title));
      if (limit) queryParams.append('limit', String(limit));
      
      const queryString = queryParams.toString();
      const url = `${API_URL}${queryString ? '?' + queryString : ''}`;
      
      const response = await axios.get(url);
      return res.status(200).json(response.data);
    }
    
    // Handle POST requests (creating todos)
    else if (req.method === 'POST') {
      const response = await axios.post(API_URL, req.body);
      return res.status(201).json(response.data);
    }
    
    // Method not allowed
    else {
      return res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('API proxy error:', error);
    
    // Type guard to check if error is an AxiosError
    if (axios.isAxiosError(error)) {
      return res.status(error.response?.status || 500).json({ 
        message: error.message,
        details: error.response?.data || 'Internal server error'
      });
    }
    
    // Handle generic errors
    return res.status(500).json({ 
      message: error instanceof Error ? error.message : 'Unknown error',
      details: 'Internal server error'
    });
  }
}
