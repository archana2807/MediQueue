"use client";

import * as React from "react";
import {
  Check,
  ChevronsUpDown,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
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
  const [open, setOpen] =
    React.useState(false);

  const selected =
    options.find(
      (item) =>
        item.value === value
    );

  const defaultOptions =
    options.slice(0, 5);

  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
    >
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className="w-full justify-between"
        >
          {selected
            ? selected.label
            : placeholder}

          <ChevronsUpDown className="h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="w-[400px] p-0"
        align="start"
      >
        <Command>
          <CommandInput
            placeholder={`Search ${placeholder}`}
          />

          {loading ? (
            <div className="p-4 text-sm">
              Loading...
            </div>
          ) : (
            <>
              <CommandEmpty>
                No results found.
              </CommandEmpty>

              <CommandGroup heading="Suggestions">
                {defaultOptions.map(
                  (option) => (
                    <CommandItem
                      key={
                        option.value
                      }
                      value={
                        option.label
                      }
                      onSelect={() => {
                        onChange(
                          option.value
                        );

                        setOpen(
                          false
                        );
                      }}
                    >
                      <Check
                        className={`mr-2 h-4 w-4 ${
                          value ===
                          option.value
                            ? "opacity-100"
                            : "opacity-0"
                        }`}
                      />

                      {
                        option.label
                      }
                    </CommandItem>
                  )
                )}
              </CommandGroup>
            </>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  );
}