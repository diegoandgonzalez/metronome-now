# Metronome Now

Online metronome for your everyday needs.

## Table of Contents
- [Live Demo](#live-demo)
- [Features](#features)
- [Technical Highlights & Architecture](#technical-highlights--architecture)
- [Tech Stack](#tech-stack)
- [How to Run Locally](#how-to-run-locally)

---

## Live Demo
**[https://metronome-now.vercel.app/](https://metronome-now.vercel.app/)**

---

## Features

* **Precise Rhythm & Beat Customization:** Adjust BPM and time signatures with independent accent, normal, and mute controls for each beat.
* **Advanced Training Tools:**
  * Auto increase/decrease BPM after a set number of measures.
  * Auto stop metronome after specified seconds or measures.
  * Optional countdown measures before playback starts.
  * Tap tempo detection.
* **Template Management & Sharing:** Save settings locally (IndexedDB) or share configurations instantly via URL params.
* **State Persistence:** Preserves active settings across sessions.
* **Multilanguage Support:** Full English and Spanish localization.

---

## Technical Highlights & Architecture

* **Off Main Thread Audio Engine:** Implements a custom **`AudioWorkletProcessor`** via the **Web Audio API**. This offloads time critical audio processing and scheduling from the main JavaScript thread to a dedicated audio thread, completely eliminating timing jitter and beat delays caused by React rerenders or DOM updates.
* **Client Side Persistence:** Leverages **IndexedDB** for fast, asynchronous storage and management of user defined metronome templates without backend overhead.
* **Internationalization (i18n):** Built with **`next-intl`** featuring localized routing (`/es`, `/en`) and seamless language switching.
* **PWA Capability:** Configured as a Progressive Web App, making it installable across desktop and mobile devices.

---

## Tech Stack

* **Framework & Language:** Next.js, React, TypeScript
* **Audio Processing:** Web Audio API (`AudioWorkletProcessor`)
* **UI & Styling:** Material UI (MUI)
* **Localization:** `next-intl`
* **Local Storage:** IndexedDB
* **Deployment & Hosting:** Vercel

---

## How to run locally

### 1. Installation

Clone the repository and install the dependencies.

```bash
npm install
```

### 2. Run development server

After installing the dependencies, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
>Note: replace 3000 with your current development port.
