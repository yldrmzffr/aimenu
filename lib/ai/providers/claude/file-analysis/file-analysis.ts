import { FileAnalysisOptions } from "@/types";

export abstract class FileAnalysisStrategy {
  abstract analyzeFile: (options: FileAnalysisOptions) => Promise<any>;
}
