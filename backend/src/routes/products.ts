import express from 'express';
import { authenticateToken } from '../middleware/auth';
import { upload } from '../middleware/upload';
import {
  getProducts,
  createProduct,
  updateProduct,
  uploadProductImage,
  searchProducts,
} from '../controllers/productController';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

router.get('/', getProducts);
router.get('/search', searchProducts);
router.post('/', createProduct);
router.put('/:id', updateProduct);
router.post('/upload', upload.single('image'), uploadProductImage);

export default router;

