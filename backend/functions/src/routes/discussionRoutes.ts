import { Router } from 'express';
import {
    listInterviewPosts,
    listResumeReviewPosts,
    listCompensationPosts,
    listTrendsPosts,
    listShowcasePosts,
    createPost,
    getPostById,
    updatePost,
    deletePost,
    addComment,
    likePost,
    moderatePost
} from '../controllers/discussionController.js';

const router = Router();

// Discussion Categories
router.get('/interviews', listInterviewPosts);
router.get('/resumereview', listResumeReviewPosts);
router.get('/compensation', listCompensationPosts);
router.get('/trends', listTrendsPosts);
router.get('/showcase', listShowcasePosts);

// Post Management
router.post('/post', createPost);  // Create a new post
router.get('/post/:id', getPostById);  // Get post details by ID
router.put('/post/:id', updatePost);  // Edit/Update a post
router.delete('/post/:id', deletePost);  // Delete a post

// Engagement
router.post('/post/:id/comment', addComment);  
router.post('/post/:id/like', likePost);  

// Moderation (Optional)
router.put('/post/:id/moderate', moderatePost);  

export default router;
