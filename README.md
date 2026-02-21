# 🚀 PortraCV - AI Photo & Resume Studio

**Version:** 1.0.0 (Beta Release)  
**Designer & Developer:** Dheyn Michael Orlanda  

PortraCV is a productivity web application designed for job seekers and printing businesses. It streamlines the process of editing, organizing, and printing physical identification photos, saving time, paper, and money for photo booth operators.

---

## ✨ Key Features

### 🎨 The "Cozy" Aesthetic UI
Moving away from cold corporate themes, PortraCV features a warm, inviting `Stone/Rose` color palette. The interface is meticulously designed with rounded elements, deep drop shadows, interactive hover states, and smooth CSS keyframe animations (like floating widgets and cascade-in layouts) to provide a premium, dynamic feel.

### 🤖 AI Background Removal (Hugging Face Integration)
Tired of manually cutting out backgrounds in Photoshop? PortraCV integrates with a Python/FastAPI backend hosted on Hugging Face Spaces to instantly strip backgrounds from uploaded selfies using machine learning.
- **Client-Side Optimization:** Large 10MB+ camera uploads are instantly downscaled and compressed in the browser before being sent to the AI processing layer, slashing generation times from ~40s down to ~15s without losing physical print quality (maintains 300 DPI).
- **Customization:** Easily swap the transparent background for any hex color (e.g., standard ID Blue or White).

### 🖨️ Multi-Image Print Canvas
Designed specifically to save expensive photo paper in commercial printing settings.
- **Job Staging:** Instead of printing one person at a time, upload a photo, edit it, and "Add to Canvas". 
- **Mix & Match:** Stage different people, different background colors, and different layouts (e.g., a mix of 2x2s and Passports) onto the exact same A4 sheet.
- **Precision Margins:** The print engine overrides browser defaults to perfectly center the photo grid, utilizing 100% of the printable A4 area.

---

## 🛠️ Tech Stack

* **Frontend Framework:** React.js + Vite
* **Styling & Animation:** Tailwind CSS (v3)
* **Icons:** Lucide-React
* **Image Processing:** `react-easy-crop` & HTML5 Canvas API
* **Backend Integration:** Python, FastAPI, Hugging Face `rembg` (RMBG-1.4 model)

---

## 🚀 Getting Started

To run the application locally on your machine:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Necookie/portraCV.git
   cd portraCV
   ```

2. **Install frontend dependencies:**
   ```bash
   npm install
   ```

3. **Start the Vite development server:**
   ```bash
   npm run dev
   ```

4. **Open in Browser:**
   Navigate to `http://localhost:5173` to view the application.