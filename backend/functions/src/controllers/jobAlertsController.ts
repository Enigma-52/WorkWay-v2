import { Request, Response , NextFunction } from 'express';
import * as jobAlertsService from '../services/jobAlertsService.js';

// Mock database
let mockAlerts = [
  {
    id: 1,
    title: "Senior React Developer",
    location: "Remote",
    frequency: "Daily",
    domains: ["Frontend", "Full-stack"],
    active: true,
    userId: "user123"
  },
  {
    id: 2,
    title: "DevOps Engineer",
    location: "New York",
    frequency: "Weekly",
    domains: ["DevOps"],
    active: true,
    userId: "user123"
  },
  {
    id: 3,
    title: "Data Scientist",
    location: "San Francisco",
    frequency: "Monthly",
    domains: ["Data Science"],
    active: true,
    userId: "user456"
  }
];

export const listJobAlerts = async (req: Request, res: Response, ) => {
  try {
    console.log("Hello");
    // Filter alerts for the specific user
    const userAlerts = mockAlerts;

    console.log(userAlerts);
        
    res.status(200).json(userAlerts);
  } catch (error) {
    console.error('Error in listJobAlerts:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const addJobAlert = async (req: Request, res: Response) => {
  try {
    const { title, location, frequency, domains } = req.body;
    const userId = req.headers['user-id'] as string; // Assuming user-id is passed in headers
    
    // Validate required fields
    if (!title || !domains || domains.length === 0) {
       res.status(400).json({ error: 'Title and at least one domain are required' });
    }
    
    // Create new alert
    const newAlert = {
      id: mockAlerts.length + 1,
      title,
      location,
      frequency,
      domains,
      active: true,
      userId
    };
    
    // Add to mock database
    mockAlerts.push(newAlert);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
     res.status(201).json(newAlert);
  } catch (error) {
    console.error('Error in addJobAlert:', error);
     res.status(500).json({ error: 'Internal server error' });
  }
};

// First, let's properly type the request handler
export const updateJobAlert = async (
    req: Request, 
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const alertId = parseInt(req.params.id);
      const updates = req.body;
      const userId = req.headers['user-id'] as string;
      
      // Find alert index
      const alertIndex = mockAlerts.findIndex(
        alert => alert.id === alertId && alert.userId === userId
      );
      
      if (alertIndex === -1) {
        res.status(404).json({ error: 'Alert not found' });
        return;
      }
      
      // Update alert
      mockAlerts[alertIndex] = {
        ...mockAlerts[alertIndex],
        ...updates,
        id: alertId, // Preserve the ID
        userId: userId // Preserve the user ID
      };
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      res.status(200).json(mockAlerts[alertIndex]);
    } catch (error) {
      console.error('Error in updateJobAlert:', error);
      next(error); // Pass errors to Express error handler
    }
  };
  

export const deleteJobAlert = async (req: Request, res: Response) => {
  try {
    const alertId = parseInt(req.params.id);
    const userId = req.headers['user-id'] as string;
    
    // Find alert index
    const alertIndex = mockAlerts.findIndex(
      alert => alert.id === alertId && alert.userId === userId
    );
    
    if (alertIndex === -1) {
       res.status(404).json({ error: 'Alert not found' });
    }
    
    // Remove alert
    mockAlerts = mockAlerts.filter(alert => alert.id !== alertId);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
     res.status(200).json({ message: 'Alert deleted successfully' });
  } catch (error) {
    console.error('Error in deleteJobAlert:', error);
     res.status(500).json({ error: 'Internal server error' });
  }
};

export const dailyJobAlert = async (req: Request, res: Response) => {
}
export const weeklyJobAlert = async (req: Request, res: Response) => {
}
export const monthlyJobAlert = async (req: Request, res: Response) => {
}