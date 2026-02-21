
import { GoogleGenAI, Type, Modality } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Audio Helper Functions
export function decodeBase64(base64: string) {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

export async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

export const generateSpeech = async (text: string, voiceName: string = 'Zephyr') => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: text.substring(0, 500) }] }], // Limit length for speed
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName },
          },
        },
      },
    });
    
    return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data || null;
  } catch (error) {
    console.error("Speech generation failed", error);
    return null;
  }
};

export const translateToPidgin = async (text: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview', // Switched to Flash for speed
      contents: `Translate this business text into authentic, professional Nigerian Pidgin that sounds natural to a local trader: "${text}". Maintain the persuasive business intent. No extra explanation.`,
    });
    return response.text || text;
  } catch (error) {
    return text;
  }
};

export const analyzePrice = async (title: string, price: number, category: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview', // Switched to Flash for speed
      contents: `Quick Market Check: Is ₦${price.toLocaleString()} fair for "${title}" in ${category} in Nigeria? Give a 1-sentence verdict and reasoning based on 2024 inflation.`,
    });
    return response.text || "Market data unavailable.";
  } catch (error) {
    return "Price analysis unavailable.";
  }
};

export const getAppWalkthrough = async (section?: string) => {
  const context = section ? `the ${section} section` : "NairaMart";
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `1-sentence quick tip for ${context} in a Nigerian marketplace context regarding safety.`
  });
  return response.text || "";
};

export const generateContract = async (type: string, parties: string, details: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Draft a legally-sound (Nigerian commercial law) business agreement. Type: ${type}. Parties: ${parties}. Terms: ${details}.`,
    });
    return response.text || "Unable to generate contract.";
  } catch (error) {
    return "Contract generation failed.";
  }
};

// Fix: Added generateDescription for SellForm AI assistance
export const generateDescription = async (title: string, category: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Write a compelling 2-sentence marketing description for a ${category} item titled "${title}" for a premium Nigerian marketplace. Focus on trust and quality.`,
    });
    return response.text || "";
  } catch (error) {
    return "";
  }
};

// Fix: Added getPricingGuidance for BusinessSuite AI pricing
export const getPricingGuidance = async (cost: number, overhead: number, margin: number) => {
  try {
    const targetPrice = (cost + overhead) * (1 + margin / 100);
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Business Analysis: A merchant has cost ₦${cost}, overhead ₦${overhead}, and wants ${margin}% margin. Calculated price is ₦${targetPrice}. Is this competitive in the current 2024 Nigerian inflationary climate? Give a short 1-sentence strategic advice.`,
    });
    return response.text || "Pricing strategy unavailable.";
  } catch (error) {
    return "Pricing strategy unavailable.";
  }
};

// Fix: Added generateDebtReminder for BusinessSuite debt escalation
export const generateDebtReminder = async (customerName: string, amount: number) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Write a polite but firm 1-sentence debt reminder message in Nigerian Pidgin for a customer named ${customerName} who owes ₦${amount}. The tone should be professional merchant-to-merchant.`,
    });
    return response.text || `Reminder: Payment of ₦${amount} is due.`;
  } catch (error) {
    return `Reminder: Payment of ₦${amount} is due.`;
  }
};

export const validateProduct = async (title: string, description: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Safety check listing: "${title} - ${description}". Output JSON: {isAllowed: bool, reason: string, riskLevel: "Low"|"Medium"|"High"}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isAllowed: { type: Type.BOOLEAN },
            reason: { type: Type.STRING },
            riskLevel: { type: Type.STRING }
          },
          required: ["isAllowed", "reason", "riskLevel"]
        }
      }
    });
    return JSON.parse(response.text || '{"isAllowed":true}');
  } catch (error) {
    return { isAllowed: true, reason: "", riskLevel: "Low" };
  }
};

export const scanChatMessage = async (message: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Scan this marketplace chat message for "off-platform maneuvers" (sharing phone numbers, bank accounts, or keywords like "WhatsApp", "Transfer", "Physical Cash", "Pay direct"). 
      Message: "${message}"
      Output JSON: {isOffPlatformAttempt: bool, detectedKeywords: string[], riskScore: number (0-100), alertMessage: string}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isOffPlatformAttempt: { type: Type.BOOLEAN },
            detectedKeywords: { type: Type.ARRAY, items: { type: Type.STRING } },
            riskScore: { type: Type.NUMBER },
            alertMessage: { type: Type.STRING }
          },
          required: ["isOffPlatformAttempt", "detectedKeywords", "riskScore", "alertMessage"]
        }
      }
    });
    return JSON.parse(response.text || '{"isOffPlatformAttempt":false}');
  } catch (error) {
    return { isOffPlatformAttempt: false, detectedKeywords: [], riskScore: 0, alertMessage: "" };
  }
};
