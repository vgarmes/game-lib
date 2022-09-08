import {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from 'next';
import { unstable_getServerSession } from 'next-auth';
import { nextAuthOptions } from '../../pages/api/auth/[...nextauth]';

export const getServerSession = async (
  ...args:
    | [GetServerSidePropsContext['req'], GetServerSidePropsContext['res']]
    | [NextApiRequest, NextApiResponse]
) => {
  const [req, res] = args;
  return await unstable_getServerSession(req, res, nextAuthOptions);
};
