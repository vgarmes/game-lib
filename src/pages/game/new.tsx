import { GetServerSidePropsContext, NextPage } from 'next';
import { FormEvent, useRef } from 'react';
import { getServerSession } from '../../server/common/get-server-session';
import { CLOUDINARY_CONFIG } from '../../utils/cloudinary';
import { trpc } from '../../utils/trpc';

const NewGame: NextPage = () => {
  const { data: signature } = trpc.useQuery(['uploadSignature']);
  const fileRef = useRef<HTMLInputElement>(null);
  const handleChange = (files: FileList | null) => {
    if (files === null) return;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!fileRef.current?.files || !signature) return;
    const fd = new FormData();
    fd.append('file', fileRef.current.files[0]);
    fd.append('api_key', process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!);
    fd.append('timestamp', signature.timestamp.toString());
    fd.append('signature', signature.hash);
    fd.append('folder', CLOUDINARY_CONFIG.folder);

    try {
      const response = await fetch(
        'https://api.cloudinary.com/v1_1/' +
          process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME! +
          '/image/upload',
        { method: 'POST', body: fd }
      );
      console.log(response);
    } catch (error) {}
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          id="image-upload"
          name="test"
          accept="image/*"
          onChange={(e) => handleChange(e.target.files)}
          ref={fileRef}
        />
        <button type="submit">submit</button>
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
