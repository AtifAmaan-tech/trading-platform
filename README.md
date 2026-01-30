# TradeX - Cryptocurrency Trading Platform

A modern, responsive cryptocurrency trading platform with real-time market data, portfolio management, and secure authentication.

## 🔗 Repositories

| Component | Repository |
|-----------|------------|
| **Frontend** | [trading-platform](https://github.com/AtifAmaan-tech/trading-platform) |
| **Backend** | [trading-platform-backend](https://github.com/AtifAmaan-tech/trading-platform-backend) |

---

## Frontend

A modern, responsive trading interface built with React, TypeScript, and Vite.

### Features

#### 🔐 Authentication
- **Secure Login & Signup**: Integrated with the backend session management (`AuthPage`).
- **Protected Routes**: Automatic redirection for unauthenticated users.

#### 📈 Trading Interface (`/trade`)
- **Interactive Charts**: Candlestick graphs visualizing market trends.
- **Order Placement**:
  - **Market Orders**: Buy/Sell at current prices.
  - **Limit Orders**: UI placeholder (currently locked feature).
- **Dynamic Inputs**: Sliders (25%, 50%, etc.) to quickly select trade amounts based on wallet balance.
- **Real-time Updates**: Live trade feed and asset tracking.

#### 💼 Portfolio Management (`/portfolio`)
- **Asset Overview**: Visual breakdown of holdings and total balance.
- **Token Allocation**: Graphical representation of asset distribution.
- **Transaction History**: Detailed log of past trades.

#### 🏠 Dashboard (`/home`)
- **Market Overview**: Snapshot of top performing assets and account status.
- **Live Ticker**: Real-time cryptocurrency prices from Binance API.
- **Watchlist**: Personalized list of tracked assets.

### Tech Stack

- **Framework**: [React](https://reactjs.org/) + [Vite](https://vitejs.dev/)
- **Language**: TypeScript
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [Shadcn UI](https://ui.shadcn.com/) (Radix Primitives)
- **Charts**: Recharts
- **Networking**: Axios

### Getting Started

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/AtifAmaan-tech/trading-platform.git
    cd trading-platform
    ```

2.  **Install Dependencies**:
    ```bash
    npm install
    ```

3.  **Environment Setup**:
    Create a `.env` file:
    ```env
    VITE_PUBLIC_BACKEND_URL=http://127.0.0.1:5000
    ```

4.  **Run Development Server**:
    ```bash
    npm run dev
    ```

    Open your browser at `http://localhost:5173` (or the port shown in the terminal).

---

## Backend

A Flask-based REST API providing authentication, trading operations, and portfolio management.

### Features

- **User Authentication**: Secure session-based authentication with login/signup/logout.
- **Trading Operations**: Buy/sell cryptocurrencies with real-time price data.
- **Portfolio Management**: Track balances, assets, and transaction history.
- **Database Integration**: PostgreSQL with SQLAlchemy ORM.

### Tech Stack

- **Framework**: [Flask](https://flask.palletsprojects.com/)
- **Language**: Python
- **Database**: PostgreSQL 
- **Authentication**: Flask-Session with cookie-based sessions

### API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/register` | POST | Create new user account |
| `/login` | POST | Authenticate user |
| `/logout` | POST | End user session |
| `/auth-status` | GET | Check authentication status |
| `/balance` | GET | Get user's USDT balance |
| `/total-balance` | GET | Get total portfolio value |
| `/get_tokens_qty` | GET | Get all token holdings |
| `/create-transaction` | POST | Execute a trade |

### Getting Started

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/AtifAmaan-tech/trading-platform-backend.git
    cd trading-platform-backend
    ```

2.  **Create virtual environment**:
    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows: venv\Scripts\activate
    ```

3.  **Install Dependencies**:
    ```bash
    pip install -r requirements.txt
    ```

4.  **Environment Setup**:
    Create a `.env` file with your database credentials:
    ```env
    DATABASE_URL=postgresql://username:password@localhost:5432/tradex
    SECRET_KEY=your-secret-key
    ```

5.  **Run the Server**:
    ```bash
    python app.py
    ```

    The API will be available at `http://127.0.0.1:5000`.

---

## Full Stack Setup

To run the complete application:

1. Start the **backend** server (runs on port 5000)
2. Start the **frontend** dev server (runs on port 5173)
3. Ensure the frontend `.env` points to the backend URL

---

## License

MIT License - feel free to use this project for learning and development.
