import { Request, Response } from 'express';
import prisma from '../lib/prisma';

export const handleAffiliateRedirect = async (req: Request, res: Response) => {
  const { slug } = req.params;

  if (!slug || typeof slug !== 'string' || slug.trim() === '') {
    return res.status(400).json({ status: 'error', message: 'Affiliate slug is required' });
  }

  try {
    const link = await prisma.affiliateLink.findUnique({
      where: { slug },
      select: { id: true, targetUrl: true, isActive: true },
    });

    if (!link || !link.isActive) {
      return res.status(404).json({ status: 'error', message: 'Affiliate link not found or inactive' });
    }

    // Track click (non-blocking)
    prisma.affiliateClick.create({
      data: {
        linkId: link.id,
        referrer: req.headers.referer || null,
        ip: req.ip || req.socket.remoteAddress || null,
        userAgent: req.headers['user-agent'] || null,
      },
    }).catch((err) => console.error('Affiliate click track failed:', err));

    console.log(JSON.stringify({
      type: 'AFFILIATE_CLICK', slug, linkId: link.id,
      referrer: req.headers.referer || 'direct', timestamp: new Date().toISOString(),
    }));

    return res.redirect(302, link.targetUrl);
  } catch (error) {
    console.error('Affiliate redirect failed:', error);
    return res.status(500).json({ status: 'error', message: 'Unable to redirect affiliate link' });
  }
};
