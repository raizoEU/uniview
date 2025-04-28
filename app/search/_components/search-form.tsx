"use client";
import { searchSchema } from "@/app/search/page";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { parseAsIsoDate, useQueryState } from "nuqs";
import { z } from "zod";
import { Button } from "../../../components/ui/button";
import { Calendar } from "../../../components/ui/calendar";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../components/ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { Universities } from "@/lib/model/types";

type SearchSchemaType = z.infer<typeof searchSchema>;

type UniversitySelectorProps = {
  universityId: string | null;
  setUniversityId: (value: string | null) => void;
  uniQuery: Universities[];
};

type DateRangePickerProps = {
  startDate: Date | undefined;
  endDate: Date | undefined;
  setStartDate: (date: Date | null) => void;
  setEndDate: (date: Date | null) => void;
};

type SearchFormProps = {
  uniQuery: Universities[];
};

export function SearchForm({ uniQuery }: SearchFormProps) {
  const [startDate, setStartDate] = useQueryState("startDate", parseAsIsoDate);
  const [endDate, setEndDate] = useQueryState("endDate", parseAsIsoDate);

  const [location, setLocation] = useQueryState("location");

  const [universityId, setUniversityId] = useQueryState("universityId");

  const handleReset = () => {
    setStartDate(null);
    setEndDate(null);
    setLocation(null);
    setUniversityId(null);
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-4 md:gap-3 items-baseline">
        <div className="grid gap-3 grow max-sm:w-full">
          <Label htmlFor="location">Location</Label>
          <Input
            placeholder="Enter a location"
            id="location"
            value={location ?? ""}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
        <UniversitySelector
          universityId={universityId}
          setUniversityId={setUniversityId}
          uniQuery={uniQuery}
        />
        <DateRangePicker
          startDate={startDate ?? undefined}
          endDate={endDate ?? undefined}
          setEndDate={setEndDate}
          setStartDate={setStartDate}
        />
      </div>
      <div className="mt-4 flex gap-2.5">
        <Button variant="outline" className="h-full" onClick={handleReset}>
          Clear Filters
        </Button>
      </div>
    </div>
  );
}

function UniversitySelector({
  universityId,
  setUniversityId,
  uniQuery,
}: UniversitySelectorProps) {
  return (
    <div className="grid gap-3 mt-auto grow max-sm:w-full">
      <Label htmlFor="universityId">University</Label>
      <Select onValueChange={setUniversityId} value={universityId ?? ""}>
        <SelectTrigger>
          <SelectValue placeholder="Select a university" />
        </SelectTrigger>
        <SelectContent id="universityId">
          <SelectGroup>
            <SelectLabel>Select a university</SelectLabel>
            {uniQuery?.map((uni) => (
              <SelectItem key={uni.id} value={uni.id}>
                {uni.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}

function DateRangePicker({
  startDate,
  endDate,
  setStartDate,
  setEndDate,
}: DateRangePickerProps) {
  return (
    <div className={cn("grid gap-3 mt-auto max-sm:w-full")}>
      <Label htmlFor="dateRange">Date Range</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !startDate && !endDate && "text-muted-foreground"
            )}
          >
            <CalendarIcon />
            {!startDate && !endDate && "Pick a range of date to search"}
            {startDate?.toLocaleDateString("en-GB")}{" "}
            {endDate && "- " + endDate.toLocaleDateString("en-GB")}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={startDate ?? new Date()}
            selected={{ from: startDate, to: endDate }}
            onSelect={(dateRange) => {
              setStartDate(dateRange?.from ?? null);
              setEndDate(dateRange?.to ?? null);
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
