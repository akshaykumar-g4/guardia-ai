
import { GoogleGenAI, Type } from "@google/genai";
import { IncidentType, Severity, SafetyService, IncidentScope } from "./types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

function calculateHaversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): string {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return d.toFixed(1);
}

export const resolveLocationAddress = async (lat: number, lng: number): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `What is the specific building name at coordinates: ${lat}, ${lng} in Surampalem, Pragati Engineering College?`,
      config: {
        tools: [{ googleMaps: {} }],
        toolConfig: {
          retrievalConfig: {
            latLng: {
              latitude: lat,
              longitude: lng
            }
          }
        }
      },
    });
    return response.text?.trim() || `Pragati Campus Zone (${lat.toFixed(3)})`;
  } catch (error) {
    return `Pragati Engineering College Campus`;
  }
};

export const getNearbySafetyServices = async (lat: number, lng: number, type: IncidentType, scope: IncidentScope): Promise<SafetyService[]> => {
  if (scope === 'CAMPUS') return []; 

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Identify the 5 best and closest city emergency services (specific hospital names, police stations, or fire departments) near the coordinates ${lat}, ${lng}. 
      Prioritize services that match the incident type: ${type}.
      Return strictly a raw JSON array of objects with keys: "name", "address", "latitude", "longitude".`,
      config: { 
        tools: [{ googleMaps: {} }],
        toolConfig: {
          retrievalConfig: {
            latLng: {
              latitude: lat,
              longitude: lng
            }
          }
        }
      },
    });
    let text = response.text || '[]';
    const jsonMatch = text.match(/\[.*\]/s);
    if (jsonMatch) text = jsonMatch[0];
    const parsed = JSON.parse(text);
    
    return parsed.map((s: any) => ({
      id: s.id || Math.random().toString(36).substr(2, 9),
      name: s.name,
      address: s.address,
      type,
      location: { lat: s.latitude || lat, lng: s.longitude || lng },
      distance: `${calculateHaversineDistance(lat, lng, s.latitude || lat, s.longitude || lng)} km`
    }));
  } catch (error) {
    console.error("City service retrieval failed:", error);
    return [];
  }
};

export const analyzeIncident = async (description: string, scope: IncidentScope, imageBase64?: string, locationName?: string) => {
  const model = 'gemini-3-flash-preview';
  
  const prompt = `
    Analyze this incident for Pragati Engineering College, Surampalem.
    Scope: ${scope}
    Description: "${description}"
    
    If scope is CAMPUS, you MUST select EXACTLY ONE of these as 'recommendedAsset':
    - 'Security Guards' (for fighting, control students, crime)
    - 'Dispensary' (for health, medical, sick students)
    - 'Principal' (for high problems, critical issues)
    - 'Director' (for high problems, administrative crisis)
    
    If scope is CITY, determine the generic primary responder type (e.g., 'Local Police Station', 'Nearest Hospital', 'Fire Department').
    
    Return JSON: { "type", "severity", "recommendation", "recommendedAsset" }
  `;

  const contents: any = { parts: [{ text: prompt }] };
  if (imageBase64) {
    contents.parts.push({ inlineData: { mimeType: 'image/jpeg', data: imageBase64.split(',')[1] || imageBase64 } });
  }

  try {
    const response = await ai.models.generateContent({
      model,
      contents,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            type: { type: Type.STRING },
            severity: { type: Type.STRING },
            recommendation: { type: Type.STRING },
            recommendedAsset: { type: Type.STRING }
          },
          required: ['type', 'severity', 'recommendation', 'recommendedAsset']
        }
      }
    });
    return JSON.parse(response.text);
  } catch (error) {
    return { type: IncidentType.OTHER, severity: Severity.MEDIUM, recommendation: "Alerting security.", recommendedAsset: scope === 'CAMPUS' ? "Security Guards" : "Local Authorities" };
  }
};
