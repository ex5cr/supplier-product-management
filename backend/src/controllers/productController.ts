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
        images: true,
        primaryImage: true,
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
        images: true,
        primaryImage: true,
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

    if (!supplierId) {
      return res
        .status(400)
        .json({ error: 'Supplier ID is required' });
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
        images: true,
        primaryImage: true,
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
      include: { primaryImage: true },
    });

    if (!existingProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const filePath = `/uploads/${req.file.filename}`;

    // Create a new ProductImage entry
    const productImage = await prisma.productImage.create({
      data: {
        path: filePath,
        productId: productId,
      },
    });

    const updateData: any = {};

    // Set as primary if no primary is set
    if (!existingProduct.primaryImageId) {
      updateData.primaryImageId = productImage.id;
    }

    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: updateData,
      include: {
        supplier: true,
        images: {
          orderBy: { createdAt: 'desc' },
        },
        primaryImage: true,
      },
    });

    res.json({
      message: 'Image uploaded successfully',
      image: productImage,
      product: updatedProduct,
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
        images: true,
        primaryImage: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(products);
  } catch (error) {
    console.error('Search products error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteProductImage = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { imageId } = req.params;

    // Find the image and verify ownership through product
    const image = await prisma.productImage.findUnique({
      where: { id: imageId },
      include: {
        product: true,
      },
    });

    if (!image) {
      return res.status(404).json({ error: 'Image not found' });
    }

    if (image.product.userId !== userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // If this is the primary image, we need to set another one as primary or clear it
    const product = await prisma.product.findUnique({
      where: { id: image.productId },
      include: { images: true },
    });

    if (product?.primaryImageId === imageId) {
      // Find another image to set as primary
      const otherImage = product.images.find((img) => img.id !== imageId);
      
      const updateData: any = {};
      if (otherImage) {
        updateData.primaryImageId = otherImage.id;
      } else {
        updateData.primaryImageId = null;
      }

      await prisma.product.update({
        where: { id: image.productId },
        data: updateData,
      });
    }

    // Delete the image
    await prisma.productImage.delete({
      where: { id: imageId },
    });

    // Get updated product
    const updatedProduct = await prisma.product.findUnique({
      where: { id: image.productId },
      include: {
        supplier: true,
        images: {
          orderBy: { createdAt: 'desc' },
        },
        primaryImage: true,
      },
    });

    res.json({
      message: 'Image deleted successfully',
      product: updatedProduct,
    });
  } catch (error) {
    console.error('Delete image error:', error);
    if ((error as any).code === 'P2025') {
      return res.status(404).json({ error: 'Image not found' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const setPrimaryImage = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { imageId } = req.params;

    // Find the image and verify ownership through product
    const image = await prisma.productImage.findUnique({
      where: { id: imageId },
      include: {
        product: true,
      },
    });

    if (!image) {
      return res.status(404).json({ error: 'Image not found' });
    }

    if (image.product.userId !== userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // Set as primary image
    const product = await prisma.product.update({
      where: { id: image.productId },
      data: {
        primaryImageId: imageId,
      },
      include: {
        supplier: true,
        images: {
          orderBy: { createdAt: 'desc' },
        },
        primaryImage: true,
      },
    });

    res.json({
      message: 'Primary image updated successfully',
      product,
    });
  } catch (error) {
    console.error('Set primary image error:', error);
    if ((error as any).code === 'P2025') {
      return res.status(404).json({ error: 'Image not found' });
    }
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

