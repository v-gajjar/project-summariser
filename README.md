# An AI-powered project summariser, built using Tetrate Agent Router

This project is an entry into the February 2026 AI Buildathon by Tetrate. The aim of the project is to use the Tetrate Agent Router to help generate a project summary and suggested skills based on a project description as provided by the user.

---

## 🔹 Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)  
- [PNPM](https://pnpm.io/) package manager  
- A **Tetrate API key** for OpenAI access

---

## 🔹 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/v-gajjar/project-summariser.git
cd project-summariser
````

### 2. Install dependencies

```bash
pnpm install
```

> PNPM will install dependencies for both `client` and `server` because of the workspace setup (`pnpm-workspace.yaml`).

### 3. Set up environment variables

Create a `.env` file inside the `server/` folder with your Tetrate API key:

```env
OPENAI_API_KEY=your_tetrate_api_key_here
```

### 4. Start the development servers

Open **two terminal windows**:

**Server:**

```bash
cd server
pnpm start
```

**Client:**

```bash
cd client
pnpm dev
```

> The client usually runs on `http://localhost:5173` and the server on `http://localhost:3000`.

---

## 🔹 Using the App

1. Open the client URL in your browser.
2. Paste your project description.
3. Click **Generate Summary**.
4. Optionally, refine the summary using the buttons:

   * **Make it less technical**
   * **Make it more impactful**
   * **Rewrite as Bullet Points**
5. Use **Revert Original** to undo any refinements.
6. Copy summary or skills as plain text or HTML using the copy buttons.

---

## 🔹 Project Structure

```
.
├── client
│   ├── components.json
│   ├── eslint.config.js
│   ├── index.html
│   ├── package.json
│   ├── pnpm-lock.yaml
│   ├── pnpm-workspace.yaml
│   ├── public
│   ├── src
│   │   ├── App.tsx
│   │   ├── assets
│   │   ├── components
│   │   │   └── ui
│   │   │       ├── button.tsx
│   │   │       ├── card.tsx
│   │   │       ├── dropdown-menu.tsx
│   │   │       ├── input.tsx
│   │   │       └── textarea.tsx
│   │   ├── global.css
│   │   ├── lib
│   │   │   └── utils.ts
│   │   └── main.tsx
│   ├── tsconfig.app.json
│   ├── tsconfig.json
│   ├── tsconfig.node.json
│   └── vite.config.ts
├── README.md
└── server
    ├── index.js
    ├── package.json
    ├── pnpm-lock.yaml
    ├── routes
    │   └── summariser.js
    └── services
        └── summariserService.js
```

---

## 🔹 Notes

* Ensure your **Tetrate API key** is valid.
* The client communicates with the server via `/api/summarise` routes.
* For production, consider a separate `.env.production` and proper server deployment.
* All summary refinements (less technical, more impactful, bullets) can be undone with the **Revert Original** button.
* Supports copying both project summaries and key skills in **text** or **HTML** formats.
