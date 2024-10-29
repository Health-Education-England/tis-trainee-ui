export class FileUtilities {
  public static downloadPdf(filename: string, content: Blob) {
    const pdf = new Blob([content], { type: "application/pdf" });
    const url = window.URL.createObjectURL(pdf);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }
}
