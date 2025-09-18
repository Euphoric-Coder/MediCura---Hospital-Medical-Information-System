"use client";

import * as React from "react";
import { ChevronDownIcon } from "lucide-react";
import { differenceInDays, format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function DateRangePicker({
  label = "Select Date Range",
  buttonWidth = "w-64",
  dateFormat = "MMM d, yyyy",
  onChange,
}) {
  const [open, setOpen] = React.useState(false);
  const [range, setRange] = React.useState({ from: undefined, to: undefined });

  const duration =
    range.from && range.to ? differenceInDays(range.to, range.from) + 1 : null;

  React.useEffect(() => {
    if (onChange) {
      onChange({
        start: range.from ? range.from.toISOString().split("T")[0] : null,
        end: range.to ? range.to.toISOString().split("T")[0] : null,
        duration,
      });
    }
  }, [range]);

  return (
    <div className="flex flex-col gap-3">
      {label && (
        <Label htmlFor="date-range" className="px-1">
          {label}
        </Label>
      )}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id="date-range"
            variant="outline"
            className={`${buttonWidth} justify-between font-normal`}
          >
            {range.from ? (
              range.to ? (
                <>
                  {format(range.from, dateFormat)} →{" "}
                  {format(range.to, dateFormat)}
                </>
              ) : (
                format(range.from, dateFormat)
              )
            ) : (
              "Select date range"
            )}
            <ChevronDownIcon className="ml-2 h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            selected={range}
            onSelect={(r) => {
              if (r) setRange(r);
              if (r?.from && r?.to) setOpen(false);
            }}
            numberOfMonths={2}
            captionLayout="dropdown"
          />
        </PopoverContent>
      </Popover>

      {duration && (
        <p className="text-green-400 font-medium">
          Duration: {duration} day{duration > 1 ? "s" : ""}
        </p>
      )}
    </div>
  );
}
