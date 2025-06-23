import { AxiosResponse } from "axios";
import { showToast, ToastType } from "../components/common/ToastMessage";
import { FormsService } from "../services/FormsService";
import { ProgrammeMembership } from "../models/ProgrammeMembership";
import { FormRUtilities } from "./FormRUtilities";

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
        error.message ?? JSON.stringify(error)
      } )
      `);
      showToast(
        `Failed to download ${filename} PDF. Please try again. (error msg: ${
          error.message ?? JSON.stringify(error)
        } ). `,
        ToastType.ERROR
      );
    }
  }
}

const formsService = new FormsService();
export function downloadCojPdf(
  id: string,
  matchedPm: ProgrammeMembership | undefined,
  setShowPdfHelp: (showPdfHelp: boolean) => void
) {
  if (matchedPm) {
    FileUtilities.downloadPdf(`conditions-of-joining_${id}.pdf`, () =>
      formsService.downloadTraineeCojPdf(matchedPm)
    );
  } else {
    FormRUtilities.windowPrint();
    return setShowPdfHelp(true);
  }
}

export function downloadLtftPdf(
  id: string
) {
    FileUtilities.downloadPdf(`ltft_${id}.pdf`, () =>
      formsService.downloadTraineeLtftPdf(id)
    );
}
