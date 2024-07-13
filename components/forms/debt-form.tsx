"use client";

import { useState, useEffect, useCallback } from "react";

import { differenceInDays, format } from "date-fns";

import { ChevronDown, Calendar as CalendarIcon, Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { Loader } from "../loaders/loader";
import { IDebtAccount } from "@/lib/types";
import { debtData } from "@/lib/fetch-data";
import { formatNum } from "@/lib/function-lib";
import { FaCheck } from "react-icons/fa6";

interface TransactionFormProps {
  onSubmit: Function;
  form: any;
  editData?: IDebtAccount;
  formType: "Add" | "Edit";
}

function TransactionForm({ onSubmit, form, editData, formType }: TransactionFormProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [loader, setLoader] = useState(true);
  const [open, setOpen] = useState(false); // State for the Popover component (Payment Source Dropdown)
  // For Values
  const [installmentSelected, setInstallmentSelected] = useState<number>(0); // State for the Number Installment Dropdown
  const [dueDate, setDueDate] = useState<Date | null>(editData?.dueDate ? new Date(editData.dueDate) : new Date()); // State for the Due Date
  const [borrowedDate, setBorrowedDate] = useState<Date | null>(
    editData?.dateBorrowed ? new Date(editData.dateBorrowed) : new Date()
  ); // State for the Borrowed Date
  const [sources, setSources] = useState<string[]>(["HDFC Bank", "SBI Bank", "Cash"]); // State for the Payment Source Dropdown
  const [value, setValue] = useState<string>(""); // State for the Payment Source Dropdown
  const [searchValue, setSearchValue] = useState<string>(""); // State for the Payment Source Dropdown (Search Value)
  const [calcAmount, setCalcAmount] = useState(0);

  const isLoading = form.formState.isSubmitting;

  const debounce = (func: any, delay: number) => {
    let debounceTimer: any;
    return (...args: any[]) => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => func(...args), delay);
    };
  };

  const fetchData = async () => {
    const data = await debtData();
    // if (data) setSources(data.sources);

    setLoader(false);
    return;
  };

  useEffect(() => {
    if (editData) {
      form.setValue("debtorName", editData.debtorName);
      form.setValue("amountBorrowed", editData.amountBorrowed);
      form.setValue("dateBorrowed", new Date(editData.dateBorrowed));
      form.setValue("dueDate", new Date(editData.dueDate));
      form.setValue("reason", editData.reason);
      form.setValue("installments", editData.installments);
      form.setValue("source", editData.source);
      form.setValue("interestRate", editData.interestRate);
      form.setValue("interestType", editData.interestType);
      form.setValue("amountToPay", editData.amountToPay);
    }
  }, [editData, form]);

  const calculateAmountToPay = () => {
    const principal = parseFloat(form.getValues("amountBorrowed"));
    const annualInterestRate = parseFloat(form.getValues("interestRate")) / 100;
    const numberOfEMIs = parseInt(form.getValues("installments"), 10);
    const currentAmountToPay = form.getValues("amountToPay");

    // Ensure all values are valid before calculation
    if (principal && numberOfEMIs && annualInterestRate && (currentAmountToPay === "" || !currentAmountToPay)) {
      // Convert annual interest rate to monthly interest rate
      const monthlyInterestRate = annualInterestRate / 12 / 100;

      // Calculate EMI using the standard formula
      const emi =
        (principal * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfEMIs)) /
        (Math.pow(1 + monthlyInterestRate, numberOfEMIs) - 1);

      let totalAmountToPay = 0;
      let remainingPrincipal = principal;

      for (let i = 0; i < numberOfEMIs; i++) {
        // Interest component for the current month
        const interestComponent = remainingPrincipal * monthlyInterestRate;

        // Principal component for the current month
        const principalComponent = emi - interestComponent;

        // Update remaining principal
        remainingPrincipal -= principalComponent;

        // Add the EMI to the total amount to pay
        totalAmountToPay += emi;
        console.log(totalAmountToPay);
      }

      // Round the total amount to the nearest integer
      setCalcAmount(Math.round(totalAmountToPay));
      console.log("Total Amount to Pay: ", totalAmountToPay);
    } else {
      console.error("Invalid input values for calculating amount to pay.");
    }
  };

  const debouncedCalculateAmountToPay = useCallback(debounce(calculateAmountToPay, 300), []);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const installments = Array.from({ length: 36 }, (_, i) => i + 1);

  if (!isMounted) {
    return null;
  }

  return loader ? (
    <Loader />
  ) : (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* ---------------- 1 ---------------- */}
        {/* Debtor's Name & Amount Borrowed */}
        <div className="space-y-4 px-2">
          {/* 1. Debtor's Name */}
          <div className="max-w-[360px] flex items-start justify-between text-center">
            <FormField
              control={form.control}
              name="debtorName"
              render={({ field }) => (
                <FormItem className="flex flex-col items-start">
                  <FormLabel className="uppercase text-xs font-bold">Debtor&#39;s Name</FormLabel>
                  <FormControl>
                    <Input
                      value={field.value}
                      onChange={(e) => form.setValue("debtorName", e.target.value)}
                      type="text"
                      className=" border-2 w-[160px] focus-visible:ring-1 dark:text-white focus-visible:ring-offset-2"
                      placeholder="Enter name"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* 2. Borrowed Amount */}
            <FormField
              control={form.control}
              name="amountBorrowed"
              render={({ field }) => (
                <FormItem className="flex flex-col items-start">
                  <FormLabel className="uppercase text-xs font-bold">Borrowed Amount</FormLabel>
                  <FormControl>
                    <Input
                      onChangeCapture={debouncedCalculateAmountToPay}
                      value={field.value}
                      onChange={(e) => form.setValue("amountBorrowed", parseInt(e.target.value))}
                      type="number"
                      className=" border-2 w-[160px] focus-visible:ring-1 dark:text-white focus-visible:ring-offset-2"
                      placeholder="Enter amount"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          {/* ---------------- 2 ---------------- */}
          {/* Dates Line */}
          <div className="flex items-start justify-between">
            {/* 3. Date Borrowed */}
            <FormField
              control={form.control}
              name="dateBorrowed"
              render={({ field }) => (
                <FormItem className="flex flex-col items-start">
                  <FormLabel className="uppercase text-xs font-bold ">Borrowed Date</FormLabel>
                  <FormControl>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[160px] justify-start text-left font-normal",
                            !borrowedDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {borrowedDate ? format(borrowedDate, "PP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={borrowedDate as Date}
                          onSelect={(e) => {
                            setBorrowedDate(e as Date);
                            form.setValue("dateBorrowed", e);
                          }}
                          initialFocus
                          disabled={(date: Date) => (dueDate && date > dueDate) || date < new Date("2023-01-01")}
                        />
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 4. Due Date */}
            <FormField
              control={form.control}
              name="dueDate"
              render={({ field }) => (
                <FormItem className="flex flex-col items-start">
                  <FormLabel className="uppercase text-xs font-bold ">Due Date</FormLabel>
                  <FormControl>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[160px] justify-start text-left font-normal",
                            !dueDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {dueDate ? format(dueDate, "PP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={dueDate as Date}
                          onSelect={(e) => {
                            setDueDate(e as Date);
                            form.setValue("dueDate", e);
                          }}
                          initialFocus
                          disabled={(date: Date) =>
                            (borrowedDate && date < borrowedDate) || date < new Date("1900-01-01")
                          }
                        />
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* ---------------- 3 ---------------- */}
          {/* Installments and Received Mode */}
          <div className="max-w-[360px] flex justify-between ">
            {/* 5. Installments */}
            <FormField
              control={form.control}
              name="installments"
              render={({ field }) => (
                <FormItem className="flex flex-col items-start">
                  <FormLabel className="uppercase text-xs font-bold ">No. of EMIs</FormLabel>
                  <FormControl>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          className={`w-20 justify-between ${!installmentSelected ? "text-neutral-400" : ""} `}
                        >
                          {!installmentSelected ? "Select" : installmentSelected}{" "}
                          <ChevronDown className="ml-2 h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="max-h-[240px] overflow-scroll custom-scrollbar">
                        {installments?.map((num, index) => {
                          return (
                            <DropdownMenuItem
                              key={index}
                              className="capitalize"
                              onSelect={() => {
                                form.setValue("installments", index + 1);
                                setInstallmentSelected(index + 1);
                                calculateAmountToPay();
                              }}
                              {...field}
                            >
                              {index + 1}
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

            {/* 6. Interest Rate */}
            <FormField
              control={form.control}
              name="interestRate"
              render={({ field }) => (
                <FormItem className="flex flex-col items-start">
                  <FormLabel className="uppercase text-xs font-bold">Rate &#40;pa%&#41;</FormLabel>
                  <FormControl>
                    <Input
                      value={field.value || editData?.interestRate}
                      onChange={(e) => {
                        form.setValue("interestRate", parseInt(e.target.value));
                        calculateAmountToPay();
                      }}
                      type="number"
                      className=" border-2 w-20 focus-visible:ring-1 text-center dark:text-white focus-visible:ring-offset-2"
                      placeholder="Rate"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* 7. Received Mode */}
            <FormField
              control={form.control}
              name="source"
              render={({ field }) => (
                <FormItem className="flex flex-col items-start">
                  <FormLabel className="uppercase text-xs font-bold ">Received Source</FormLabel>
                  <FormControl>
                    <Popover open={open} onOpenChange={setOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={open}
                          className={`w-[140px] justify-between ${value === "" ? "text-neutral-400" : ""} `}
                        >
                          {value ? sources.find((source) => source === value) : "Source..."}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[200px] p-0">
                        <Command>
                          <CommandInput
                            placeholder="Search source..."
                            onChangeCapture={(e) => setSearchValue(e.currentTarget.value)}
                          />
                          <CommandList>
                            <CommandGroup>
                              {sources?.map((source) => (
                                <CommandItem
                                  key={source}
                                  className="cursor-pointer"
                                  value={source}
                                  onClick={() => {
                                    setValue(source);
                                    form.setValue("source", source);
                                    setOpen(false);
                                  }}
                                  onSelect={(currentValue) => {
                                    setValue(currentValue === value ? "" : currentValue);
                                    form.setValue("source", source);
                                    setOpen(false);
                                  }}
                                >
                                  <Check
                                    className={cn("mr-2 h-4 w-4", value === source ? "opacity-100" : "opacity-0")}
                                  />
                                  {source}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                            <CommandEmpty className="px-1 py-1">
                              <Button
                                className=" bg-[#0a0a0a] w-full hover:bg-[#262626] text-white "
                                onClick={() => {
                                  sources.push(searchValue);
                                  setValue(searchValue);
                                  setOpen(false);
                                }}
                              >
                                {searchValue}
                              </Button>
                            </CommandEmpty>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* ---------------- 4 ---------------- */}
          {/* Interest Line */}
          <div className="flex justify-between items-start">
            {/* 8. Calculated Amount */}
            <div className="w-[160px] flex flex-col justify-between gap-3">
              <p className="text-xs uppercase font-bold">Calculated Amount:</p>
              <div className="flex gap-2 items-end">
                <p className="text-xl font-black">₹ {formatNum(calcAmount)}</p>
                {/* {calcAmount > 0 && (
                  <>
                    <button
                      onClick={() => {
                        form.setValue("amountToPay", calcAmount);
                      }}
                      className="mb-1 p-0.5 h-5 w-5 text-center text-green-500 bg-neutral-700 bg-opacity-40 rounded-md"
                    >
                      <FaCheck width={10} height={10} />
                    </button>
                    <button className="mb-1 p-1 h-5 w-5 flex font-semibold justify-center items-center text-center text-red-500 bg-neutral-700 bg-opacity-40 rounded-md">
                      X
                    </button>
                  </>
                )} */}
              </div>
            </div>

            {/* 9. Amount to Pay */}
            <FormField
              control={form.control}
              name="amountToPay"
              render={({ field }) => (
                <FormItem className=" w-[140px] flex flex-col items-start">
                  <FormLabel className="uppercase text-xs font-bold">Amount to Pay</FormLabel>
                  <FormControl>
                    <Input
                      value={field.value || editData?.amountToPay}
                      onChange={(e) => {
                        form.setValue("amountToPay", parseInt(e.target.value));
                      }}
                      type="number"
                      className=" border-2 w-full focus-visible:ring-1 dark:text-white focus-visible:ring-offset-2"
                      placeholder="Enter amount"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          {/* ---------------- 5 ---------------- */}
          {/* Reason Textarea */}
          <FormField
            control={form.control}
            name="reason"
            render={({ field }) => (
              <FormItem className="flex flex-col items-start">
                <FormLabel className="uppercase text-xs font-bold ">Reason</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe the reason for debt in brief..."
                    value={field.value || editData?.reason}
                    onChange={(e) => form.setValue("reason", e.target.value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            type="submit"
            className=" bg-blue-700 hover:bg-blue-900 text-white"
            disabled={isLoading}
            onClick={() => console.log("Submit button clicked")}
          >
            {formType === "Edit" ? "Save" : "Add"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}

export default TransactionForm;
