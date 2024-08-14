import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { formatNum } from "@/lib/function-lib";
import { IDebtAccount } from "@/lib/types";
import { ProgressCircle } from "@tremor/react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

export const DebtAccountCards = ({ debt }: { debt: IDebtAccount }) => {
  return (
    <Card className=" min-w-80 w-full max-w-[400px] cursor-pointer">
      <CardHeader className="pb-2">
        <CardTitle className=" text-xl">{debt.debtorName}</CardTitle>
        <CardDescription>{debt.reason}</CardDescription>
      </CardHeader>
      <CardContent className="flex items-end justify-between pb-2">
        <div>
          <p>
            Due: <span className="font-bold text-lg">₹ {formatNum(Number(debt.amountToPay))}</span>
          </p>
          <p>Loan Amount: ₹ {formatNum(Number(debt.amountBorrowed))}</p>
        </div>
        <div>
          <ProgressCircle
            value={Math.floor(
              ((Number(debt.amountWithInterest) - Number(debt.amountToPay)) / Number(debt.amountWithInterest)) * 100
            )}
            size="md"
            showAnimation
            color={
              Math.floor(
                ((Number(debt.amountWithInterest) - Number(debt.amountToPay)) / Number(debt.amountWithInterest)) * 100
              ) >= 70
                ? "green"
                : Math.floor(
                    ((Number(debt.amountWithInterest) - Number(debt.amountToPay)) / Number(debt.amountWithInterest)) *
                      100
                  ) >= 50
                ? "amber"
                : "red"
            }
          >
            <span
              className={`${
                Math.floor(
                  ((Number(debt.amountWithInterest) - Number(debt.amountToPay)) / Number(debt.amountWithInterest)) * 100
                ) >= 70
                  ? "text-green-500"
                  : Math.floor(
                      ((Number(debt.amountWithInterest) - Number(debt.amountToPay)) / Number(debt.amountWithInterest)) *
                        100
                    ) >= 50
                  ? "text-orange-400"
                  : "text-red-400"
              } text-sm font-bold`}
            >
              {Math.floor(
                ((Number(debt.amountWithInterest) - Number(debt.amountToPay)) / Number(debt.amountWithInterest)) * 100
              )}
              %
            </span>
          </ProgressCircle>
        </div>
      </CardContent>
      <CardFooter className="text-xs py-1 bg-neutral-100 dark:bg-neutral-600 rounded-[0px_0px_5px_5px] flex items-center justify-center gap-1">
        <CalendarIcon className=" h-3.5 w-3.5" />

        <span className="mt-[2px]">{format(debt.dueDate, "PP")}</span>
      </CardFooter>
    </Card>
  );
};
