import { Router } from 'express';
import {listInterviewPosts,listResumeReviewPosts,listCompensationPosts,listTrendsPosts,listShowcasePosts} from '../controllers/discussionController.js'

const router = Router();

router.post('/interviews', listInterviewPosts);
router.post('/resumereview', listResumeReviewPosts);
router.post('/compensation', listCompensationPosts);
router.post('/trends', listTrendsPosts);
router.post('/showcase', listShowcasePosts);


export default router;