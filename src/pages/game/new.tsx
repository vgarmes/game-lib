import { GetServerSidePropsContext, NextPage } from 'next';
import { useRouter } from 'next/router';
import Input from '../../components/common/Input';
import RatingInput from '../../components/common/Stars';
import TextArea from '../../components/common/TextArea';
import Toggle from '../../components/common/Toggle';
import ImageUpload from '../../components/ImageUpload';
import { getServerSession } from '../../server/common/get-server-session';
import { newGameSchema } from '../../server/routers/game/schema';
import useZodForm from '../../utils/hooks/useZodForm';
import { trpc } from '../../utils/trpc';

const NewGame: NextPage = () => {
  const router = useRouter();
  const createGame = trpc.useMutation('game.create', {
    onSuccess() {
      router.push('/');
    },
  });
  const methods = useZodForm({
    schema: newGameSchema,
    defaultValues: {
      title: '',
      inCollection: false,
      completed: false,
      edition: null,
      releaseDate: null,
      completedDate: null,
      buyDate: null,
      buyPrice: null,
      developerId: null,
      rating: null,
      comment: null,
      platformId: null,
    },
  });

  return (
    <div>
      <h2 className="text-2xl font-bold">New game</h2>
      <form
        onSubmit={methods.handleSubmit((values) =>
          //createGame.mutate(values)
          console.log(values)
        )}
      >
        <ImageUpload />
        <RatingInput
          defaultRating={null}
          setRatingValue={(n) => methods.setValue('rating', n)}
          {...methods.register('rating')}
        />
        <Input
          label="Title"
          error={methods.formState.errors.title?.message}
          {...methods.register('title')}
          placeholder="Title"
          className="pb-5"
        />
        <Input
          label="Edition"
          error={methods.formState.errors.edition?.message}
          {...methods.register('edition')}
          placeholder="Edition"
          className="pb-5"
        />
        <div className="flex items-center gap-5 pb-5">
          <Toggle label="In collection" {...methods.register('inCollection')} />
          <Toggle label="Completed" {...methods.register('completed')} />
        </div>
        <Input
          label="Completed date"
          type="date"
          {...methods.register('completedDate')}
        />
        <TextArea
          label="Comment"
          placeholder="Write a comment..."
          {...methods.register('comment')}
          className="pb-5"
        />
        <button type="button" onClick={() => console.log(methods.getValues())}>
          submit
        </button>
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
