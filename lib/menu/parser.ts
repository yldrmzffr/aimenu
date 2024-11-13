import { parse } from "csv-parse/sync";

import { MenuItem } from "@/types";

export function csvToJson(csvString: string): MenuItem[] {
  try {
    const records = parse(csvString, {
      columns: true,
      skip_empty_lines: true,
      delimiter: ",",
      trim: true,
    }) as Record<string, string>[];

    return records.map(
      (record): MenuItem => ({
        name: record.name,
        description: record.description,
        category: record.category,
        price: record.price || undefined,
        allergens: record.allergens ? record.allergens.split(";") : [],
        calories: record.calories || undefined,
        prepTime: record.prep_time || undefined,
      }),
    );
  } catch (error) {
    console.error("CSV parsing error:", error);

    return [];
  }
}
