# 📺 RemoteTVController

**RemoteTVController** is a mobile application built with **React Native** that allows users to discover, connect, and control **Roku devices** on the local network in a smart and visual way.

The project focuses on **clean architecture**, **smooth UX**, and **full device control**, not just sending basic commands.

> ⚠️ **Status:** Work in progress (actively under development)

---

## 🚀 Current Features

### 🔍 Device Discovery (SSDP)
- Automatic local network scanning using **SSDP**
- Real-time detection of available **Roku devices**
- Direct connection to the selected device

---

### 🧠 Global State Management (Zustand)
- Centralized device session handling
- Global state persistence
- Clean and predictable data flow
- Scalable architecture with no prop drilling

---

### 📦 Device App Management
- Direct requests to the Roku device to fetch:
  - Installed applications
  - App metadata
  - Official app images
- Image caching for improved performance

---

### 🗂 Smart App Organization
Applications are automatically grouped into:
- **Device apps**
- **Entertainment apps**

This improves navigation and reduces UI friction.

---

### ⭐ App Personalization
- Mark apps as:
  - **Favorites**
  - **Pinned**
  - **Hidden**
- Full control over app visibility and prioritization

---

### 🔌 Device Control
- **Power on / off** the TV directly from the app
- **Launch applications** instantly
- Fast interactions with minimal UI overhead

---

## 🧱 Tech Stack

- **React Native**
- **TypeScript**
- **Zustand** (global state management)
- **SSDP / Roku External Control Protocol (ECP)**
- **Feature-based architecture**
- **UX-first approach**

---

## 📸 Screenshots

> UI and feature previews from the current development version.

| Screen | Description |
|------|-------------|
| Device Discovery | Roku devices detected via SSDP |
| Apps List | Installed apps organized by category |
| App Customization | Favorites, pinned and hidden apps |
| Device Control | Power and app launch actions |

---

### 🎬 Basic Animation
*Collapsed & expanded AppBar basic animation.*

https://github.com/user-attachments/assets/a616502b-128c-4250-a3ca-315194c4425f

---

### 🎬 AppBar State
*Animated AppBar border with a rotating effect.*

https://github.com/user-attachments/assets/012098fe-de67-40d9-a5fe-74a5f52e9947

---

### 🎬 Pure TabBar Animation
*Styled TabBar animation aligned with the AppBar design.*

https://github.com/user-attachments/assets/48c89d12-0815-401c-a66e-0a4499e6d8f8

---

### 📡 Roku Scanner
*Wi-Fi network scanning UI that detects Roku devices and displays them in a list via the TV Scanner tab.*

https://github.com/user-attachments/assets/2a985294-b7d1-4099-9da4-94002e83e8c6

---

### ⭐ Pin & Favorite Apps + Background Style
*Final UI iteration showing installed apps grouped into Favorites, Entertainment, and Device Settings, including pinning and filtering.*

https://github.com/user-attachments/assets/a34a3084-7841-4f1a-aed0-f26b2c73c862

---

### 🕶️ Hidden Apps
Manage hidden Roku apps: search, preview, and restore them to the main view.

https://github.com/user-attachments/assets/eef8ca60-ee1e-4d1e-9b87-74024f89721c

---

### 🛠️ Settings Screen
Configure and personalize how your TV controller app works.

Manage account details, connected devices, and app preferences such as language, privacy, notifications, and sound feedback.
The screen also highlights the currently connected TV and provides quick access to device scanning and hidden apps management.

https://github.com/user-attachments/assets/fd7f8025-283c-4dc1-902f-4c58c3259ba6

---

### 🔔 Smart Toast System
Custom animated toast notifications with gesture support, stacking behavior, action buttons, and adaptive positioning. Toasts can be swiped to dismiss, paused on hold, stacked intelligently by position, and styled by type (success, warning, danger, etc.) for clear and immediate feedback.

https://github.com/user-attachments/assets/f6cc2452-39a4-437b-a1cc-795372b87610

---

### ⚠️ Alert Message System
Modern, Ionic-inspired alert dialogs for confirmations and multi-use prompts. Alerts support presets (default, info, success, warning, danger) with predefined icons and colors, custom icons, and fully configurable buttons with roles (cancel, destructive, default). The system is global via context + hook, supports backdropDismiss, and includes onDidDismiss for clean lifecycle handling.

#### Highlights
- Global useAlert() hook with show() / hide()
- Presets with icon + color
- Custom content slot (icons, previews, or any ReactNode)
- i18n-friendly default buttons (OK/Cancel)
- Backdrop dismiss + onDidDismiss callbacks

https://github.com/user-attachments/assets/57e57f7e-adfc-427f-963f-6e7d03b0b701

