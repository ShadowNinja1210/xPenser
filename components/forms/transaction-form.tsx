"use client";

import { useState, useEffect } from "react";

import { format } from "date-fns";

import { ChevronDown, Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { DialogFooter } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { Loader } from "../loaders/loader";

interface ICategory {
  _id: object;
  name: string;
  description?: string;
  type: "Expense" | "Income";
}

interface IUser extends Document {
  userId: string;
  email: string;
  name: string;
  profilePicture?: string;
  methods: { _id: string; code: string; name: string }[];
  categories: ICategory[];
}

interface TransactionFormProps {
  onSubmit: Function;
  form: any;
}

function TransactionForm({ onSubmit, form }: TransactionFormProps) {
  const today = new Date();
  const [isMounted, setIsMounted] = useState(false);
  const [categorySelected, setCategorySelected] = useState("");
  const [loader, setLoader] = useState(true);
  const [methodSelected, setMethodSelected] = useState("");
  const [date, setDate] = useState<Date>(today);

  const [profile, setProfile] = useState<IUser>({});

  const isLoading = form.formState.isSubmitting;

  const fetchData = async () => {
    const res = await fetch("/api/user");
    const data = await res.json();

    setProfile(data);
    setLoader(false);
    return;
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const categories = profile?.categories;
  const methods = profile?.methods;

  if (!isMounted) {
    return null;
  }

  let i = 0;

  return loader ? (
    <Loader />
  ) : (
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

            {/* Category Dropdown */}
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem className="flex flex-col items-start">
                  <FormLabel className="uppercase text-xs font-bold ">Category</FormLabel>
                  <FormControl>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          className={`w-[160px] justify-between ${categorySelected === "" ? "text-neutral-400" : ""} `}
                        >
                          {categorySelected === "" ? "Select" : categorySelected}{" "}
                          <ChevronDown className="ml-2 h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {categories?.map((category, index) => {
                          return (
                            <DropdownMenuItem
                              key={index}
                              className="capitalize"
                              onSelect={() => {
                                form.setValue("category", category._id);
                                setCategorySelected(category.name);
                                form.setValue("type", category.type);
                              }}
                              textValue={category._id.toString()}
                              {...field}
                            >
                              {category.name}
                            </DropdownMenuItem>
                          );
                        })}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="max-w-[360px] flex justify-between">
            {/* Payment Method Dropdown */}
            <FormField
              control={form.control}
              name="method"
              render={({ field }) => (
                <FormItem className="flex flex-col items-start">
                  <FormLabel className="uppercase text-xs font-bold ">Payment Method</FormLabel>
                  <FormControl>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          className={`w-[160px] justify-between ${methodSelected === "" ? "text-neutral-400" : ""} `}
                        >
                          {methodSelected === "" ? "Select" : methodSelected} <ChevronDown className="ml-2 h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {methods?.map((method) => {
                          return (
                            <DropdownMenuItem
                              key={method._id}
                              className="capitalize"
                              onSelect={() => {
                                form.setValue("method", method.code);
                                setMethodSelected(method.name);
                              }}
                              textValue={method.code}
                              {...field}
                            >
                              {method.name}
                            </DropdownMenuItem>
                          );
                        })}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </FormControl>
                  <FormMessage />
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
                            form.setValue("date", e);
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
                        <RadioGroupItem value="Expense" onClick={() => form.setValue("type", "Expense")} />
                      </FormControl>
                      <FormLabel className="font-normal">Expense</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="Income" onClick={() => form.setValue("type", "Income")} />
                      </FormControl>
                      <FormLabel className="font-normal">Income</FormLabel>
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

export default TransactionForm;
