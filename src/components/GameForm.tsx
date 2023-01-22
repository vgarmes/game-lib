import { z } from 'zod';
import schema from '../server/routers/game/schema';
import useZodForm from '../utils/hooks/useZodForm';
import ImageUpload from './image-upload';
import { Input, Toggle, TextArea, Select, Button, StarsInput } from './common';
import { trpc } from '../utils/trpc';
import { toISODateString } from '../utils';
import { Controller } from 'react-hook-form';
import { DirtyFields } from '../utils/forms';
import { Spinner } from './common/LoadingScreen';

export type Schema = z.infer<typeof schema>;

export const DEFAULT_VALUES = {
  title: '',
  inCollection: false,
  completed: false,
  edition: '',
  releaseDate: null,
  completedDate: null,
  buyDate: null,
  buyPrice: null,
  developerId: null,
  rating: null,
  comment: '',
  platformId: null,
  coverId: null,
};

const setValueAsNumber = (value: string, defaultValue?: number | null) => {
  return parseInt(value) || defaultValue;
};

interface Props {
  onSubmit: (values: Schema, dirtyFields: DirtyFields<Schema>) => void;
  isSubmitting: boolean;
  defaultCoverUrl?: string;
  initialValues?: Schema;
}

const GameForm = ({
  defaultCoverUrl,
  onSubmit,
  isSubmitting,
  initialValues,
}: Props) => {
  const defaultValues = initialValues || DEFAULT_VALUES;
  const { data: platforms } = trpc.useQuery(['platform.get-all']);
  const {
    register,
    formState: { errors, dirtyFields },
    setValue,
    handleSubmit,
    control,
  } = useZodForm({
    schema,
    defaultValues,
  });

  const buttonText = initialValues ? 'Edit' : 'Create';

  return (
    <form
      onSubmit={handleSubmit((values) => onSubmit(values, dirtyFields))}
      className="flex max-w-xl flex-col gap-5"
    >
      <ImageUpload
        defaultImageSrc={defaultCoverUrl}
        onSubmit={(id) => setValue('coverId', id, { shouldDirty: true })}
      />
      <Controller
        control={control}
        name="rating"
        render={({ field: { onChange, onBlur, value, ref } }) => (
          <StarsInput value={value} onChange={onChange} />
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

      <Toggle label="In collection" {...register('inCollection')} />
      <Toggle label="Completed" {...register('completed')} />

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
        {isSubmitting ? (
          <span>
            <Spinner />
          </span>
        ) : (
          buttonText
        )}
      </Button>
    </form>
  );
};

export default GameForm;
