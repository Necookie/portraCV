# 🚀 PortraCV - Project Documentation
**Version:** 0.1.0 (Planning Phase)
**Status:** 🟡 Planning & Design
**Developer:** Dheyn Michael Orlanda

---

## 1. Project Overview
**PortraCV** is a proposed dual-purpose productivity web application designed for job seekers and printing businesses. It aims to streamline two critical workflows:
1.  **Resume Building:** Transforming raw user data into professional, ATS-friendly A4 PDF resumes.
2.  **ID Photo Studio:** Automating the layout of 1x1 and 2x2 ID photos for instant printing.

---

## 2. SDLC (Software Development Life Cycle)
**Methodology:** Agile (Iterative Development)

| Phase | Activity | Status |
| :--- | :--- | :--- |
| **Phase 1: Planning** | Define features, choose tech stack, create MVP document. | 🟡 **Current Stage** |
| **Phase 2: Foundation** | Setup React, Tailwind, and initial project structure. | ⚪ Pending |
| **Phase 3: Prototype** | Build non-functional UI (Resume Form & ID Grid). | ⚪ Pending |
| **Phase 4: Integration** | Connect Logic (PDF Generation, Photo Resizing). | ⚪ Pending |
| **Phase 5: Release** | Deploy MVP for testing. | ⚪ Pending |

---

## 3. Planned MVP Features
The Minimum Viable Product (MVP) will focus on the following core capabilities:

### 🟢 Module A: The Resume Builder
* **Dynamic Editor:** Inputs for Personal Info, Education, Experience.
* **Live Preview:** Real-time visual feedback of the A4 document.
* **PDF Export:** Browser-based PDF generation (client-side).

### 🟢 Module B: The ID Photo Studio
* **Photo Upload:** Standard image upload functionality.
* **"Job Hunt Combo" Layout:** Auto-generation of a 2x2 and 1x1 mix on a single A4 sheet.
* **Grid Layouts:** Standard full-page grids for batch printing.

---

## 4. SRS (Software Requirements Specification)

### 4.1 Proposed Tech Stack
* **Frontend:** React.js + Vite
* **Styling:** Tailwind CSS (v3)
* **Printing:** `react-to-print`
* **Icons:** Lucide-React

### 4.2 Functional Requirements (Draft)
* **REQ-01:** The app shall allow users to upload an image and render it in multiple predefined sizes (1x1, 2x2) without distortion.
* **REQ-02:** The app shall provide a split-screen interface (Input vs. Output).
* **REQ-03:** The print output must strictly adhere to A4 dimensions (210mm x 297mm).

---

## 5. Next Steps (Immediate To-Do)
- [ ] Initialize Git repository.
- [ ] Create Figma wireframe (optional) or paper sketch.
- [ ] Set up the React + Tailwind environment.