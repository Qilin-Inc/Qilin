"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Tournament name must be at least 2 characters.",
  }),
  game: z.string(),
  location: z.string().min(2, {
    message: "Location must be at least 2 characters.",
  }),
  startDate: z.date(),
  endDate: z.date(),
});

export function CreateTournamentForm({ onSubmit }: { onSubmit: (data: z.infer<typeof formSchema>) => Promise<{ success: boolean; error?: string }> }) {
  const [openStart, setOpenStart] = useState(false);
  const [openEnd, setOpenEnd] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      game: "Valorant",
      location: "",
    },
  });

  const handleStartDateSelect = (date: Date | undefined) => {
    if (date) {
      console.log(date);
      form.setValue("startDate", date);
      setOpenStart(false);
    } else {
      console.log("No date selected");
    }
  };

  const handleEndDateSelect = (date: Date | undefined) => {
    if (date) {
      form.setValue("endDate", date);
      setOpenEnd(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Tournament Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Summer Championship 2024"
                  {...field}
                  className="bg-neutral-800 border-neutral-700 text-neutral-200 focus:ring-blue-500 focus:border-blue-500 w-full"
                />
              </FormControl>
              <FormMessage className="text-red-400" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="game"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Game Type</FormLabel>
              <FormControl>
                <Input
                  disabled
                  placeholder="Valorant"
                  {...field}
                  className="bg-neutral-800 border-neutral-700 text-neutral-200 w-full"
                />
              </FormControl>
              <FormMessage className="text-red-400" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Location</FormLabel>
              <FormControl>
                <Input
                  placeholder="Kuala Lumpur, Malaysia"
                  {...field}
                  className="bg-neutral-800 border-neutral-700 text-neutral-200 focus:ring-blue-500 focus:border-blue-500 w-full"
                />
              </FormControl>
              <FormMessage className="text-red-400" />
            </FormItem>
          )}
        />
        <div className="flex flex-col sm:flex-row gap-4">
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem className="flex flex-col w-full">
                <FormLabel className="text-white">Start Date</FormLabel>
                <Popover open={openStart} onOpenChange={setOpenStart}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal bg-neutral-800 border-neutral-700 text-neutral-200",
                          !field.value && "text-neutral-400"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 text-neutral-400" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-neutral-900 text-white border-neutral-700" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={handleStartDateSelect}
                      disabled={(date) => date < new Date()}
                      initialFocus
                      className="bg-neutral-900 text-white border-neutral-700"
                      classNames={{
                        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                        month: "space-y-4",
                        caption: "flex justify-center pt-1 relative items-center text-white",
                        caption_label: "text-sm font-medium text-white",
                        nav: "space-x-1 flex items-center",
                        nav_button: "h-7 w-7 bg-neutral-800 hover:bg-neutral-700 text-white rounded-md flex items-center justify-center",
                        nav_button_previous: "absolute left-1",
                        nav_button_next: "absolute right-1",
                        table: "w-full border-collapse space-y-1",
                        head_row: "flex",
                        head_cell: "text-neutral-400 rounded-md w-9 font-normal text-[0.8rem]",
                        row: "flex w-full mt-2",
                        cell: "text-center text-sm p-0 relative w-9 h-9",
                        day: cn(
                          "h-9 w-9 p-0 font-normal rounded-md text-white hover:bg-neutral-700",
                          "focus:bg-neutral-700 focus:text-white"
                        ),
                        day_selected: "bg-blue-600 text-white hover:bg-blue-700",
                        day_today: "border border-blue-500 text-white",
                        day_disabled: "text-neutral-500 opacity-50",
                      }}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem className="flex flex-col w-full">
                <FormLabel className="text-white">End Date</FormLabel>
                <Popover open={openEnd} onOpenChange={setOpenEnd}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal bg-neutral-800 border-neutral-700 text-neutral-200",
                          !field.value && "text-neutral-400"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 text-neutral-400" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-neutral-900 text-white border-neutral-700" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={handleEndDateSelect}
                      disabled={(date) => date < new Date()}
                      initialFocus
                      className="bg-neutral-900 text-white border-neutral-700"
                      classNames={{
                        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                        month: "space-y-4",
                        caption: "flex justify-center pt-1 relative items-center text-white",
                        caption_label: "text-sm font-medium text-white",
                        nav: "space-x-1 flex items-center",
                        nav_button: "h-7 w-7 bg-neutral-800 hover:bg-neutral-700 text-white rounded-md flex items-center justify-center",
                        nav_button_previous: "absolute left-1",
                        nav_button_next: "absolute right-1",
                        table: "w-full border-collapse space-y-1",
                        head_row: "flex",
                        head_cell: "text-neutral-400 rounded-md w-9 font-normal text-[0.8rem]",
                        row: "flex w-full mt-2",
                        cell: "text-center text-sm p-0 relative w-9 h-9",
                        day: cn(
                          "h-9 w-9 p-0 font-normal rounded-md text-white hover:bg-neutral-700",
                          "focus:bg-neutral-700 focus:text-white"
                        ),
                        day_selected: "bg-blue-600 text-white hover:bg-blue-700",
                        day_today: "border border-blue-500 text-white",
                        day_disabled: "text-neutral-500 opacity-50",
                      }}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white w-full">
          Create Tournament
        </Button>
      </form>
    </Form>
  );
}