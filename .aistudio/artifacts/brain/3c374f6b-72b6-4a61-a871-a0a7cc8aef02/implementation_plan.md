# Implementation Plan: Visual Image Search, AI Sales Specialist & Robust Contact Automation

Integrate visual search with phone camera capture/upload, an intelligent AI Sales Specialist with product picking and recommendations, an automated multi-channel contact system (direct email to owner via Resend and WhatsApp integration), and high-performance image rendering optimization.

---

## 1. User Choices & Architecture Alignment
Based on the clarified requirements:
- **AI Sales Specialist**: Accessible via a sleek, non-intrusive floating chat widget across all pages (with quick-launcher pill and minimizing capability), also accessible on the contact page.
- **Visual Image Search**: Accessible via a camera icon in both header search bars and the catalog search bar, opening an interactive modal supporting:
  - Direct live camera capture (using the browser device camera / mobile video stream).
  - Image file upload or drag-and-drop from the user's phone / device storage.
  - Client-side image compression and Gemini Multimodal product identification.
- **Owner Contact Channels**: When buyers want to contact the owner directly or ask questions through the AI sales specialist or the contact form, both channels are supported:
  - Automated Resend email dispatched to the owner (`javalights2@gmail.com`) with customer name, phone, message, and referenced product details.
  - Instant WhatsApp direct link prefilled with formatted inquiry and customer details for real-time mobile texting.
- **Image Rendering Optimization**:
  - Integrate responsive srcset sizing and WebP/AVIF format priorities for Cloudinary & Unsplash assets.
  - Implement smooth blur placeholder states, skeleton loaders, and eager loading for hero/above-the-fold catalog items.

---

## 2. Proposed Changes

### A. Core Dependencies
- Install `@google/genai` for official server-side Gemini 3 API integration.

### B. Visual Image Search API & Modal
1. **Server Route (`/app/api/ai/visual-search/route.ts`)**:
   - Accepts base64 encoded image or FormData.
   - Uses Gemini Multimodal (`gemini-3.8-flash`) to analyze the image (identifying category, gang count, amperage, finish color, mounting type, and electrical keywords).
   - Queries the PostgreSQL database catalog to match the closest products.
   - Returns structured product matches with confidence tags, specifications, and direct product links.
2. **Visual Search Component (`/components/search/VisualSearchModal.tsx`)**:
   - Live camera viewfinder tab (with flip camera for mobile front/back camera switching and capture button).
   - File upload tab (drag-and-drop or select from photo library).
   - Instant preview, progress indicator with status steps ("Analyzing image...", "Matching catalog specifications...").
   - Clickable matched products list with direct "View Product" or "Add to Cart" actions.
3. **Trigger integration**:
   - Integrated into the global Header search bar (`/components/layout/header.tsx`).
   - Integrated into the catalog search header (`/features/products/components/header/ProductHeader.tsx`).

### C. AI Sales Specialist Floating Assistant
1. **Server Route (`/app/api/ai/sales-assistant/route.ts`)**:
   - Powered by Gemini (`gemini-3.8-flash`) with store system prompt grounded in the full catalog database (401 verified products in switches, sockets, isolators, panels, batteries, inverters).
   - Capabilities:
     - Recommends products based on buyer requirements (e.g., "I need a 45A cooker unit in silver with neon", "What battery capacity do I need for a 5kVA inverter?").
     - Answers electrical sizing and specification questions.
     - Detects buyer intent to contact the store owner, directly offering the owner's phone/WhatsApp or automated message forwarding.
     - Function tool calling / structured response: Returns actionable product recommendation cards with prices, images, and one-click cart buttons.
2. **AI Sales Specialist Component (`/components/ai/SalesSpecialistWidget.tsx`)**:
   - Floating widget in bottom-right corner with badge: "Electrical Specialist Online".
   - Suggestion quick chips: "Help me choose an inverter battery", "Find 13A double sockets", "Contact store owner".
   - Rich interactive message bubbles with product card previews and instant "Add to Cart".
   - Action buttons to "Send message directly to owner" or "Chat on WhatsApp".
3. **Mount in Root Layout (`/app/layout.tsx`)**:
   - Mount globally so users have continuous assistance while browsing, comparing products, or checking out.

### D. Contact Segment Hardening & Automation
1. **Server Contact API (`/app/api/contact/route.ts`)**:
   - Receives inquiries from both the contact page and the AI sales person widget.
   - Dispatches a formatted notification email to `javalights2@gmail.com` via Resend from `orders@orders.java-lights.com`.
   - Sends confirmation email to the buyer acknowledging their message.
2. **Enhance Contact Page & Form (`/components/contact/ContactForm.tsx`, `BusinessInfo.tsx`, `WhatsAppCTA.tsx`)**:
   - Connect real form submission to `/app/api/contact/route.ts` with error handling and success state.
   - Add direct action button to trigger the AI Sales Specialist for instant consultation.
   - Ensure the verified owner phone (`+234 800-BATTERY` / WhatsApp direct link) and email (`javalights2@gmail.com`) are prominent and clickable.

### E. Image Rendering Optimization
1. **Enhance `ProductCard.tsx` & `ProductGallery.tsx`**:
   - Add CSS transitions with fade-in on load to prevent layout shift.
   - Implement optimized `sizes` prop matching exact responsive breakpoints.
   - Configure image quality and priority attributes for the first 4 products in catalog grid.

---

## 3. Verification Plan
- **Build & Lint Verification**:
  - Run `compile_applet` and `lint_applet` to ensure type safety and error-free builds.
- **Visual Search Verification**:
  - Test upload of a socket/switch sample image to confirm Gemini identifies features and returns matching products.
- **AI Sales Specialist Verification**:
  - Query specific power and electrical needs (e.g., "recommend a 20A DP switch for water heater" and "give me the owner's contact").
  - Confirm interactive product cards and owner contact actions render properly.
- **Contact Form & Email Verification**:
  - Submit an inquiry from the contact form and confirm Resend receives and delivers the notification.
