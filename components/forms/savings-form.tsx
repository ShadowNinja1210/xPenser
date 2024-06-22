"use client";

import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

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
  formType: string;
}

function SavingsForm({ onSubmit, form, formType }: TransactionFormProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [nameLength, setNameLength] = useState(0);
  const [descriptionLength, setDescriptionLength] = useState(0);

  const isLoading = form.formState.isSubmitting;

  useEffect(() => {
    console.log("form");
    console.log(form);
  }, []);

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
          {/* 1. Name of the Goal */}
          <div>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="flex flex-col items-start">
                  <FormLabel className="uppercase text-xs font-bold">Goal&#39;s Name</FormLabel>
                  <FormControl>
                    <Input
                      value={field.value}
                      onChange={(e) => {
                        form.setValue(e.target.value.length <= 25 && "name", e.target.value);
                        e.target.value.length <= 25 && setNameLength(e.target.value.length);
                      }}
                      type="text"
                      className="border-2  focus-visible:ring-1 dark:text-white focus-visible:ring-offset-2"
                      placeholder="Name for the goal..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <p className="text-xs mt-1 text-muted-foreground text-right">{nameLength}/25</p>
          </div>

          {/* 2. Target Amount */}
          <FormField
            control={form.control}
            name="targetAmount"
            render={({ field }) => (
              <FormItem className="flex flex-col items-start">
                <FormLabel className="uppercase text-xs font-bold">Target Amount</FormLabel>
                <FormControl>
                  <Input
                    value={field.value}
                    onChange={(e) => form.setValue("targetAmount", parseInt(e.target.value))}
                    type="number"
                    className=" border-2  focus-visible:ring-1 dark:text-white focus-visible:ring-offset-2"
                    placeholder="Enter the target amount..."
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* 3. Description Textarea */}
          <div>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="flex flex-col items-start">
                  <FormLabel className="uppercase text-xs font-bold ">Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Add the description for the transaction..."
                      {...field}
                      onChange={(e) => {
                        form.setValue(e.target.value.length <= 35 && "description", e.target.value);
                        e.target.value.length <= 35 && setDescriptionLength(e.target.value.length);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <p className="text-xs mt-1 text-muted-foreground text-right">{descriptionLength}/35</p>
          </div>
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

export default SavingsForm;
