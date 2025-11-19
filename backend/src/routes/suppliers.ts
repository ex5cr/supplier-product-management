import express from 'express';
import { authenticateToken } from '../middleware/auth';
import {
  getSuppliers,
  createSupplier,
  updateSupplier,
  deleteSupplier,
} from '../controllers/supplierController';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

router.get('/', getSuppliers);
router.post('/', createSupplier);
router.put('/:id', updateSupplier);
router.delete('/:id', deleteSupplier);

export default router;

