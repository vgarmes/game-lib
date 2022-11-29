import { z } from 'zod';
import schema from '../../server/routers/platform/schema';
import useZodForm from '../../utils/hooks/useZodForm';
import Button from '../common/Button';
import Input from '../common/Input';
import { Spinner } from '../common/LoadingScreen';

type Schema = z.infer<typeof schema>;

const DEFAULT_VALUES = {
  name: '',
  manufacturer: '',
};
interface Props {
  onSubmit: (values: Schema) => void;
  initialValues?: Schema;
  isSubmitting?: boolean;
}

const Form: React.FC<Props> = ({
  initialValues,
  onSubmit,
  isSubmitting = false,
}) => {
  const defaultValues = initialValues || DEFAULT_VALUES;
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useZodForm({ schema, defaultValues });

  const buttonText = initialValues ? 'Update' : 'Create';

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex max-w-xl flex-col gap-5"
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
        {isSubmitting ? (
          <span>
            <Spinner size="24px" />
          </span>
        ) : (
          buttonText
        )}
      </Button>
    </form>
  );
};

export default Form;
