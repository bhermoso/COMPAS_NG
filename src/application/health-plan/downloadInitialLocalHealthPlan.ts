import { Packer } from "docx";
import { buildPSLCDocx, buildPSLCPdf, type PSLCDocumentModel } from "../psl-c-export";

export async function downloadInitialLocalHealthPlan(model: PSLCDocumentModel, format: "docx" | "pdf") {
 const blob = format === "docx" ? await Packer.toBlob(buildPSLCDocx(model)) : buildPSLCPdf(model).output("blob");
 const url = URL.createObjectURL(blob);
 const link = document.createElement("a");
 link.href = url;
 link.download = model.fileName.replace(/\.docx$/, "." + format);
 document.body.appendChild(link);
 link.click();
 link.remove();
 setTimeout(() => URL.revokeObjectURL(url), 1000);
}
