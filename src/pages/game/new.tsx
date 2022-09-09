import { GetServerSidePropsContext, NextPage } from 'next';
import { FormEvent, useRef } from 'react';
import ImageUpload from '../../components/ImageUpload';
import { getServerSession } from '../../server/common/get-server-session';
import { CLOUDINARY_CONFIG } from '../../utils/cloudinary';
import { trpc } from '../../utils/trpc';

const NewGame: NextPage = () => {
  return (
    <div>
      <form>
        <ImageUpload />
      </form>
    </div>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res);

  if (!session || session.user.role !== 'ADMIN') {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
}

export default NewGame;
