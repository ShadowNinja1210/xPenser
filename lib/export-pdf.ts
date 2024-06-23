import jsPDFInvoiceTemplate, { OutputType } from "jspdf-invoice-template";
import { TransactionData } from "@/lib/types";
import currentProfile from "./current-profile";

export async function exportPdf(data: TransactionData[]) {
  const response = await currentProfile();
  const user = response?.toJSON();

  if (!user) {
    alert("User not found");
    return;
  }

  var props = {
    outputType: OutputType.Save,
    returnJsPDFDocObject: true,
    fileName: "Transactions",
    orientationLandscape: false,
    compress: false,
    logo: {
      src: "./Logo.png",
      type: "PNG",
      width: 80, // aspect ratio = width/height
      height: 30,
      margin: {
        top: 0,
        left: 0,
      },
    },
    business: {
      website: "www.xpenser.com",
    },
    contact: {
      label: "Transactions statement issued for:",
      name: user?.name || "User",
    },
    invoice: {
      label: "Transactions Statement",
      invDate: "Transactions from: 01/01/2021 18:12 to 02/02/2021 10:17",
      headerBorder: false,
      tableBodyBorder: false,
      header: [
        { title: "#", style: { width: 10 } },
        { title: "Amount", style: { width: 30 } },
        { title: "Category" },
        { title: "Method" },
        { title: "Description", style: { width: 80 } },
        { title: "Type" },
        { title: "Date" },
      ],
      table: data.map((item, index) => [
        index + 1,
        item?.amount.toString(),
        item?.categoryId || "",
        item?.methodCode || "",
        item?.description || "",
        item?.type || "",
        item?.date || "",
      ]),
    },
    pageEnable: true,
    pageLabel: "Page ",
  };

  jsPDFInvoiceTemplate(props);
}
