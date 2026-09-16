import { Document, HeadingLevel, Packer, Paragraph, TextRun } from "docx";
import { jsPDF } from "jspdf";
import type { PlanDocument } from "../../domain/action-plan-catalog/PlanDocument";
export function planDocumentParagraphs(plan: PlanDocument) {
 return [
  {text:"Plan de Acción",heading:true},
  {text:"Ámbito: "+(plan.municipalityId==="granada-zaidin"?"Granada-Zaidín":plan.municipalityId)},
  {text:plan.status==="validated"?"Versión validada técnicamente":"BORRADOR — sin validar"},
  {text:"Fecha de versión: "+plan.generatedAt},
  ...(plan.validatedBy?[{text:"Validación técnica: "+plan.validatedBy}]:[]),
  {text:"La validación técnica no constituye aprobación institucional del Plan."},
  ...plan.paragraphs
 ];
}
export function buildPlanWord(plan: PlanDocument) {
 return new Document({creator:"COMPÁS NG",title:"Plan de Acción",styles:{default:{document:{run:{font:"Arial",size:22},paragraph:{spacing:{after:140}}}}},
 sections:[{properties:{page:{size:{width:11906,height:16838},margin:{top:1247,bottom:1247,left:1247,right:1247}}},children:planDocumentParagraphs(plan).map((p,i)=>new Paragraph({
 heading:i===0?HeadingLevel.TITLE:p.heading?HeadingLevel.HEADING_1:undefined,
 keepNext:!!p.heading,children:p.text.split("\n").map((t,j)=>new TextRun({text:t,break:j?1:0,color:"000000"}))
 }))}]});
}
export function buildPlanPdf(plan: PlanDocument) {
 const pdf=new jsPDF({unit:"mm",format:"a4"}); let y=22;
 const paragraphs=planDocumentParagraphs(plan);
 for (const p of paragraphs) {
  const size=p.heading?13:11; const lineHeight=p.heading?6.5:5.5;
  pdf.setFont("helvetica",p.heading?"bold":"normal");pdf.setFontSize(size);
  const lines=pdf.splitTextToSize(p.text.replace(/≥/g,">=").replace(/≤/g,"<=").replace(/≈/g,"~"),166) as string[];
  if (p.heading&&y+lineHeight*2>274){pdf.addPage();y=22;}
  for (const line of lines) {
   if(y+lineHeight>274){pdf.addPage();y=22;}
   pdf.text(line,22,y);y+=lineHeight;
  } y+=3;
 }
 const count=pdf.getNumberOfPages();
 for(let i=1;i<=count;i++){pdf.setPage(i);pdf.setFont("helvetica","normal");pdf.setFontSize(9);pdf.text("COMPÁS NG · "+i+" / "+count,22,286);}
 return pdf;
}
export async function downloadPlanDocument(plan:PlanDocument,format:"docx"|"pdf"){
 const blob=format==="docx"?await Packer.toBlob(buildPlanWord(plan)):buildPlanPdf(plan).output("blob");
 const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;
 a.download="Plan-Accion-"+plan.municipalityId.replace(/[^a-z0-9-]/gi,"-")+"-"+plan.status+"-"+plan.generatedAt.slice(0,10)+"."+format;
 document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
