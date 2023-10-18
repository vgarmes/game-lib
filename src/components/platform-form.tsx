import useZodForm from '@/utils/hooks/useZodForm';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form';
import schema, { PlatformSchema } from '../server/routers/platform/schema';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Loader2 } from 'lucide-react';

const DEFAULT_VALUES: PlatformSchema = {
  name: '',
  manufacturer: '',
};

interface Props {
  onSubmit: (values: PlatformSchema) => void;
  initialValues?: PlatformSchema;
  isSubmitting?: boolean;
}
const PlatformForm: React.FC<Props> = ({
  initialValues,
  onSubmit,
  isSubmitting = false,
}) => {
  const defaultValues = initialValues || DEFAULT_VALUES;
  const form = useZodForm({
    schema,
    defaultValues,
  });
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex max-w-xl flex-col gap-5"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g.: Super Nintendo" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="manufacturer"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Manufacturer</FormLabel>
              <FormControl>
                <Input placeholder="e.g.: Nintendo" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save
        </Button>
      </form>
    </Form>
  );
};

export default PlatformForm;
