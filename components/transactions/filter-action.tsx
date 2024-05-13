import { useState, useEffect } from "react";

import { ChevronDown, ListFilter } from "lucide-react";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { transactionData } from "@/lib/fetch-data";
import { Separator } from "../ui/separator";

export type TransactionData = {
  id: string;
  userId: string;
  amount: number;
  type: "Expense" | "Income";
  categoryId: string;
  description: string;
  date: string;
  methodCode: string;
};

interface FilterActionProps {
  data: TransactionData[];
  setFilteredData: Function;
}

export function FilterAction({ data, setFilteredData }: FilterActionProps) {
  const [categories, setCategories] = useState<string[]>([]);
  const [methods, setMethods] = useState<string[]>([]);
  const [filters, setFilters] = useState<{ category: string[]; type: string[]; method: string[] }>({
    category: [],
    type: ["Expense", "Income"],
    method: [],
  });
  const [sortOption, setSortOption] = useState("");

  useEffect(() => {
    const fetchedData = transactionData();
    fetchedData.then((datas) => {
      if (datas) {
        const categoryArr = datas.categories?.map((category: any) => category.name);
        const methodArr = datas.methods?.map((method: any) => method.name);
        setCategories(categoryArr);
        setMethods(methodArr);
        setFilters({ ...filters, category: categoryArr, method: methodArr });
      }
    });
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters]);

  const applyFilters = () => {
    let filteredData = [...data];

    // Apply category filter
    if (filters.category.length > 0) {
      filteredData = filteredData.filter((transaction) => filters.category.includes(transaction.categoryId));
      console.log(filteredData);
    }

    // Apply type filter
    if (filters.type.length > 0) {
      filteredData = filteredData.filter((transaction) => filters.type.includes(transaction.type));
      console.log(filteredData);
    }

    // Apply method filter
    if (filters.method.length > 0) {
      filteredData = filteredData.filter((transaction) => filters.method.includes(transaction.methodCode));
      console.log(filteredData);
    }

    setFilteredData(filteredData);
  };

  const handleSort = (sortBy: string) => {
    let sortedData = [...data];
    if (sortOption === sortBy) {
      sortedData.reverse();
    } else {
      // Otherwise, sort the data by the selected option
      sortedData.sort((a, b) => {
        if (sortBy === "Date") {
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        } else if (sortBy === "Amount") {
          return a.amount - b.amount;
        }
        return 0;
      });
    }
    setFilteredData(sortedData);
    setSortOption(sortBy);
  };

  const handleCategoryChange = (selectedCategory: string) => {
    setFilters((prevFilters) => {
      const updatedCategories = prevFilters.category.includes(selectedCategory)
        ? prevFilters.category.filter((category) => category !== selectedCategory)
        : [...prevFilters.category, selectedCategory];
      return { ...prevFilters, category: updatedCategories };
    });
  };

  const handleTypeChange = (selectedType: string) => {
    setFilters((prevFilters) => {
      const updatedTypes = prevFilters.type.includes(selectedType)
        ? prevFilters.type.filter((type) => type !== selectedType)
        : [...prevFilters.type, selectedType];
      return { ...prevFilters, type: updatedTypes };
    });
  };

  const handleMethodChange = (selectedMethod: string) => {
    setFilters((prevFilters) => {
      const updatedMethods = prevFilters.method.includes(selectedMethod)
        ? prevFilters.method.filter((method) => method !== selectedMethod)
        : [...prevFilters.method, selectedMethod];
      return { ...prevFilters, method: updatedMethods };
    });
  };

  const clearAll = () => {
    setFilters({ category: categories, method: methods, type: ["Expense", "Income"] });
    setFilteredData(data);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className=" gap-2" variant="outline">
          <ListFilter className=" h-6 w-6" />
          Filter
        </Button>
      </PopoverTrigger>
      <PopoverContent className=" mr-8">
        <div className="space-y-6">
          {/* Filter Section */}
          <section className=" space-y-3">
            <h1>Filter by</h1>
            <Separator />

            <div className="flex flex-col gap-4">
              <div className="flex gap-4">
                {/* Dropdown for Category filter */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="min-w-[120px] justify-start dark:bg-neutral-900">
                      Category <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {categories?.map((category, index) => (
                      <DropdownMenuCheckboxItem
                        key={index}
                        className={`capitalize`}
                        checked={filters.category.includes(category.toString())}
                        onCheckedChange={() => handleCategoryChange(category.toString())}
                        textValue={category.toString()}
                      >
                        {category}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Dropdown for Method filter */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className=" min-w-[110px] justify-start dark:bg-neutral-900">
                      Method <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="" align="end">
                    {methods?.map((method, index) => (
                      <DropdownMenuCheckboxItem
                        key={index}
                        className="capitalize"
                        checked={filters.method.includes(method.toString())}
                        onCheckedChange={() => handleMethodChange(method.toString())}
                        textValue={method.toString()}
                      >
                        {method}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="flex gap-4">
                {/* Dropdown for Type filter */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="min-w-[120px] justify-start dark:bg-neutral-900">
                      Txn Type <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {["Expense", "Income"].map((type, index) => (
                      <DropdownMenuCheckboxItem
                        key={index}
                        className="capitalize"
                        checked={filters.type.includes(type.toString())}
                        onCheckedChange={() => handleTypeChange(type.toString())}
                        textValue={type.toString()}
                      >
                        {type}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Clear All Button */}
                <Button
                  variant="outline"
                  onClick={() => clearAll()}
                  className=" min-w-[110px] border-red-500 dark:bg-red-700/30"
                >
                  Clear All
                </Button>
              </div>
            </div>
          </section>

          {/* Sorting Button */}
          <section className=" space-y-3">
            <h1>Sort by</h1>
            <Separator />

            {/* Dropdown for Sort */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-auto dark:bg-neutral-900">
                  {sortOption ? sortOption : "Sort by"} <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuRadioGroup value={sortOption} onValueChange={handleSort}>
                  {["Date", "Amount"]?.map((sort, index) => (
                    <DropdownMenuRadioItem key={index} className="capitalize" value={sort.toString()}>
                      {sort}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </section>
        </div>
      </PopoverContent>
    </Popover>
  );
}
