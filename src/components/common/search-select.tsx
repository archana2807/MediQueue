"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Search, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type Option = {
  value: string;
  label: string;
};

type Props = {
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  placeholder: string;
  loading?: boolean;
};

export default function SearchSelect({
  value,
  onChange,
  options,
  placeholder,
  loading,
}: Props) {
  const [open, setOpen] = React.useState(false);

  const selected = options.find((item) => item.value === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="h-10 w-full justify-between border-border/60 bg-background/50 px-3 text-sm font-normal hover:bg-background/80"
        >
          {selected ? (
            <span className="flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded bg-emerald-500/10">
                <Check className="h-3 w-3 text-emerald-400" />
              </span>
              {selected.label}
            </span>
          ) : (
            <span className="flex items-center gap-2 text-muted-foreground/60">
              <Search className="h-4 w-4" />
              {placeholder}
            </span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-40" />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="w-[var(--radix-popover-trigger-width)] p-0"
        align="start"
      >
        <Command>
          <CommandInput
            placeholder={`Search ${placeholder.toLowerCase()}...`}
            className="h-9"
          />

          <CommandList>
            {loading ? (
              <div className="flex items-center justify-center gap-2 py-6 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin text-emerald-400" />
                Loading doctors...
              </div>
            ) : (
              <>
                <CommandEmpty>
                  <div className="flex flex-col items-center gap-1 py-6 text-sm text-muted-foreground">
                    <Search className="h-5 w-5 opacity-40" />
                    No doctors found
                  </div>
                </CommandEmpty>

                <CommandGroup heading="Available Doctors">
                  {options.map((option) => {
                    const isSelected = value === option.value;
                    return (
                      <CommandItem
                        key={option.value}
                        value={option.label}
                        onSelect={() => {
                          onChange(option.value);
                          setOpen(false);
                        }}
                        className={`flex items-center gap-2.5 py-2 ${
                          isSelected ? "bg-emerald-500/10 text-emerald-400" : ""
                        }`}
                      >
                        <span
                          className={`flex h-5 w-5 items-center justify-center rounded border transition-colors ${
                            isSelected
                              ? "border-emerald-500 bg-emerald-500 text-white"
                              : "border-border/60"
                          }`}
                        >
                          {isSelected && <Check className="h-3 w-3" />}
                        </span>
                        <span className="flex-1">{option.label}</span>
                        {isSelected && (
                          <span className="text-[10px] font-medium text-emerald-400/60">
                            Selected
                          </span>
                        )}
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
