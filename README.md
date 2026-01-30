# TradeX Frontend

A modern, responsive trading interface built with React, TypeScript, and Vite.

## Features

### 🔐 Authentication
- **Secure Login & Signup**: Integrated with the backend session management(`AuthPage`).
- **Protected Routes**: Automatic redirection for unauthenticated users.

### 📈 Trading Interface (`/trade`)
- **Interactive Charts**: Candlestick graphs visualizing market trends.
- **Order Placement**:
  - **Market Orders**: Buy/Sell at current prices.
  - **Limit Orders**: UI placeholder (currently locked feature).
- **Dynamic Inputs**: Sliders (25%, 50%, etc.) to quickly select trade amounts based on wallet balance.
- **Real-time Updates**: Live trade feed and asset tracking.

### 💼 Portfolio Management (`/portfolio`)
- **Asset Overview**: Visual breakdown of holdings and total balance.
- **Token Allocation**: Graphical representation of asset distribution.
- **Transaction History**: Detailed log of past trades.

### 🏠 Dashboard (`/home`)
- **Market Overview**: Snapshot of top performing assets and account status.

## Tech Stack

- **Framework**: [React](https://reactjs.org/) + [Vite](https://vitejs.dev/)
- **Language**: TypeScript
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [Shadcn UI](https://ui.shadcn.com/) (Radix Primitives)
- **Charts**: Recharts
- **Networking**: Axios

## Getting Started

1.  **Navigate to the frontend directory**:
    ```bash
    cd Frontend/vite_ts/my-app
    ```

2.  **Install Dependencies**:
    ```bash
    npm install
    ```

3.  **Environment Setup**:
    Create a `.env` file in `Frontend/vite_ts/my-app`:
    ```env
    VITE_PUBLIC_BACKEND_URL=http://127.0.0.1:5000
    ```

4.  **Run Development Server**:
    ```bash
    npm run dev
    ```

    Open your browser at `http://localhost:5173` (or the port shown in the terminal).
