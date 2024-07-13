"use client";

import React, { useState, useEffect, ChangeEvent } from "react";

import { format } from "date-fns";

import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { DialogFooter } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface TransactionFormProps {
  onSubmit: Function;
  form: any;
}

function SavingTransactionForm({ onSubmit, form }: TransactionFormProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [date, setDate] = useState<Date>();

  let i = 0;
  const isLoading = form.formState.isSubmitting;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-4 px-2">
          {/* 1. Amount */}
          <div className="max-w-[360px] flex items-start justify-between text-center">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem className="flex flex-col items-start">
                  <FormLabel className="uppercase text-xs font-bold">Amount</FormLabel>
                  <FormControl>
                    <Input
                      value={field.value}
                      onChange={(e) => form.setValue("amount", parseInt(e.target.value))}
                      type="number"
                      className=" border-2 w-[160px] focus-visible:ring-1 dark:text-white focus-visible:ring-offset-2"
                      placeholder="Enter amount"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Date Picker */}
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col items-start">
                  <FormLabel className="uppercase text-xs font-bold ">Date</FormLabel>
                  <FormControl>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[160px] justify-start text-left font-normal",
                            !date && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date ? format(date, "PP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={(e) => {
                            setDate(e as Date);
                            form.setValue("date", e as Date);
                          }}
                          initialFocus
                          disabled={(date: Date) => date > new Date() || date < new Date("1900-01-01")}
                        />
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Type Radio */}
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Transaction Type</FormLabel>
                <FormControl>
                  <RadioGroup
                    className="flex items-end space-y-1"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      if (field.value === e.target.value) {
                        form.setValue("type", e.target.value);
                      }
                    }}
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="Withdrawal" onClick={() => form.setValue("type", "Withdrawal")} />
                      </FormControl>
                      <FormLabel className="font-normal">Withdrawal</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="Deposit" onClick={() => form.setValue("type", "Deposit")} />
                      </FormControl>
                      <FormLabel className="font-normal">Deposit</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Description Textarea */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="flex flex-col items-start">
                <FormLabel className="uppercase text-xs font-bold ">Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Add the description for the transaction..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" className=" bg-blue-700 hover:bg-blue-900 text-white" disabled={isLoading}>
            Submit
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}

export default SavingTransactionForm;
