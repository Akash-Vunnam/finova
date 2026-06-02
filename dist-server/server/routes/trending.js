"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const TRENDING = [
    { ticker: 'TCS', name: 'NVIDIA Corp', change_percent: 2.5 },
    { ticker: 'RELIANCE', name: 'Apple Inc.', change_percent: 1.2 },
    { ticker: 'INFY', name: 'Microsoft Corp', change_percent: 0.8 },
    { ticker: 'ZOMATO', name: 'Palantir Tech', change_percent: 5.4 },
    { ticker: 'TATAMOTORS', name: 'Tesla Inc', change_percent: -1.5 },
    { ticker: 'HDFCBANK', name: 'Meta Platforms', change_percent: 3.1 },
    { ticker: 'AMZN', name: 'Amazon.com', change_percent: 0.6 },
];
router.get('/', (req, res) => {
    res.json({ trending: TRENDING });
});
exports.default = router;
