import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";

import { trpc } from "@/trpc/client";

interface Props {
  onSelect: (id: number | null) => void;
  selectedId: number | null;
  className?: string;
  placeholder?: string;
}

function select(
  data: {
    id: number;
    name: string;
    manufacturer: string | null;
    createdAt: Date;
    updatedAt: Date;
  }[],
) {
  return data
    .map((platform) => ({
      value: platform.id,
      label: platform.name,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
}
export function PlatformSelector({
  onSelect,
  selectedId,
  className,
  placeholder = "Select a platform",
}: Props) {
  const { data: items = [] } = trpc.platform.all.useQuery(undefined, {
    staleTime: Infinity,
    select,
  });

  const selectedItem = items.find((item) => item.value === selectedId) ?? null;

  return (
    <Combobox
      items={items}
      value={selectedItem}
      onValueChange={(value) => {
        onSelect(value?.value ?? null);
      }}
    >
      <ComboboxInput className={className} placeholder={placeholder} />
      <ComboboxContent>
        <ComboboxEmpty>No platforms found.</ComboboxEmpty>
        <ComboboxList>
          {(option: (typeof items)[number]) => (
            <ComboboxItem key={option.value} value={option}>
              {option.label}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}
