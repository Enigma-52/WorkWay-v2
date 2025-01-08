import { Router } from 'express';
import { getUserApplications, updateApplicationStatus, addApplication } from '../controllers/applicationController.js';

const router = Router();

// Get all applications for a user
router.get('/user/:userId', getUserApplications);

// Add new application
router.post('/add', addApplication);

// Update application status (needs both userId and applicationId)
router.patch('/user/:userId/application/:applicationId', updateApplicationStatus);

export default router;