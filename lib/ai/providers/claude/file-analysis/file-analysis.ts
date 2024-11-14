import { FileAnalysisOptions } from "@/lib/ai/types";

export abstract class FileAnalysisStrategy {
  abstract analyzeFile: (options: FileAnalysisOptions) => Promise<any>;
}
