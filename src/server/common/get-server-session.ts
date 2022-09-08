import { GetServerSidePropsContext } from 'next';
import { unstable_getServerSession } from 'next-auth';
import { nextAuthOptions } from '../../pages/api/auth/[...nextauth]';

export const getServerSession = async (ctx: GetServerSidePropsContext) => {
  return await unstable_getServerSession(ctx.req, ctx.res, nextAuthOptions);
};
