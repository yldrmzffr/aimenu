import { parse } from "csv-parse/sync";

import { MenuItem } from "@/types";
import { Logger } from "@/lib/utils/logger";

export function csvToJson(csvString: string): MenuItem[] {
  const logger = new Logger("csvToJson");

  logger.debug("Parsing CSV to JSON");

  try {
    const records = parse(csvString, {
      columns: true,
      skip_empty_lines: true,
      delimiter: ",",
      trim: true,
    }) as Record<string, string>[];

    logger.debug("CSV parsed to JSON", { records });

    return records.map(
      (record): MenuItem => ({
        name: record.name,
        description: record.description,
        price: record.price || undefined,
        category: record.category || undefined,
        allergens: record.allergens ? record.allergens.split(";") : [],
        calories: record.calories || undefined,
        prepTime: record.prep_time || undefined,
      }),
    );
  } catch (error) {
    logger.error("Failed to parse CSV to JSON", { error });

    return [];
  }
}
