import { NextFunction, Request, Response } from 'express';
import * as applicationService from '../services/applicationService.js';

export const listApplications = async (req: Request, res: Response) => {
}

export const updateApplication = async (req: Request, res: Response) => {
}

export const addApplication = async (
    req: Request,
    res: Response,
    _next: NextFunction
)=> {
    try {
        const { job, user, status } = req.body;

        // Input validation
        if (!job || !user) {
            res.status(400).json({
                success: false,
                message: 'Job and user information are required'
            });
        }

        console.log(user);

        // Default status to "applied" if not provided
        const applicationStatus = status || 'applied';

        // Call service layer to create application
        const newApplication = await applicationService.createApplication({
            job,
            user,
            status: applicationStatus
        });

        // Return success response
        res.status(201).json({
            success: true,
            message: 'Application submitted successfully',
            data: newApplication
        });

    } catch (error) {
        // Log the error for debugging (you should use a proper logging system)
        console.error('Error in addApplication controller:', error);

        // Return error response
        res.status(500).json({
            success: false,
            message: 'Error submitting application',
            error: process.env.NODE_ENV === 'development' ? error : undefined
        });
    }
};