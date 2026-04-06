import * as React from "react";
import { cn } from "@/lib/utils";
import { Input } from "./ui/input";

type EditableContextProps = {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  isEditing: boolean;
  setIsEditing: (editing: boolean) => void;
};

const EditableContext = React.createContext<EditableContextProps | null>(null);

function useEditable() {
  const context = React.useContext(EditableContext);
  if (!context) {
    throw new Error("useEditable must be used within an EditableProvider");
  }
  return context;
}

export function Editable({
  value,
  onChange,
  children,
  disabled = false,
}: {
  value: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
  disabled?: boolean;
}) {
  const [isEditing, setIsEditing] = React.useState(false);
  return (
    <EditableContext.Provider
      value={{ value, onChange, disabled, isEditing, setIsEditing }}
    >
      {children}
    </EditableContext.Provider>
  );
}

export function EditableInput(
  props: React.InputHTMLAttributes<HTMLInputElement>,
) {
  const { value, onChange, isEditing, setIsEditing } = useEditable();
  const [inputValue, setInputValue] = React.useState<string | null>(null);

  if (!isEditing) {
    return null;
  }

  return (
    <Input
      {...props}
      autoFocus
      value={inputValue ?? value}
      onChange={(e) => setInputValue(e.target.value)}
      onBlur={(e) => {
        onChange(inputValue ?? value);
        setIsEditing(false);
      }}
    />
  );
}

export function EditablePreview({
  onClick,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const { value, isEditing, setIsEditing, disabled } = useEditable();
  if (isEditing) {
    return null;
  }

  return (
    <div
      onClick={(e) => {
        if (disabled) return;
        onClick?.(e);
        setIsEditing(true);
      }}
      aria-disabled={disabled}
      className={cn("aria-[disabled=false]:cursor-pointer", className)}
      {...props}
    >
      {value}
    </div>
  );
}
