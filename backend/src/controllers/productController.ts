import { Request, Response } from 'express';
import prisma from '../utils/db';

export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany({
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
    const { name, description, price, supplierId } = req.body;

    if (!name || !description || !price || !supplierId) {
      return res.status(400).json({
        error: 'Name, description, price, and supplierId are required',
      });
    }

    // Verify supplier exists
    const supplier = await prisma.supplier.findUnique({
      where: { id: supplierId },
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
    const { id } = req.params;
    const { name, description, price, supplierId } = req.body;

    if (!name || !description || !price) {
      return res
        .status(400)
        .json({ error: 'Name, description, and price are required' });
    }

    const updateData: any = {
      name,
      description,
      price: parseFloat(price),
    };

    if (supplierId) {
      // Verify supplier exists
      const supplier = await prisma.supplier.findUnique({
        where: { id: supplierId },
      });

      if (!supplier) {
        return res.status(404).json({ error: 'Supplier not found' });
      }

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
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ error: 'Product ID is required' });
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
    const { q } = req.query;

    if (!q || typeof q !== 'string') {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const searchTerm = q.toLowerCase();

    const products = await prisma.product.findMany({
      where: {
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

