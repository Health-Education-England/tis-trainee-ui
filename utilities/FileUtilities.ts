import { AxiosResponse } from "axios";

type PdfFunction = () => Promise<AxiosResponse<Blob>>;

export class FileUtilities {
  public static async downloadPdf(filename: string, getPdf: PdfFunction) {
    const response = await getPdf();
    const pdf = new Blob([response.data], { type: "application/pdf" });
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
