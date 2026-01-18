"use client";

import { Control, FieldValues, Path } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { IconMinus, IconPlus } from "@tabler/icons-react";

// --- TIPE DATA ---
interface BaseProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  description?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  rows?: number;
}

// --- 1. REUSABLE INPUT (Text, Number, Date, File) ---
interface FormInputProps<T extends FieldValues> extends BaseProps<T> {
  type?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void; // Custom handler (opsional)
}

export function FormInput<T extends FieldValues>({
  control,
  name,
  label,
  type = "text",
  description,
  placeholder,
  disabled,
  required,
  onChange,
}: FormInputProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            {label} {required && <span className="text-red-500">*</span>}
          </FormLabel>
          <FormControl>
            <Input
              {...field}
              type={type}
              placeholder={placeholder}
              disabled={disabled}
              // Jika ada custom onChange (misal file upload), pakai itu. Jika tidak, pakai bawaan field.
              onChange={onChange ? onChange : field.onChange}
              value={type === "file" ? undefined : field.value} // Fix error file input value
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

// --- 2. REUSABLE NUMBER INPUT ---
interface FormNumberProps<T extends FieldValues = FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  description?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  step?: string | number;
  min?: string | number;
  max?: string | number;
  withButtons?: boolean; // Show increment/decrement buttons
}

export function FormNumber<T extends FieldValues = FieldValues>({
  control,
  name,
  label,
  description,
  placeholder,
  disabled,
  required,
  step = 1,
  min,
  max,
  withButtons = false,
}: FormNumberProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const handleIncrement = () => {
          const currentValue = parseFloat(field.value) || 0;
          field.onChange(currentValue + (parseFloat(step as string) || 1));
        };

        const handleDecrement = () => {
          const currentValue = parseFloat(field.value) || 0;
          const newValue = currentValue - (parseFloat(step as string) || 1);
          if (newValue >= 0) {
            field.onChange(newValue);
          }
        };

        return (
          <FormItem>
            <FormLabel>
              {label} {required && <span className="text-red-500">*</span>}
            </FormLabel>
            {withButtons ? (
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleDecrement}
                  disabled={disabled}
                >
                  <IconMinus size={16} />
                </Button>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    placeholder={placeholder}
                    disabled={disabled}
                    step={step}
                    min={min}
                    max={max}
                    onChange={(e) =>
                      field.onChange(parseFloat(e.target.value) || 0)
                    }
                    value={field.value ?? ""}
                  />
                </FormControl>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleIncrement}
                  disabled={disabled}
                >
                  <IconPlus size={16} />
                </Button>
              </div>
            ) : (
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  placeholder={placeholder}
                  disabled={disabled}
                  step={step}
                  min={min}
                  max={max}
                  onChange={(e) =>
                    field.onChange(parseFloat(e.target.value) || 0)
                  }
                  value={field.value ?? ""}
                />
              </FormControl>
            )}
            {description && <FormDescription>{description}</FormDescription>}
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}

// --- 3. REUSABLE SELECT (Smart Dropdown) ---
interface FormSelectProps<T extends FieldValues = FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  description?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  options: any[]; // Data array
  labelKey?: string; // Key untuk label (default: 'name' atau 'family_name')
  valueKey?: string; // Key untuk value (default: 'id')
}

export function FormSelect<T extends FieldValues = FieldValues>({
  control,
  name,
  label,
  options,
  placeholder,
  disabled,
  required,
  description,
  labelKey = "name",
  valueKey = "id",
}: FormSelectProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            {label} {required && <span className="text-red-500">*</span>}
          </FormLabel>
          <Select
            onValueChange={field.onChange}
            value={field.value?.toString() || ""}
            disabled={disabled}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={placeholder || "Pilih..."} />
              </SelectTrigger>
            </FormControl>
            <SelectContent position="popper">
              {(() => {
                const filteredOptions = options?.filter(
                  (item) =>
                    item &&
                    item[valueKey] !== undefined &&
                    item[valueKey] !== null,
                );

                if (!filteredOptions || filteredOptions.length === 0) {
                  return (
                    <div className="py-6 text-center text-sm text-muted-foreground">
                      Data tidak ditemukan
                    </div>
                  );
                }

                return filteredOptions.map((item, index) => (
                  <SelectItem
                    key={`${valueKey}-${item[valueKey]}-${index}`}
                    value={String(item[valueKey])}
                  >
                    {item[labelKey] ||
                      item["family_name"] ||
                      item["species_name"] ||
                      item["unit_name"]}
                  </SelectItem>
                ));
              })()}
            </SelectContent>
          </Select>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

// --- 4. REUSABLE TEXTAREA ---
export function FormTextarea<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  disabled,
}: BaseProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Textarea
              placeholder={placeholder}
              className="min-h-25"
              {...field}
              disabled={disabled}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
