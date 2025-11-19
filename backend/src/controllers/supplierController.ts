import { Request, Response } from 'express';
import prisma from '../utils/db';

export const getSuppliers = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const suppliers = await prisma.supplier.findMany({
      where: { userId }, // Filter by user
      orderBy: { createdAt: 'desc' },
    });
    res.json(suppliers);
  } catch (error) {
    console.error('Get suppliers error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createSupplier = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { name, email, phone } = req.body;

    if (!name || !email || !phone) {
      return res
        .status(400)
        .json({ error: 'Name, email, and phone are required' });
    }

    const supplier = await prisma.supplier.create({
      data: {
        name,
        email,
        phone,
        userId, // Associate with user
      },
    });

    res.status(201).json(supplier);
  } catch (error) {
    console.error('Create supplier error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateSupplier = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { id } = req.params;
    const { name, email, phone } = req.body;

    if (!name || !email || !phone) {
      return res
        .status(400)
        .json({ error: 'Name, email, and phone are required' });
    }

    // Verify ownership before updating
    const existingSupplier = await prisma.supplier.findFirst({
      where: { id, userId },
    });

    if (!existingSupplier) {
      return res.status(404).json({ error: 'Supplier not found' });
    }

    const supplier = await prisma.supplier.update({
      where: { id },
      data: {
        name,
        email,
        phone,
      },
    });

    res.json(supplier);
  } catch (error) {
    console.error('Update supplier error:', error);
    if ((error as any).code === 'P2025') {
      return res.status(404).json({ error: 'Supplier not found' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

