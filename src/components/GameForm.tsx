import { z } from 'zod';
import schema from '../server/routers/game/schema';
import useZodForm from '../utils/hooks/useZodForm';
import ImageUpload from './ImageUpload';
import RatingInput from './common/Stars';
import Input from './common/Input';
import Toggle from './common/Toggle';
import { setValueAsDate, setValueAsNumber } from '../utils/zod';
import TextArea from './common/TextArea';
import Select from './common/Select';
import Button from './common/Button';
import { Game } from '@prisma/client';
import { trpc } from '../utils/trpc';

type Schema = z.infer<typeof schema>;

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

interface Props {
  onSubmit: (values: Schema) => void;
  initialValues?: Game;
}

const GameForm: React.FC<Props> = ({ initialValues, onSubmit }) => {
  const { data: platforms } = trpc.useQuery(['platform.get-all']);
  const {
    register,
    formState: { errors },
    setValue,
    handleSubmit,
    getValues,
  } = useZodForm({
    schema: schema,
    defaultValues,
  });
  return (
    <form
      onSubmit={handleSubmit((values) => onSubmit(values))}
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
  );
};

export default GameForm;
