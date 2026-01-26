
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { BrandBible, ImageSize } from "../types";

export class GeminiService {
  private static getAI() {
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  // Deep Architecture Generation (Thinking Mode)
  static async generateBrandBible(mission: string): Promise<BrandBible> {
    const ai = this.getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `You are a world-class brand strategist. Create a professional brand architecture for: "${mission}".
      Focus on industry-disrupting names, a 5-color palette with HEX codes, and premium Google Font pairings.
      Provide 6 high-fidelity logo prompts (Primary, Mono, Simplified, Grayscale, Secondary Seal, Symbolic Pattern).`,
      config: {
        thinkingConfig: { thinkingBudget: 32768 },
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            suggestedNames: { type: Type.ARRAY, items: { type: Type.STRING } },
            mission: { type: Type.STRING },
            palette: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  hex: { type: Type.STRING },
                  name: { type: Type.STRING },
                  usage: { type: Type.STRING }
                }
              }
            },
            typography: {
              type: Type.OBJECT,
              properties: {
                header: { type: Type.STRING },
                body: { type: Type.STRING },
                rationale: { type: Type.STRING }
              }
            },
            primaryLogoPrompt: { type: Type.STRING },
            monochromaticLogoPrompt: { type: Type.STRING },
            simplifiedIconPrompt: { type: Type.STRING },
            grayscaleLogoPrompt: { type: Type.STRING },
            secondaryMarkPrompt1: { type: Type.STRING },
            secondaryMarkPrompt2: { type: Type.STRING },
            usageNotes: { type: Type.STRING }
          },
          required: ["name", "palette", "typography", "primaryLogoPrompt"]
        }
      }
    });

    return JSON.parse(response.text || '{}') as BrandBible;
  }

  // Vision Analysis (Image Understanding)
  static async analyzeVision(base64Image: string): Promise<{ mission: string; keywords: string[] }> {
    const ai = this.getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: {
        parts: [
          { inlineData: { data: base64Image, mimeType: 'image/jpeg' } },
          { text: "Analyze this visual mood board. Extract a 1-sentence brand mission statement and 5 keywords describing its aesthetic tone. Return as JSON." }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            mission: { type: Type.STRING },
            keywords: { type: Type.ARRAY, items: { type: Type.STRING } }
          }
        }
      }
    });
    return JSON.parse(response.text || '{}');
  }

  // Image Generation
  static async generateBrandImage(prompt: string, size: ImageSize, style: string, ratio: string): Promise<string> {
    const ai = this.getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: { parts: [{ text: `${prompt}. ${style}. High-end brand mark, white background.` }] },
      config: { imageConfig: { aspectRatio: ratio as any, imageSize: size } }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
    }
    throw new Error("No image generated");
  }

  // Nano-Banana Image Editing
  static async editImage(base64Image: string, editPrompt: string): Promise<string> {
    const ai = this.getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { inlineData: { data: base64Image.split(',')[1], mimeType: 'image/png' } },
          { text: `Apply this edit to the image while preserving its logo structure: ${editPrompt}. Keep the background white.` }
        ]
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
    }
    throw new Error("Editing failed");
  }

  static async generateAbstractPlaceholder(size: ImageSize = '1K', ratio: string = "1:1"): Promise<string> {
    const ai = this.getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: { parts: [{ text: "Minimalist Bauhaus abstract geometric composition, premium muted colors, white background." }] },
      config: { imageConfig: { aspectRatio: ratio as any, imageSize: size } }
    });
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
    }
    return '';
  }

  // Search Grounded Chat
  static async chat(message: string, history: any[]): Promise<GenerateContentResponse> {
    const ai = this.getAI();
    return await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: history.concat({ role: 'user', parts: [{ text: message }] }),
      config: {
        tools: [{ googleSearch: {} }],
        systemInstruction: "You are Astra, a master brand strategist. Use Google Search for up-to-date market trends."
      }
    });
  }
}
