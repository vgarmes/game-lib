import {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from 'next';
import { getServerSession as gSS } from 'next-auth';
import { nextAuthOptions } from '../../pages/api/auth/[...nextauth]';

export const getServerSession = async (
  ...args:
    | [GetServerSidePropsContext['req'], GetServerSidePropsContext['res']]
    | [NextApiRequest, NextApiResponse]
) => {
  const [req, res] = args;
  return await gSS(req, res, nextAuthOptions);
};
