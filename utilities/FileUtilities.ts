import { AxiosResponse } from "axios";
import { showToast, ToastType } from "../components/common/ToastMessage";

type PdfFunction = () => Promise<AxiosResponse<Blob>>;

export class FileUtilities {
  public static async downloadPdf(filename: string, getPdf: PdfFunction) {
    try {
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
    } catch (error: any) {
      console.log(`PDF Fail error msg: ${
        error.response ? error.response : error
      } )
      `);
      showToast(
        `Failed to download ${filename} PDF. Please try again. (error msg: ${
          error.response ? error.response : error
        } ). `,
        ToastType.ERROR
      );
    }
  }
}
