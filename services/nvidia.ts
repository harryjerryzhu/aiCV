// /services/nvidia.ts
// NVIDIA z-ai/glm4.7 LLM Service using OpenAI-compatible API

import OpenAI from "openai";
import { CVData } from "../types";

// JSON schema for CV structure (used in system prompt)
const cvSchemaDescription = `
{
  "fullName": "string",
  "email": "string", 
  "phone": "string",
  "location": "string",
  "linkedin": "string",
  "website": "string",
  "headline": "string (job title or professional headline)",
  "summary": "string",
  "skills": "string (comma separated list)",
  "interests": "string (comma separated list)",
  "experience": [
    {
      "id": "string",
      "jobTitle": "string",
      "company": "string", 
      "startDate": "string",
      "endDate": "string",
      "description": "string (polished, achievement-oriented)"
    }
  ],
  "education": [
    {
      "id": "string",
      "school": "string",
      "degree": "string",
      "startDate": "string",
      "endDate": "string",
      "description": "string"
    }
  ],
  "awards": [
    {
      "id": "string",
      "title": "string",
      "issuer": "string",
      "date": "string",
      "description": "string"
    }
  ],
  "memberships": [
    {
      "id": "string",
      "role": "string",
      "organization": "string",
      "date": "string"
    }
  ]
}`;

export const polishCVWithNvidia = async (currentData: CVData): Promise<CVData> => {
  const apiKey = process.env.NVIDIA_API_KEY;

  console.log("=== NVIDIA API Debug ===");
  console.log("API Key present:", !!apiKey);
  console.log("API Key value:", apiKey ? `${apiKey.substring(0, 10)}...` : "MISSING");

  if (!apiKey || apiKey === "undefined" || apiKey.trim() === "") {
    console.error("API Key is missing or undefined!");
    throw new Error("NVIDIA API Key is missing. Please set NVIDIA_API_KEY in .env.local and restart the dev server.");
  }

  // Initialize OpenAI client with NVIDIA base URL
  const client = new OpenAI({
    baseURL: "https://integrate.api.nvidia.com/v1",
    apiKey: apiKey,
    dangerouslyAllowBrowser: true, // Required for browser-based usage
  });

  // Separate the photoUrl so we don't send large base64 strings to the AI
  const { photoUrl, ...dataForAI } = currentData;

  const systemPrompt = `You are an expert professional resume writer. 
You must respond ONLY with valid JSON matching this exact schema:
${cvSchemaDescription}

Do not include any markdown formatting, code blocks, or explanatory text. Return only the raw JSON object.`;

  const userPrompt = `
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
    console.log("Sending request to NVIDIA API...");
    console.log("Model: z-ai/glm4.7");
    console.log("Base URL: https://integrate.api.nvidia.com/v1");

    // Use Vite proxy to avoid CORS issues
    const response = await fetch("/api/nvidia/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "z-ai/glm4.7",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 1,
        top_p: 1,
        max_tokens: 16384,
        stream: false,
      }),
    });

    console.log("Response status:", response.status);
    console.log("Response ok:", response.ok);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Error Response:", errorText);
      throw new Error(`NVIDIA API Error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log("Response received from NVIDIA API");

    const fullContent = data.choices?.[0]?.message?.content;

    if (!fullContent) {
      console.error("No content in response:", data);
      throw new Error("No response content from NVIDIA AI");
    }

    console.log("Raw response length:", fullContent.length);

    // Clean up response - remove potential markdown code blocks
    let cleanedContent = fullContent.trim();
    if (cleanedContent.startsWith("```json")) {
      cleanedContent = cleanedContent.slice(7);
    }
    if (cleanedContent.startsWith("```")) {
      cleanedContent = cleanedContent.slice(3);
    }
    if (cleanedContent.endsWith("```")) {
      cleanedContent = cleanedContent.slice(0, -3);
    }
    cleanedContent = cleanedContent.trim();

    const polishedData = JSON.parse(cleanedContent) as CVData;

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
      interests: polishedData.interests || "",
    };
  } catch (error: any) {
    console.error("=== NVIDIA API Error Details ===");
    console.error("Error type:", error?.constructor?.name);
    console.error("Error message:", error?.message);
    console.error("Full error:", error);
    throw error;
  }
};

// Export as default and with alias for easy migration
export { polishCVWithNvidia as polishCVWithGemini };
export default polishCVWithNvidia;
