import { Request, Response, NextFunction } from 'express';
import prisma from '../../lib/prisma';
import { AppError } from '../../middleware/errorHandler';
import { generateSlug, makeCategorySlugUnique } from '../../seo/services/slug.service';

// GET /categories — list all
export const listCategories = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const categories = await prisma.category.findMany({
      select: { id: true, name: true, slug: true, description: true, metaTitle: true, metaDesc: true, ogImage: true, createdAt: true, updatedAt: true,
        _count: { select: { postCategories: true } }
      },
      orderBy: { name: 'asc' },
    });
    res.json({ status: 'success', data: categories });
  } catch (err) { next(err); }
};

// POST /categories — create
export const createCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, description, metaTitle, metaDesc, ogImage } = req.body;
    if (!name || name.trim().length < 2) throw new AppError('Category name is required (min 2 chars)', 400);

    const baseSlug = generateSlug(name);
    const slug = await makeCategorySlugUnique(baseSlug);

    const category = await prisma.category.create({
      data: { name: name.trim(), slug, description: description || null, metaTitle: metaTitle || null, metaDesc: metaDesc || null, ogImage: ogImage || null },
    });
    res.status(201).json({ status: 'success', data: category });
  } catch (err) { next(err); }
};

// PUT /categories/:id — update
export const updateCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const existing = await prisma.category.findUnique({ where: { id: req.params.id } });
    if (!existing) throw new AppError('Category not found', 404);

    const { name, description, metaTitle, metaDesc, ogImage } = req.body;
    const data: Record<string, unknown> = {};
    if (name) { data.name = name.trim(); data.slug = await makeCategorySlugUnique(generateSlug(name), req.params.id); }
    if (description !== undefined) data.description = description;
    if (metaTitle !== undefined) data.metaTitle = metaTitle;
    if (metaDesc !== undefined) data.metaDesc = metaDesc;
    if (ogImage !== undefined) data.ogImage = ogImage;

    const updated = await prisma.category.update({ where: { id: req.params.id }, data });
    res.json({ status: 'success', data: updated });
  } catch (err) { next(err); }
};

// DELETE /categories/:id
export const deleteCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const existing = await prisma.category.findUnique({ where: { id: req.params.id } });
    if (!existing) throw new AppError('Category not found', 404);

    await prisma.postCategory.deleteMany({ where: { categoryId: req.params.id } });
    await prisma.category.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (err) { next(err); }
};
