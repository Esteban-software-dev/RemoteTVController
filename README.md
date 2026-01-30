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

```text
/screenshots
  ├── device-discovery.png
  ├── apps-list.png
  ├── app-customization.png
  └── device-control.png
