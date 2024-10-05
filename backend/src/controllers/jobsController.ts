import { Request, Response } from 'express';
import { fetchAllJobs } from '../services/jobService';

export const getAllJobs = async (req: Request, res: Response) => {
    try {
        const { jobs, meta } = await fetchAllJobs();
        res.json({ jobs, meta });
    } catch (error) {
        console.error('Error in getAllJobs controller:', error);
        res.status(500).json({ error: 'Failed to fetch jobs' });
    }
};