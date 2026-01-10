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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

// --- TIPE DATA ---
interface BaseProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  description?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
}

// --- 1. REUSABLE INPUT (Text, Number, Date, File) ---
interface FormInputProps<T extends FieldValues> extends BaseProps<T> {
  type?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void; // Custom handler (opsional)
}

export function FormInput<T extends FieldValues>({
  control, name, label, type = "text", description, placeholder, disabled, required, onChange
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

// --- 2. REUSABLE SELECT (Smart Dropdown) ---
interface FormSelectProps<T extends FieldValues> extends BaseProps<T> {
  options: any[]; // Data array
  labelKey?: string; // Key untuk label (default: 'name' atau 'family_name')
  valueKey?: string; // Key untuk value (default: 'id')
}

export function FormSelect<T extends FieldValues>({
  control, name, label, options, placeholder, disabled, required, description,
  labelKey = "name", 
  valueKey = "id"
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
            defaultValue={field.value?.toString()} 
            disabled={disabled}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={placeholder || "Pilih..."} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options?.map((item) => (
                <SelectItem key={String(item[valueKey])} value={String(item[valueKey])}>
                  {item[labelKey] || item["family_name"] || item["species_name"] || item["unit_name"]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

// --- 3. REUSABLE TEXTAREA ---
export function FormTextarea<T extends FieldValues>({
  control, name, label, placeholder, disabled
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
              className="min-h-[100px]" 
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