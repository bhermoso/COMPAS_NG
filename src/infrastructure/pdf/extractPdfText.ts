import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

/** Literal page text only: no OCR, inferred values or automatic interpretation. */
export async function extractPdfText(arrayBuffer: ArrayBuffer) {
 const {getDocument, GlobalWorkerOptions} = await import('pdfjs-dist');
 GlobalWorkerOptions.workerSrc = workerUrl;
 const bytes = new Uint8Array(arrayBuffer.slice(0));
 const sha256 = Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',arrayBuffer)), b=>b.toString(16).padStart(2,'0')).join('');
 const task = getDocument({data:bytes});
 try {
  const pdf = await task.promise; const pages: string[] = []; const emptyPages: number[] = [];
  for(let n=1;n<=pdf.numPages;n++) {
   const page = await pdf.getPage(n); const content = await page.getTextContent();
   let text=''; let lastY: number | undefined;
   for(const item of content.items) {
    if(!('str' in item))continue;
    const y=item.transform[5];
    if(lastY !== undefined && Math.abs(y-lastY)>3 && !text.endsWith('\n'))text+='\n';
    text+=item.str+(item.hasEOL?'\n':' ');lastY=y;
   }
   const value=text.trim(); if(!value)emptyPages.push(n);
   pages.push(`[Página ${n}]\n${value}`);page.cleanup();
  }
  return {text:emptyPages.length===pdf.numPages?'':pages.join('\n\n'),pageCount:pdf.numPages,emptyPages,sha256};
 } finally {await task.destroy();}
}
