import { Router } from 'express';
import {
  createLead,
  getLeads,
  getLeadById,
  updateLead,
  deleteLead,
} from '../controllers/leadController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

// Apply the protect middleware to all routes in this file
router.use(protect);

router.route('/')
  .post(createLead)
  .get(getLeads);

router.route('/:id')
  .get(getLeadById)
  .put(updateLead)
  .delete(deleteLead);

export default router;