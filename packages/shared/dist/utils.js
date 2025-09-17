"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePaymentCode = generatePaymentCode;
exports.formatAmount = formatAmount;
exports.truncateAddress = truncateAddress;
exports.generateReceiptHash = generateReceiptHash;
exports.isValidWalletAddress = isValidWalletAddress;
exports.isMockWallet = isMockWallet;
function generatePaymentCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}
function formatAmount(amount, decimals = 18) {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    return (num / Math.pow(10, decimals)).toFixed(2);
}
function truncateAddress(address, start = 6, end = 4) {
    if (!address)
        return '';
    return `${address.slice(0, start)}...${address.slice(-end)}`;
}
function generateReceiptHash(data) {
    // Simple hash function for demo purposes
    const str = JSON.stringify(data, Object.keys(data).sort());
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash).toString(16);
}
function isValidWalletAddress(address) {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
}
function isMockWallet(wallet) {
    return wallet.startsWith('0x111') || wallet.startsWith('0x222') ||
        wallet.startsWith('0x333') || wallet.startsWith('0x444') ||
        wallet.startsWith('0x555');
}
//# sourceMappingURL=utils.js.map