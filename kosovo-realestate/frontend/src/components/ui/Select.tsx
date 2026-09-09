'use client';

import * as RadixSelect from '@radix-ui/react-select';
import { Check, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  value: string;
  onValueChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  className?: string;
  triggerClassName?: string;
}

export default function Select({ value, onValueChange, options, placeholder, className, triggerClassName }: SelectProps) {
  return (
    <RadixSelect.Root value={value} onValueChange={onValueChange}>
      <RadixSelect.Trigger
        className={cn(
          'input flex items-center justify-between gap-2 cursor-pointer select-none data-[placeholder]:text-neutral-400',
          triggerClassName || className
        )}
      >
        <RadixSelect.Value placeholder={placeholder} />
        <RadixSelect.Icon>
          <ChevronDown className="w-4 h-4 text-neutral-400 flex-shrink-0" />
        </RadixSelect.Icon>
      </RadixSelect.Trigger>
      <RadixSelect.Portal>
        <RadixSelect.Content
          position="popper"
          sideOffset={6}
          className="z-50 overflow-hidden rounded-xl border border-primary-100 dark:border-primary-900/40 bg-white dark:bg-neutral-800 shadow-lg animate-scale-in origin-top"
        >
          <RadixSelect.Viewport className="p-1 max-h-72">
            {options.map((opt) => (
              <RadixSelect.Item
                key={opt.value}
                value={opt.value}
                className="relative flex items-center gap-2 rounded-lg px-3 py-2 pl-8 text-sm text-neutral-700 dark:text-neutral-200 cursor-pointer select-none outline-none data-[highlighted]:bg-primary-50 data-[highlighted]:text-primary-700 dark:data-[highlighted]:bg-primary-950 dark:data-[highlighted]:text-primary-400 data-[state=checked]:font-medium"
              >
                <RadixSelect.ItemIndicator className="absolute left-2.5 inline-flex items-center">
                  <Check className="w-3.5 h-3.5 text-primary-600 dark:text-primary-400" />
                </RadixSelect.ItemIndicator>
                <RadixSelect.ItemText>{opt.label}</RadixSelect.ItemText>
              </RadixSelect.Item>
            ))}
          </RadixSelect.Viewport>
        </RadixSelect.Content>
      </RadixSelect.Portal>
    </RadixSelect.Root>
  );
}
