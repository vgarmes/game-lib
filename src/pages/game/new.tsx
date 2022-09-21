import { ChangeEvent, useState } from 'react';
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
import { CloudinaryUploadResponse } from '../../types/cloudinary';
import { TypeOf, z } from 'zod';
import { setValueAsDate, setValueAsNumber } from '../../utils/zod';

const defaultValues = {
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
};

const NewGame: NextPage = () => {
  const router = useRouter();
  const [cover, setCover] = useState<CloudinaryUploadResponse>();
  const { data: platforms } = trpc.useQuery(['platform.get-all'], {
    staleTime: Infinity,
  });
  const createGame = trpc.useMutation('game.create', {
    onSuccess() {
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
      return setValue(key, null);
    }
    const date = new Date(value);
    return setValue(key, date);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold">New game</h2>
      <form onSubmit={handleSubmit((values) => createGame.mutate(values))}>
        <ImageUpload onSubmit={setCover} />
        <RatingInput
          defaultRating={null}
          setRatingValue={(n) => setValue('rating', n)}
          {...register('rating')}
        />
        <Input
          label="Title"
          error={errors.title?.message}
          {...register('title')}
          placeholder="Title"
          className="pb-5"
        />
        <Input
          label="Edition"
          error={errors.edition?.message}
          {...register('edition')}
          placeholder="Edition"
          className="pb-5"
        />
        <div className="flex items-center gap-5 pb-5">
          <Toggle label="In collection" {...register('inCollection')} />
          <Toggle label="Completed" {...register('completed')} />
        </div>
        <div className="flex w-full items-center gap-5 pb-5">
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
        <div className="flex w-full items-center gap-5 pb-5">
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
          className="pb-5"
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
        <button type="button" onClick={() => console.log(getValues())}>
          log form state
        </button>
        <button type="submit">Submit</button>
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
