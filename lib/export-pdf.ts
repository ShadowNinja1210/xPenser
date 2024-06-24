import jsPDFInvoiceTemplate, { OutputType } from "jspdf-invoice-template";
import { TransactionData } from "@/lib/types";
import format from "date-fns/format";

export async function exportPdf(data: TransactionData[]) {
  const startDate = data[0]?.date;
  const endDate = data[data.length - 1]?.date;
  const dateStr: string =
    "Transactions from: " + format(new Date(startDate), "PP") + " to " + format(new Date(endDate), "PP");

  var props = {
    outputType: OutputType.Save,
    returnJsPDFDocObject: true,
    fileName: "Transactions",
    orientationLandscape: false,
    compress: false,
    logo: {
      src: "./Logo.png",
      type: "PNG",
      width: 85, // aspect ratio = width/height
      height: 30,
      margin: {
        top: 0,
        left: 0,
      },
    },
    business: {
      website: "www.xpenser.com",
    },
    invoice: {
      label: "Transactions Statement",
      invDate: dateStr,
      headerBorder: false,
      tableBodyBorder: false,
      header: [
        { title: "#", style: { width: 10 } },
        { title: "Amount", style: { width: 20 } },
        { title: "Category", style: { width: 30 } },
        { title: "Method", style: { width: 30 } },
        { title: "Description", style: { width: 50 } },
        { title: "Type", style: { width: 20 } },
        { title: "Date", style: { width: 30 } },
      ],
      table: data.map((item, index) => [
        index + 1,
        item?.amount.toString(),
        item?.categoryId || "",
        item?.methodCode || "",
        item?.description || "",
        item?.type || "",
        format(new Date(item?.date), "PP") || "",
      ]),
    },
    pageEnable: true,
    pageLabel: "Page ",
  };

  jsPDFInvoiceTemplate(props);
}
