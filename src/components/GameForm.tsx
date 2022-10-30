import { z } from 'zod';
import schema from '../server/routers/game/schema';
import useZodForm from '../utils/hooks/useZodForm';
import ImageUpload from './ImageUpload';
import RatingInput from './common/Stars';
import Input from './common/Input';
import Toggle from './common/Toggle';
import TextArea from './common/TextArea';
import Select from './common/Select';
import Button from './common/Button';
import { trpc } from '../utils/trpc';
import { toISODateString } from '../utils';
import { Controller } from 'react-hook-form';

type Schema = z.infer<typeof schema>;

const DEFAULT_VALUES = {
  title: undefined,
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

const setValueAsNumber = (value: string, defaultValue?: number | null) => {
  return parseInt(value) || defaultValue;
};

interface Props {
  onSubmit: (values: Schema) => void;
  defaultValues?: Schema;
  defaultCoverUrl?: string;
}

const GameForm: React.FC<Props> = ({
  defaultValues = DEFAULT_VALUES,
  defaultCoverUrl,
  onSubmit,
}) => {
  const { data: platforms } = trpc.useQuery(['platform.get-all']);
  const {
    register,
    formState: { errors, isSubmitting },
    setValue,
    handleSubmit,
    control,
  } = useZodForm({
    schema: schema,
    defaultValues,
  });

  return (
    <form
      onSubmit={handleSubmit((values) => onSubmit(values))}
      className="flex min-w-[200px] flex-col gap-5 md:items-start"
    >
      <ImageUpload
        defaultImageSrc={defaultCoverUrl}
        onSubmit={(id) => setValue('coverId', id)}
      />
      <Controller
        control={control}
        name="rating"
        render={({ field: { onChange, onBlur, value, ref } }) => (
          <RatingInput value={value} onChange={onChange} />
        )}
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
        <Controller
          control={control}
          name="completedDate"
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <Input
              ref={ref}
              label="Completed date"
              type="date"
              onChange={(e) => onChange(new Date(e.target.value))}
              onBlur={onBlur}
              value={value ? toISODateString(value) : undefined}
            />
          )}
        />

        <Controller
          control={control}
          name="releaseDate"
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <Input
              ref={ref}
              label="Release date"
              type="date"
              onChange={(e) => onChange(new Date(e.target.value))}
              onBlur={onBlur}
              value={value ? toISODateString(value) : undefined}
            />
          )}
        />
      </div>
      <div className="flex w-full items-center gap-5">
        <Controller
          control={control}
          name="buyDate"
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <Input
              ref={ref}
              label="Buy date"
              type="date"
              onChange={(e) => onChange(new Date(e.target.value))}
              onBlur={onBlur}
              value={value ? toISODateString(value) : undefined}
            />
          )}
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
      <Controller
        control={control}
        name="platformId"
        render={({ field: { onChange, onBlur, value, ref } }) => (
          <Select
            label="Platform"
            placeholder="Choose a platform"
            options={platforms?.map((platform) => ({
              value: platform.id,
              label: platform.name,
            }))}
            value={value?.toString()}
            onChange={(e) =>
              onChange(parseInt(e.target.value) || defaultValues.platformId)
            }
            onBlur={onBlur}
          />
        )}
      />

      <Button type="submit" disabled={isSubmitting}>
        Submit
      </Button>
    </form>
  );
};

export default GameForm;
