# 🛡️ Guardia-AI: Smart Campus & City Safety Platform
### AI-Powered Multimodal Emergency Response & Surveillance Triage

[![Built with Gemini](https://img.shields.io/badge/AI-Google%20Gemini%203-blue?style=for-the-badge&logo=googlegemini)](https://aistudio.google.com/)
[![React](https://img.shields.io/badge/Frontend-React%2019-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![Tailwind](https://img.shields.io/badge/Styling-Tailwind%20CSS-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

**Guardia-AI**
It is an intelligent safety ecosystem designed for high-density environments like the **Pragati Engineering College campus**. It replaces slow, manual emergency reporting with an AI-driven triage system that analyzes text, voice, and imagery to save lives when seconds count.

---

## 🚀 Core Capabilities

### 1. Multimodal AI Triage
* **Instant Analysis:** Using `gemini-3-flash`, the system analyzes emergency reports via text or live photos.
* **Auto-Classification:** Automatically categorizes incidents (Medical, Fire, Security) and assigns a severity level (Critical, High, Medium, Low) before the report even reaches a human.

### 2. Guardia-Live (Voice Assistant)
* **Hands-Free SOS:** A real-time, low-latency voice interface powered by the `Gemini Live API`. 
* **Distress Support:** Provides human-like spoken instructions to users in distress while simultaneously transcribing the conversation for responders.

### 3. Smart Admin Dispatch Hub
* **Campus Mode:** Automatically suggests internal response units like Campus Security or the College Dispensary.
* **City Mode:** Uses **Google Maps Grounding** to locate the 5 nearest external hospitals or police stations with live distance tracking.

### 4. AI Safety Lab
* **Simulations:** Uses `Veo 3.1` to generate safety training videos and simulations for campus security drills.
* **Data Visualization:** Interactive heatmaps identify "Risk Zones" on campus based on historical incident data.

---

## 🧠 System Architecture

| Task                      | AI Model                   | Implementation                                    |
| **Incident Analysis**     | `gemini-3-flash-preview`   | Real-time JSON extraction & triage.               |
| **Emergency Voice**       | `gemini-2.5-flash-audio`   | WebSocket-based PCM audio streaming.              |
| **Strategic Reasoning**   | `gemini-3-pro-preview`     | High-stakes risk assessment & protocols.          |
| **Location Intelligence** | `gemini-2.5-flash`         | Live POI retrieval via Google Maps Tooling.       |
| **Training Media**        | `veo-3.1`                  | High-fidelity video generation for safety drills. |

---

## 🛠️ Installation & Local Setup

### 1. Prerequisites
* **Node.js** (v18+)
* **Google Gemini API Key** (Obtained via [Google AI Studio](https://aistudio.google.com/))

### 2. Setup Steps
```bash
# Clone the repository
git clone [https://github.com/your-username/guardia-ai.git](https://github.com/your-username/guardia-ai.git)

# Navigate to the directory
cd guardia-ai

# Install dependencies
npm install

# Set up environment variables
# Create a file named .env.local and add:
VITE_GEMINI_API_KEY=your_actual_key_here

# Start the development server
npm run dev
