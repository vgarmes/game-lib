import { z } from 'zod';
import schema from '../../server/routers/platform/schema';
import useZodForm from '../../utils/hooks/useZodForm';
import Button from '../common/Button';
import Input from '../common/Input';

type Schema = z.infer<typeof schema>;

const DEFAULT_VALUES = {
  name: undefined,
  manufacturer: undefined,
};
interface Props {
  onSubmit: (values: Schema) => void;
  defaultValues?: Schema;
}

const Form: React.FC<Props> = ({
  defaultValues = DEFAULT_VALUES,
  onSubmit,
}) => {
  const {
    register,
    formState: { errors, isSubmitting },
    handleSubmit,
  } = useZodForm({ schema, defaultValues });
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex min-w-[200px] flex-col gap-5 md:items-start"
    >
      <Input
        label="Manufacturer"
        error={errors.manufacturer?.message}
        {...register('manufacturer')}
        placeholder="f.ex.: Nintendo"
      />
      <Input
        label="Name"
        error={errors.name?.message}
        {...register('name')}
        placeholder="f.ex.: PlayStation"
      />
      <Button type="submit" disabled={isSubmitting}>
        Create
      </Button>
    </form>
  );
};

export default Form;
