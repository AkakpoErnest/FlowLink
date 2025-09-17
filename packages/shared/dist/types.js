"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReceiptEntityType = exports.PayrollItemStatus = exports.PayrollBatchStatus = exports.LinkTxnStatus = exports.PaymentLinkStatus = exports.PolicyStatus = exports.KycLevel = void 0;
var KycLevel;
(function (KycLevel) {
    KycLevel["NONE"] = "NONE";
    KycLevel["LOW"] = "LOW";
    KycLevel["FULL"] = "FULL";
})(KycLevel || (exports.KycLevel = KycLevel = {}));
var PolicyStatus;
(function (PolicyStatus) {
    PolicyStatus["DRAFT"] = "DRAFT";
    PolicyStatus["ACTIVE"] = "ACTIVE";
    PolicyStatus["DISABLED"] = "DISABLED";
})(PolicyStatus || (exports.PolicyStatus = PolicyStatus = {}));
var PaymentLinkStatus;
(function (PaymentLinkStatus) {
    PaymentLinkStatus["DRAFT"] = "DRAFT";
    PaymentLinkStatus["ACTIVE"] = "ACTIVE";
    PaymentLinkStatus["DISABLED"] = "DISABLED";
})(PaymentLinkStatus || (exports.PaymentLinkStatus = PaymentLinkStatus = {}));
var LinkTxnStatus;
(function (LinkTxnStatus) {
    LinkTxnStatus["INIT"] = "INIT";
    LinkTxnStatus["BLOCKED"] = "BLOCKED";
    LinkTxnStatus["ROUTING"] = "ROUTING";
    LinkTxnStatus["SETTLED"] = "SETTLED";
    LinkTxnStatus["FAILED"] = "FAILED";
})(LinkTxnStatus || (exports.LinkTxnStatus = LinkTxnStatus = {}));
var PayrollBatchStatus;
(function (PayrollBatchStatus) {
    PayrollBatchStatus["DRAFT"] = "DRAFT";
    PayrollBatchStatus["READY"] = "READY";
    PayrollBatchStatus["PROCESSING"] = "PROCESSING";
    PayrollBatchStatus["DONE"] = "DONE";
    PayrollBatchStatus["FAILED"] = "FAILED";
})(PayrollBatchStatus || (exports.PayrollBatchStatus = PayrollBatchStatus = {}));
var PayrollItemStatus;
(function (PayrollItemStatus) {
    PayrollItemStatus["PENDING"] = "PENDING";
    PayrollItemStatus["BLOCKED"] = "BLOCKED";
    PayrollItemStatus["QUEUED"] = "QUEUED";
    PayrollItemStatus["SENT"] = "SENT";
    PayrollItemStatus["FAILED"] = "FAILED";
})(PayrollItemStatus || (exports.PayrollItemStatus = PayrollItemStatus = {}));
var ReceiptEntityType;
(function (ReceiptEntityType) {
    ReceiptEntityType["LINK"] = "LINK";
    ReceiptEntityType["PAYROLL"] = "PAYROLL";
    ReceiptEntityType["VAULT"] = "VAULT";
})(ReceiptEntityType || (exports.ReceiptEntityType = ReceiptEntityType = {}));
//# sourceMappingURL=types.js.map