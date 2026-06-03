"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const chat_1 = __importDefault(require("./routes/chat"));
const explain_1 = __importDefault(require("./routes/explain"));
const verdict_1 = __importDefault(require("./routes/verdict"));
const trending_1 = __importDefault(require("./routes/trending"));
const portfolio_1 = __importDefault(require("./routes/portfolio"));
const stock_1 = __importDefault(require("./routes/stock"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 8080;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Health check
app.get('/healthz', (req, res) => {
    res.status(200).json({ status: 'ok' });
});
// API Routes
app.use('/api/ai/chat', chat_1.default);
app.use('/api/ai/explain', explain_1.default);
app.use('/api/ai/verdict', verdict_1.default);
app.use('/api/market/trending', trending_1.default);
app.use('/api/portfolio', portfolio_1.default);
app.use('/api/stock', stock_1.default);
app.listen(port, "0.0.0.0", () => {
    console.log("Server starting...");
    console.log("PORT =", process.env.PORT || 10000);
    console.log("NODE_ENV =", process.env.NODE_ENV);
    console.log("Health endpoint ready");
    console.log(`> Ready on http://0.0.0.0:${port}`);
});
