
import { GoogleGenAI, Type } from "@google/genai";
import { MenuItem, RecommendedItem } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export async function getMenuRecommendations(
  userInput: string,
  menu: MenuItem[]
): Promise<RecommendedItem[]> {
  try {
    const menuForPrompt = menu.map(({ id, name, category, description, price }) => ({
      id,
      name,
      category,
      description,
      price,
    }));

    const prompt = `You are a helpful menu assistant for a cafe called 'Happy Hearts Coffee & Prints'. A customer asks: "${userInput}". 
    Based on the following menu, recommend up to 3 items that best match their request.
    Menu: ${JSON.stringify(menuForPrompt)}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: {
                type: Type.INTEGER,
                description: "The ID of the recommended menu item.",
              },
              reason: {
                type: Type.STRING,
                description: "A short reason why this item is a good recommendation.",
              },
            },
            required: ["id", "reason"],
          },
        },
      },
    });

    const jsonText = response.text.trim();
    const recommendations: RecommendedItem[] = JSON.parse(jsonText);
    return recommendations;
  } catch (error) {
    console.error("Error getting menu recommendations:", error);
    return [];
  }
}
