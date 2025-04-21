
// File: pages/api/todo/[id].ts
import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

const API_BASE_URL = 'https://todo-list-r2os.onrender.com/todo';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  
  if (!id) {
    return res.status(400).json({ message: 'Todo ID is required' });
  }
  
  const url = `${API_BASE_URL}/${id}`;
  
  try {
    // Handle GET requests (get a specific todo)
    if (req.method === 'GET') {
      const response = await axios.get(url);
      return res.status(200).json(response.data);
    }
    
    // Handle PUT requests (update a todo)
    else if (req.method === 'PUT') {
      const response = await axios.put(url, req.body);
      return res.status(200).json(response.data);
    }
    
    // Handle DELETE requests (delete a todo)
    else if (req.method === 'DELETE') {
      const response = await axios.delete(url);
      return res.status(200).json(response.data);
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