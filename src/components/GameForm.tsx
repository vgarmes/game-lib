import schema, { GameSchema } from '../server/routers/game/schema';
import useZodForm from '../utils/hooks/useZodForm';
import ImageUpload from './image-upload';
import { StarsInput } from './common';
import { dateToLocalWithoutTime, dateToUtcWithoutTime } from '../utils';
import { Controller } from 'react-hook-form';
import { DirtyFields } from '../utils/forms';
import { Spinner } from './common/LoadingScreen';
import { trpc } from '@/utils/trpc';
import { Input } from './ui/input';
import { Button } from './ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form';
import { Switch } from './ui/switch';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import clsx from 'clsx';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from './ui/calendar';
import { useRef, useState } from 'react';
import { Textarea } from './ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

export const DEFAULT_VALUES = {
  title: '',
  inCollection: false,
  completed: false,
  edition: '',
  releaseDate: undefined,
  completedDate: undefined,
  buyDate: undefined,
  buyPrice: undefined,
  developerId: undefined,
  rating: undefined,
  comment: '',
  platformId: undefined,
  coverId: undefined,
};

const setValueAsNumber = (value: string, defaultValue?: number | null) => {
  return parseInt(value) || defaultValue;
};

interface Props {
  onSubmit: (values: GameSchema, dirtyFields: DirtyFields<GameSchema>) => void;
  isSubmitting: boolean;
  defaultCoverUrl?: string;
  initialValues?: GameSchema;
}

const getDefaultDate = (date?: Date, fallbackDate?: Date) =>
  date ? dateToLocalWithoutTime(date) : fallbackDate;

const getDefaultValues = (initialValues?: GameSchema) => {
  if (!initialValues) {
    return DEFAULT_VALUES;
  }

  return {
    ...initialValues,
    completedDate: getDefaultDate(
      initialValues.completedDate,
      DEFAULT_VALUES.completedDate
    ),
    releaseDate: getDefaultDate(
      initialValues.releaseDate,
      DEFAULT_VALUES.releaseDate
    ),
    buyDate: getDefaultDate(initialValues.buyDate, DEFAULT_VALUES.buyDate),
  };
};

const GameForm = ({
  defaultCoverUrl,
  onSubmit,
  isSubmitting,
  initialValues,
}: Props) => {
  const defaultValues = useRef(getDefaultValues(initialValues));
  const [isCompleted, setIsCompleted] = useState(
    defaultValues.current.completed
  );
  const { data: platforms } = trpc.platform.all.useQuery();

  const form = useZodForm({
    schema,
    defaultValues: defaultValues.current,
  });

  const buttonText = initialValues ? 'Edit' : 'Create';

  const handleSubmit = (values: GameSchema) => {
    const { completedDate, buyDate, releaseDate } = values;
    const newValues = {
      ...values,
      completedDate: completedDate
        ? dateToUtcWithoutTime(completedDate)
        : completedDate,
      buyDate: buyDate ? dateToUtcWithoutTime(buyDate) : buyDate,
      releaseDate: releaseDate
        ? dateToUtcWithoutTime(releaseDate)
        : releaseDate,
    };
    onSubmit(newValues, form.formState.dirtyFields);
  };
  console.log('render');
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex max-w-xl flex-col gap-5"
      >
        <ImageUpload
          defaultImageSrc={defaultCoverUrl}
          onSubmit={(id) => form.setValue('coverId', id, { shouldDirty: true })}
        />
        <Controller
          control={form.control}
          name="rating"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rating</FormLabel>
              <FormControl>
                <StarsInput {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="e.g.: Metal Gear Solid" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="edition"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Edition (optional)</FormLabel>
              <FormControl>
                <Input placeholder="e.g.: Collector's Edition" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="inCollection"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">In Collection</FormLabel>
                <FormDescription>
                  Either in physical collection or digital in a store (like
                  Steam).
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="completed"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Completed</FormLabel>
                <FormDescription>
                  Credits have been rolled for this game.
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={(val) => {
                    field.onChange(val);
                    setIsCompleted(val);
                  }}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="completedDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Completed date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={'outline'}
                      className={clsx(
                        'w-[240px] pl-3 text-left font-normal',
                        !field.value && 'text-muted-foreground'
                      )}
                      disabled={!isCompleted}
                    >
                      {field.value ? (
                        format(field.value, 'PPP')
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date('1900-01-01')
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>
                Only enabled if the game has been completed.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="releaseDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Release date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={'outline'}
                      className={clsx(
                        'w-[240px] pl-3 text-left font-normal',
                        !field.value && 'text-muted-foreground'
                      )}
                    >
                      {field.value ? (
                        format(field.value, 'PPP')
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date('1900-01-01')
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>
                Only enabled if the game has been completed.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="buyDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Buy date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={'outline'}
                      className={clsx(
                        'w-[240px] pl-3 text-left font-normal',
                        !field.value && 'text-muted-foreground'
                      )}
                    >
                      {field.value ? (
                        format(field.value, 'PPP')
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date('1900-01-01')
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>
                The date when the game was bought.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="buyPrice"
          render={() => (
            <FormItem>
              <FormLabel>Buy Price</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g.: 20"
                  type="number"
                  {...form.register('buyPrice', {
                    setValueAs: (v) =>
                      setValueAsNumber(v, defaultValues.current.buyPrice),
                  })}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* <Input
          label="Price"
          type="number"
          {...form.register('buyPrice', {
            setValueAs: (v) => setValueAsNumber(v, defaultValues.buyPrice),
          })}
        /> */}

        <FormField
          control={form.control}
          name="comment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Comment</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Add any additional information..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="platformId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Platform</FormLabel>
              <Select
                onValueChange={(value) => field.onChange(Number(value))}
                defaultValue={
                  typeof field.value === 'number'
                    ? String(field.value)
                    : undefined
                }
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a platform" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {platforms?.map((platform) => (
                    <SelectItem key={platform.id} value={String(platform.id)}>
                      {platform.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
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
    </Form>
  );
};

export default GameForm;
