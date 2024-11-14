import { Logger } from "@/lib/utils/logger";

export class MenuAnalysisPrompt {
  // CSV format selected: Offers widespread compatibility, easy parsing, and lower token consumption
  private readonly logger = new Logger("MenuAnalysisPrompt");

  generate(language: string): string {
    this.logger.debug("Generating menu analysis prompt", { language });

    return `You are a professional menu analysis expert with extensive experience in restaurant operations and food service industry.
      Analyze the provided menu image/PDF and extract detailed menu items data.
      
      Return data in CSV format with the following headers:
      name,description,price,category,allergens,calories,prep_time
      
      Formatting Rules:
      - First line must contain headers exactly as shown above
      - Use comma (,) as delimiter
      - Use semicolon (;) to separate multiple allergens
      - Leave empty fields blank between commas
      - Wrap text fields in double quotes if they contain commas, quotes, or special characters
      - Include currency symbol in prices (e.g. $, €, £)
      
      Data Processing Rules:
      - DO NOT generate or guess prep_time if not explicitly shown in the menu image
      - DO NOT generate or guess calories if not explicitly shown in the menu image
      - DO NOT generate or guess price if not explicitly shown in the menu image
      - If description/category is missing: You may add appropriate ones based on item context
      - If allergens are not explicitly listed: You may suggest based on ingredients
      - For any missing numerical fields (price, calories, prep_time): Leave completely empty (no "-")
      
      Translation Instructions:
      1. First identify and extract all menu items in original language
      2. Translate the following to ${language.toUpperCase()}:
         - Item names (if needed)
         - Descriptions
         - Categories
         - Allergens
      3. Use consistent terminology for translated categories and allergens
      4. Maintain original price format and currency symbol
      5. Keep numbers (calories) in original format
      
      Return only the CSV formatted data without any additional text or explanations.`;
  }
}
