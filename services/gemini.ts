import { GoogleGenAI, Type } from "@google/genai";
import { CVData } from "../types";

const apiKey = process.env.API_KEY;

// Schema definition for Structured Output to ensure strict JSON matching our TS types
const cvSchema = {
  type: Type.OBJECT,
  properties: {
    fullName: { type: Type.STRING },
    email: { type: Type.STRING },
    phone: { type: Type.STRING },
    location: { type: Type.STRING },
    linkedin: { type: Type.STRING },
    website: { type: Type.STRING },
    summary: { type: Type.STRING },
    skills: { type: Type.STRING, description: "Comma separated list of skills" },
    interests: { type: Type.STRING, description: "Comma separated list of interests/hobbies" },
    experience: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          jobTitle: { type: Type.STRING },
          company: { type: Type.STRING },
          startDate: { type: Type.STRING },
          endDate: { type: Type.STRING },
          description: { type: Type.STRING, description: "Polished, achievement-oriented description." },
        },
        required: ["jobTitle", "company", "description"]
      }
    },
    education: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          school: { type: Type.STRING },
          degree: { type: Type.STRING },
          startDate: { type: Type.STRING },
          endDate: { type: Type.STRING },
          description: { type: Type.STRING },
        },
        required: ["school", "degree"]
      }
    },
    awards: {
        type: Type.ARRAY,
        items: {
            type: Type.OBJECT,
            properties: {
                id: { type: Type.STRING },
                title: { type: Type.STRING },
                issuer: { type: Type.STRING },
                date: { type: Type.STRING },
                description: { type: Type.STRING },
            },
            required: ["title", "issuer"]
        }
    },
    memberships: {
        type: Type.ARRAY,
        items: {
            type: Type.OBJECT,
            properties: {
                id: { type: Type.STRING },
                role: { type: Type.STRING },
                organization: { type: Type.STRING },
                date: { type: Type.STRING },
            },
            required: ["role", "organization"]
        }
    }
  },
  required: ["fullName", "summary", "experience", "education", "skills"]
};

export const polishCVWithGemini = async (currentData: CVData): Promise<CVData> => {
  if (!apiKey) {
    throw new Error("API Key is missing.");
  }

  const ai = new GoogleGenAI({ apiKey });

  // Separate the photoUrl so we don't send large base64 strings to the AI
  const { photoUrl, ...dataForAI } = currentData;

  const prompt = `
    You are an expert professional resume writer.
    I will provide you with rough data for a Curriculum Vitae.

    CONTEXT - TARGET JOB:
    The user is applying to: ${dataForAI.targetCompany ? dataForAI.targetCompany : "General Application"}
    Target Role Title: ${dataForAI.targetRole ? dataForAI.targetRole : "N/A"}
    Target Job Description/Notes: ${dataForAI.targetJobDescription ? dataForAI.targetJobDescription : "N/A"}

    Your task is to:
    1. Correct any grammar or spelling errors.
    2. Rewrite the "summary" to be professional, concise, and impactful. IMPORTANT: Tailor the summary to align with the Target Job Context provided above (keywords, tone, specific skills).
    3. Rewrite job "description" fields to use strong action verbs and bullet points (using • or similar characters), focusing on achievements. Highlight experiences relevant to the Target Job.
    4. Rewrite award "description" fields if they exist, making them sound significant.
    5. Keep the structure strictly valid JSON.
    6. Maintain all existing IDs. If an ID is missing, generate a short random one.
    7. If a field is empty in the input, try to infer it from context if obvious, otherwise leave it empty or provide a professional placeholder.
    8. Format the "skills" and "interests" strings as clean, comma-separated lists.

    Here is the rough data:
    ${JSON.stringify(dataForAI)}
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: cvSchema,
        systemInstruction: "You are a helpful, professional career coach and resume expert."
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    const polishedData = JSON.parse(text) as CVData;
    
    // Restore the photoUrl to the polished data (and keep the target/theme info)
    return { 
        ...polishedData, 
        photoUrl, 
        targetCompany: currentData.targetCompany, 
        targetRole: currentData.targetRole, 
        targetJobDescription: currentData.targetJobDescription,
        themeColor: currentData.themeColor,
        awards: polishedData.awards || [], 
        memberships: polishedData.memberships || [],
        interests: polishedData.interests || ""
    };
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};