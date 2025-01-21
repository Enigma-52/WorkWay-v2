import { NextFunction, Request, Response } from 'express';
import * as applicationService from '../services/applicationService.js';
export const getUserApplications = async (
    req: Request,
    res: Response,
    _next: NextFunction
): Promise<void> => {
    try {
        const { userId } = req.params;

        if (!userId) {
            res.status(400).json({
                success: false,
                message: 'User ID is required'
            });
        }

        const applications = await applicationService.getUserApplications(userId);

        res.status(200).json({
            success: true,
            message: 'Applications retrieved successfully',
            data: applications
        });

    } catch (error) {
        console.error('Error in getUserApplications controller:', error);
        res.status(500).json({
            success: false,
            message: 'Error retrieving applications',
            error: process.env.NODE_ENV === 'development' ? error : undefined
        });
    }
};

export const updateApplicationStatus = async (
    req: Request,
    res: Response,
    _next: NextFunction
): Promise<void> => {
    try {
        const { userId, applicationId } = req.params;
        const { status } = req.body;

        if (!userId || !applicationId || !status) {
            res.status(400).json({
                success: false,
                message: 'User ID, application ID and new status are required'
            });
        }

        const updatedApplication = await applicationService.updateApplicationStatus(
            userId,
            applicationId,
            status
        );

        res.status(200).json({
            success: true,
            message: 'Application status updated successfully',
            data: updatedApplication
        });

    } catch (error) {
        console.error('Error in updateApplicationStatus controller:', error);

        if (error instanceof Error) {
            if (error.message.includes('not found')) {
                res.status(404).json({
                    success: false,
                    message: error.message
                });
            }
        }

        res.status(500).json({
            success: false,
            message: 'Error updating application status',
            error: process.env.NODE_ENV === 'development' ? error : undefined
        });
    }
};

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