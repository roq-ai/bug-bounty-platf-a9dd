import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { vulnerabilityValidationSchema } from 'validationSchema/vulnerabilities';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.vulnerability
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getVulnerabilityById();
    case 'PUT':
      return updateVulnerabilityById();
    case 'DELETE':
      return deleteVulnerabilityById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getVulnerabilityById() {
    const data = await prisma.vulnerability.findFirst(convertQueryToPrismaUtil(req.query, 'vulnerability'));
    return res.status(200).json(data);
  }

  async function updateVulnerabilityById() {
    await vulnerabilityValidationSchema.validate(req.body);
    const data = await prisma.vulnerability.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deleteVulnerabilityById() {
    const data = await prisma.vulnerability.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
