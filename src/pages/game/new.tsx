import { ChangeEvent } from 'react';
import { GetServerSidePropsContext, NextPage } from 'next';
import { useRouter } from 'next/router';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import RatingInput from '../../components/common/Stars';
import TextArea from '../../components/common/TextArea';
import Toggle from '../../components/common/Toggle';
import ImageUpload from '../../components/ImageUpload';
import { getServerSession } from '../../server/common/get-server-session';
import { newGameSchema } from '../../server/routers/game/schema';
import useZodForm from '../../utils/hooks/useZodForm';
import { trpc } from '../../utils/trpc';
import { z } from 'zod';
import { setValueAsDate, setValueAsNumber } from '../../utils/zod';
import Button from '../../components/common/Button';

const defaultValues = {
  title: '',
  inCollection: false,
  completed: false,
  edition: undefined,
  releaseDate: undefined,
  completedDate: undefined,
  buyDate: undefined,
  buyPrice: undefined,
  developerId: undefined,
  rating: undefined,
  comment: undefined,
  platformId: undefined,
  coverId: undefined,
};

const NewGame: NextPage = () => {
  const router = useRouter();
  const { data: platforms } = trpc.useQuery(['platform.get-all'], {
    staleTime: Infinity,
  });
  const createGame = trpc.useMutation('game.create', {
    onSuccess() {
      console.log('success!');
      router.push('/');
    },
  });
  const {
    register,
    formState: { errors },
    setValue,
    handleSubmit,
    getValues,
  } = useZodForm({
    schema: newGameSchema,
    defaultValues,
  });

  const onChangeDate = (
    e: ChangeEvent<HTMLInputElement>,
    key: keyof z.infer<typeof newGameSchema>
  ) => {
    const value = e.target.value;
    if (!value) {
      return setValue(key, defaultValues[key]);
    }
    const date = new Date(value);
    return setValue(key, date);
  };

  return (
    <div>
      <h2 className="pb-6 text-3xl font-bold">New game</h2>
      <form
        onSubmit={handleSubmit((values) => createGame.mutate(values))}
        className="flex min-w-[200px] flex-col gap-5 md:items-start"
      >
        <ImageUpload onSubmit={(id) => setValue('coverId', id)} />
        <RatingInput
          defaultRating={defaultValues.rating}
          setRatingValue={(n) => setValue('rating', n)}
          {...register('rating')}
        />
        <Input
          label="Title"
          error={errors.title?.message}
          {...register('title')}
          placeholder="Title"
        />
        <Input
          label="Edition"
          error={errors.edition?.message}
          {...register('edition')}
          placeholder="Edition"
        />
        <div className="flex items-center gap-5">
          <Toggle label="In collection" {...register('inCollection')} />
          <Toggle label="Completed" {...register('completed')} />
        </div>
        <div className="flex w-full items-center gap-3">
          <Input
            label="Completed date"
            type="date"
            {...register('completedDate', {
              setValueAs: (v) => setValueAsDate(v, defaultValues.completedDate),
            })}
          />
          <Input
            label="Release date"
            type="date"
            {...register('releaseDate', {
              setValueAs: (v) => setValueAsDate(v, defaultValues.releaseDate),
            })}
          />
        </div>
        <div className="flex w-full items-center gap-5">
          <Input
            label="Buy date"
            type="date"
            {...register('buyDate', {
              setValueAs: (v) => setValueAsDate(v, defaultValues.buyDate),
            })}
          />
          <Input
            label="Price"
            type="number"
            {...register('buyPrice', {
              setValueAs: (v) => setValueAsNumber(v, defaultValues.buyPrice),
            })}
          />
        </div>

        <TextArea
          label="Comment"
          placeholder="Write a comment..."
          {...register('comment')}
        />
        <Select
          label="Platform"
          placeholder="Choose a platform"
          options={platforms?.map((platform) => ({
            value: platform.id,
            label: platform.name,
          }))}
          {...register('platformId', {
            setValueAs: (v) => parseInt(v) || defaultValues.platformId,
          })}
        />

        <Button type="submit">Submit</Button>
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
