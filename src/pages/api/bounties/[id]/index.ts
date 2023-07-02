import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { bountyValidationSchema } from 'validationSchema/bounties';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.bounty
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getBountyById();
    case 'PUT':
      return updateBountyById();
    case 'DELETE':
      return deleteBountyById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getBountyById() {
    const data = await prisma.bounty.findFirst(convertQueryToPrismaUtil(req.query, 'bounty'));
    return res.status(200).json(data);
  }

  async function updateBountyById() {
    await bountyValidationSchema.validate(req.body);
    const data = await prisma.bounty.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deleteBountyById() {
    const data = await prisma.bounty.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
