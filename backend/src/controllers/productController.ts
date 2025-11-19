import { Request, Response } from 'express';
import prisma from '../utils/db';

export const getProducts = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const products = await prisma.product.findMany({
      where: { userId }, // Filter by user
      include: {
        supplier: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(products);
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { name, description, price, supplierId } = req.body;

    if (!name || !description || !price || !supplierId) {
      return res.status(400).json({
        error: 'Name, description, price, and supplierId are required',
      });
    }

    // Verify supplier exists AND belongs to user
    const supplier = await prisma.supplier.findFirst({
      where: { id: supplierId, userId },
    });

    if (!supplier) {
      return res.status(404).json({ error: 'Supplier not found' });
    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        supplierId,
        userId, // Associate with user
      },
      include: {
        supplier: true,
      },
    });

    res.status(201).json(product);
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { id } = req.params;
    const { name, description, price, supplierId } = req.body;

    if (!name || !description || !price) {
      return res
        .status(400)
        .json({ error: 'Name, description, and price are required' });
    }

    // Verify ownership
    const existingProduct = await prisma.product.findFirst({
      where: { id, userId },
    });

    if (!existingProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Verify supplier exists AND belongs to user if supplierId is provided
    if (supplierId) {
      const supplier = await prisma.supplier.findFirst({
        where: { id: supplierId, userId },
      });

      if (!supplier) {
        return res.status(404).json({ error: 'Supplier not found' });
      }
    }

    const updateData: any = {
      name,
      description,
      price: parseFloat(price),
    };

    // Always include supplierId if provided (required for reassignment)
    if (supplierId) {
      updateData.supplierId = supplierId;
    }

    const product = await prisma.product.update({
      where: { id },
      data: updateData,
      include: {
        supplier: true,
      },
    });

    res.json(product);
  } catch (error) {
    console.error('Update product error:', error);
    if ((error as any).code === 'P2025') {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const uploadProductImage = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ error: 'Product ID is required' });
    }

    // Verify ownership
    const existingProduct = await prisma.product.findFirst({
      where: { id: productId, userId },
    });

    if (!existingProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const filePath = `/uploads/${req.file.filename}`;

    const product = await prisma.product.update({
      where: { id: productId },
      data: {
        imagePath: filePath,
      },
      include: {
        supplier: true,
      },
    });

    res.json({
      message: 'Image uploaded successfully',
      imagePath: filePath,
      product,
    });
  } catch (error) {
    console.error('Upload image error:', error);
    if ((error as any).code === 'P2025') {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const searchProducts = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { q } = req.query;

    if (!q || typeof q !== 'string') {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const searchTerm = q.toLowerCase();

    const products = await prisma.product.findMany({
      where: {
        userId, // Filter by user
        OR: [
          {
            name: {
              contains: searchTerm,
              mode: 'insensitive',
            },
          },
          {
            supplier: {
              name: {
                contains: searchTerm,
                mode: 'insensitive',
              },
            },
          },
        ],
      },
      include: {
        supplier: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(products);
  } catch (error) {
    console.error('Search products error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { id } = req.params;

    // Verify ownership before deleting
    const existingProduct = await prisma.product.findFirst({
      where: { id, userId },
    });

    if (!existingProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    await prisma.product.delete({
      where: { id },
    });

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    if ((error as any).code === 'P2025') {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

