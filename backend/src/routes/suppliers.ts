import express from 'express';
import { authenticateToken } from '../middleware/auth';
import {
  getSuppliers,
  createSupplier,
  updateSupplier,
} from '../controllers/supplierController';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

router.get('/', getSuppliers);
router.post('/', createSupplier);
router.put('/:id', updateSupplier);

export default router;

