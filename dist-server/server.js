"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const next_1 = __importDefault(require("next"));
const chat_1 = __importDefault(require("./server/routes/chat"));
const explain_1 = __importDefault(require("./server/routes/explain"));
const verdict_1 = __importDefault(require("./server/routes/verdict"));
const trending_1 = __importDefault(require("./server/routes/trending"));
const portfolio_1 = __importDefault(require("./server/routes/portfolio"));
const stock_1 = __importDefault(require("./server/routes/stock"));
dotenv_1.default.config({ path: '.env.local' });
dotenv_1.default.config();
const dev = process.env.NODE_ENV !== 'production';
const app = (0, next_1.default)({ dev });
const handle = app.getRequestHandler();
const port = process.env.PORT || 10000;
app.prepare().then(() => {
    const server = (0, express_1.default)();
    server.use((0, cors_1.default)());
    server.use(express_1.default.json());
    // Health check
    server.get('/healthz', (req, res) => {
        res.status(200).json({ status: 'ok' });
    });
    // API Routes
    server.use('/api/ai/chat', chat_1.default);
    server.use('/api/ai/explain', explain_1.default);
    server.use('/api/ai/verdict', verdict_1.default);
    server.use('/api/market/trending', trending_1.default);
    server.use('/api/portfolio', portfolio_1.default);
    server.use('/api/stock', stock_1.default);
    // Next.js Catch-all
    server.all('*', (req, res) => {
        return handle(req, res);
    });
    server.listen(port, "0.0.0.0", () => {
        console.log("Server starting...");
        console.log("PORT =", process.env.PORT || 10000);
        console.log("NODE_ENV =", process.env.NODE_ENV);
        console.log("Health endpoint ready");
        console.log(`> Ready on http://0.0.0.0:${port}`);
    });
}).catch((err) => {
    console.error('Error starting server:', err);
    process.exit(1);
});
