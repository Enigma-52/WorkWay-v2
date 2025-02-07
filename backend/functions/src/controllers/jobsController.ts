import { Request, Response } from 'express';
import { fetchAllJobs } from '../services/jobService.js';
import { fetchAllTestJobs } from '../services/jobService.js';

export const getAllJobs = async (req: Request, res: Response) => {
    try {
        // Get pagination parameters from query string
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 100;

        // Validate pagination parameters
        if (page < 1 || limit < 1 || limit > 500) {
            return res.status(400).json({
                error: 'Invalid pagination parameters. Page must be >= 1 and limit must be between 1 and 500'
            });
        }

        const { jobs, meta } = await fetchAllJobs();
        
        res.json({ 
            jobs, 
            meta: {
                ...meta,
                page,
                limit
            }
        });
    } catch (error) {
        console.error('Error in getAllJobs controller:', error);
        res.status(500).json({ error: 'Failed to fetch jobs' });
    }
};

export const getAllTestJobs = async (req: Request, res: Response) => {
    try {
        // Get pagination parameters from query string
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 100;

        console.log("HELLOOO")

        // Validate pagination parameters
        if (page < 1 || limit < 1 || limit > 500) {
            return res.status(400).json({
                error: 'Invalid pagination parameters. Page must be >= 1 and limit must be between 1 and 500'
            });
        }

        const { jobs, meta } = await fetchAllTestJobs();
        
        res.json({ 
            jobs, 
            meta: {
                ...meta,
                page,
                limit
            }
        });
    } catch (error) {
        console.error('Error in getAllJobs controller:', error);
        res.status(500).json({ error: 'Failed to fetch jobs' });
    }
};