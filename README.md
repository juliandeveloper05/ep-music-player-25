EP Music Player - Stem Edition (Next.js Architecture)📌 Project OverviewEP Music Player is a highly modular, client-side Digital Audio Workstation (DAW) lite, engineered with Next.js 15, React 19, and the native Web Audio API.This project transcends traditional HTML5 audio players by implementing a sophisticated DSP (Digital Signal Processing) engine directly in the browser. It features real-time frequency analysis, multi-band parametric equalization, and a simulated stem separation algorithm using advanced biquad filter chains.The architecture is designed for scalability, maintainability, and high performance, leveraging React Server Components (RSC) where applicable and optimized Client Components for audio graph management.🏗️ Technical ArchitectureThe application follows a Domain-Driven Design (DDD) approach, separating core domain logic (audio processing) from the UI layer.Core StackFramework: Next.js 15 (App Router)Language: TypeScript 5.x (Strict Mode)Styling: Tailwind CSS v3 (Utility-first, JIT Compiler)Audio Engine: Native Web Audio API (AudioContext, AnalyserNode, BiquadFilterNode)State Management: React Hooks (Custom Hooks Pattern)UI Components: Lucide React (SVG Icons)System Design Diagramgraph TD
User[User Interface] -->|Events| ReactLayer[React Component Layer]
ReactLayer -->|State Updates| Hooks[Custom Hooks (Business Logic)]

    subgraph AudioEngine [Web Audio API Engine]
        Hooks -->|Control Signals| AudioContext
        AudioContext --> Source[MediaElementSource]
        Source --> Isolator[Stem Isolator (DSP Chain)]
        Isolator --> EQ[6-Band Parametric EQ]
        EQ --> Analyser[FFT Analyser Node]
        Analyser --> Destination[Audio Destination]
    end

    Analyser -->|Frequency Data (Uint8Array)| Visualizer[Canvas/DOM Visualizer]

⚡ Key Features & Engineering Decisions1. Real-Time Audio Processing (DSP Engine)The core of the application resides in useAudioProcessing.ts. We bypass standard <audio> limitations by constructing a custom Audio Graph.Stem Isolation Simulation: instead of using pre-processed stems (which requires heavy backend storage), we implement real-time spectral filtering using BiquadFilterNode.Low-Pass / High-Pass Chains: For isolating Bass and Highs.Notch Filters: To surgically remove mid-range frequencies for Drum isolation.Band-Pass Filters: For Vocal extraction simulation.Parametric EQ: A 6-band equalizer implemented via cascading peaking, lowshelf, and highshelf filters.2. High-Performance VisualizationFFT Analysis: We utilize AnalyserNode with a buffer size of 256 to perform Fast Fourier Transform operations in real-time.Render Loop: The visualization layer runs on requestAnimationFrame, ensuring a smooth 60fps experience decoupled from React's render cycle to prevent UI blocking.DOM Access Optimization: We use useRef for direct DOM manipulation of visual elements, bypassing React's Virtual DOM reconciliation for high-frequency updates (e.g., visualizer bars).3. Modular React ArchitectureSeparation of Concerns:usePlayerState.ts: Manages playlist state, file I/O, and media controls.useAudioProcessing.ts: Manages the imperative Web Audio API graph lifecycle.Component Composition: UI is broken down into atomic, stateless components (Header, Equalizer, StemIsolator) ensuring reusability and easier testing.📂 Project Structuresrc/
├── app/
│ ├── layout.tsx # Root Layout (Server Component) - Global Providers
│ ├── page.tsx # Main View (Client Component) - Composition Root
│ └── globals.css # Tailwind Directives & Custom CSS Variables
├── components/ # UI Presentation Layer
│ ├── Equalizer.tsx # Vertical Slider UI for EQ Bands
│ ├── StemIsolator.tsx # UI for DSP Mode Switching
│ ├── Visualizer.tsx # FFT Visualization Layer
│ └── ...
└── hooks/ # Business Logic Layer
├── usePlayerState.ts # Playlist & Media Control Logic
└── useAudioProcessing.ts # AudioContext & Node Graph Management
🚀 Scalability & RoadmapThis architecture is built to support future enterprise-level features:AI-Powered Stem Separation (Spleeter/TensorFlow.js):Current: Frequency-based simulation.Target: Client-side ML inference for true vocal/instrument separation using WebAssembly (WASM).Cloud Sync & Persistence:Integration with Supabase/Firebase to persist user EQ presets and playlists.WebMIDI Integration:Support for hardware MIDI controllers to manipulate UI faders physically.PWA (Progressive Web App):Offline capabilities and installation on mobile devices.💻 Local Development SetupPrerequisitesNode.js v18.17+npm or pnpmInstallationClone the Repository:git clone [https://github.com/juliandeveloper05/ep-music-player-25.git](https://github.com/juliandeveloper05/ep-music-player-25.git)
cd next-music-player
Install Dependencies:npm install

# or

pnpm install
Run Development Server:npm run dev
Build for Production:npm run build
npm start
🤝 Contribution GuidelinesWe welcome contributions from the open-source community. Please adhere to the following standards:Strict Typing: No any. All interfaces must be defined.Linting: Ensure code passes ESLint rules configuration.Commit Conventional: Use semantic commit messages (e.g., feat:, fix:, refactor:).Lead Engineer: Julian Javier SotoDeveloped with a focus on Performance, Clean Code, and Modern Web Standards.
