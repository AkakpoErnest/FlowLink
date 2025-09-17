/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/app.module.ts":
/*!***************************!*\
  !*** ./src/app.module.ts ***!
  \***************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const config_1 = __webpack_require__(/*! @nestjs/config */ "@nestjs/config");
const throttler_1 = __webpack_require__(/*! @nestjs/throttler */ "@nestjs/throttler");
const prisma_module_1 = __webpack_require__(/*! ./common/prisma/prisma.module */ "./src/common/prisma/prisma.module.ts");
const auth_module_1 = __webpack_require__(/*! ./auth/auth.module */ "./src/auth/auth.module.ts");
const risk_module_1 = __webpack_require__(/*! ./risk/risk.module */ "./src/risk/risk.module.ts");
const attestation_module_1 = __webpack_require__(/*! ./attestation/attestation.module */ "./src/attestation/attestation.module.ts");
const policy_module_1 = __webpack_require__(/*! ./policy/policy.module */ "./src/policy/policy.module.ts");
const vaults_module_1 = __webpack_require__(/*! ./vaults/vaults.module */ "./src/vaults/vaults.module.ts");
const payment_links_module_1 = __webpack_require__(/*! ./payment-links/payment-links.module */ "./src/payment-links/payment-links.module.ts");
const routing_module_1 = __webpack_require__(/*! ./routing/routing.module */ "./src/routing/routing.module.ts");
const payroll_module_1 = __webpack_require__(/*! ./payroll/payroll.module */ "./src/payroll/payroll.module.ts");
const receipts_module_1 = __webpack_require__(/*! ./receipts/receipts.module */ "./src/receipts/receipts.module.ts");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            throttler_1.ThrottlerModule.forRoot([
                {
                    ttl: 60000,
                    limit: 100,
                },
            ]),
            prisma_module_1.PrismaModule,
            auth_module_1.AuthModule,
            risk_module_1.RiskModule,
            attestation_module_1.AttestationModule,
            policy_module_1.PolicyModule,
            vaults_module_1.VaultsModule,
            payment_links_module_1.PaymentLinksModule,
            routing_module_1.RoutingModule,
            payroll_module_1.PayrollModule,
            receipts_module_1.ReceiptsModule,
        ],
    })
], AppModule);


/***/ }),

/***/ "./src/attestation/attestation.controller.ts":
/*!***************************************************!*\
  !*** ./src/attestation/attestation.controller.ts ***!
  \***************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AttestationController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const attestation_service_1 = __webpack_require__(/*! ./attestation.service */ "./src/attestation/attestation.service.ts");
let AttestationController = class AttestationController {
    constructor(attestationService) {
        this.attestationService = attestationService;
    }
    async getAttestations(wallet) {
        try {
            const result = await this.attestationService.getAttestations(wallet);
            return {
                success: true,
                data: result,
            };
        }
        catch (error) {
            throw new common_1.HttpException({
                errorCode: 'ATTESTATION_ERROR',
                message: 'Failed to fetch attestations',
                details: error.message,
            }, common_1.HttpStatus.BAD_REQUEST);
        }
    }
};
exports.AttestationController = AttestationController;
__decorate([
    (0, common_1.Get)(':wallet'),
    __param(0, (0, common_1.Param)('wallet')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AttestationController.prototype, "getAttestations", null);
exports.AttestationController = AttestationController = __decorate([
    (0, common_1.Controller)('attestations'),
    __metadata("design:paramtypes", [typeof (_a = typeof attestation_service_1.AttestationService !== "undefined" && attestation_service_1.AttestationService) === "function" ? _a : Object])
], AttestationController);


/***/ }),

/***/ "./src/attestation/attestation.module.ts":
/*!***********************************************!*\
  !*** ./src/attestation/attestation.module.ts ***!
  \***********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AttestationModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const attestation_controller_1 = __webpack_require__(/*! ./attestation.controller */ "./src/attestation/attestation.controller.ts");
const attestation_service_1 = __webpack_require__(/*! ./attestation.service */ "./src/attestation/attestation.service.ts");
let AttestationModule = class AttestationModule {
};
exports.AttestationModule = AttestationModule;
exports.AttestationModule = AttestationModule = __decorate([
    (0, common_1.Module)({
        controllers: [attestation_controller_1.AttestationController],
        providers: [attestation_service_1.AttestationService],
        exports: [attestation_service_1.AttestationService],
    })
], AttestationModule);


/***/ }),

/***/ "./src/attestation/attestation.service.ts":
/*!************************************************!*\
  !*** ./src/attestation/attestation.service.ts ***!
  \************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AttestationService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const shared_1 = __webpack_require__(/*! @flowlink/shared */ "@flowlink/shared");
const shared_2 = __webpack_require__(/*! @flowlink/shared */ "@flowlink/shared");
let AttestationService = class AttestationService {
    async getAttestations(wallet) {
        const result = {};
        if (shared_2.MOCK_ATTESTATION_WALLETS.POAP.includes(wallet.toLowerCase())) {
            result.poap = true;
        }
        if (shared_2.MOCK_ATTESTATION_WALLETS.KYCHAIN_FULL.includes(wallet.toLowerCase())) {
            result.kychain = { level: shared_1.KycLevel.FULL };
        }
        else if (shared_2.MOCK_ATTESTATION_WALLETS.KYCHAIN_LOW.includes(wallet.toLowerCase())) {
            result.kychain = { level: shared_1.KycLevel.LOW };
        }
        else {
            result.kychain = { level: null };
        }
        return result;
    }
};
exports.AttestationService = AttestationService;
exports.AttestationService = AttestationService = __decorate([
    (0, common_1.Injectable)()
], AttestationService);


/***/ }),

/***/ "./src/auth/auth.controller.ts":
/*!*************************************!*\
  !*** ./src/auth/auth.controller.ts ***!
  \*************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const auth_service_1 = __webpack_require__(/*! ./auth.service */ "./src/auth/auth.service.ts");
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    async sendMagicLink(body) {
        return {
            success: true,
            message: 'Magic link sent (demo mode)',
        };
    }
    async verifyWallet(body) {
        const token = await this.authService.generateJwt(body.wallet);
        return {
            success: true,
            token,
        };
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('magic-link'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "sendMagicLink", null);
__decorate([
    (0, common_1.Post)('verify-wallet'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verifyWallet", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [typeof (_a = typeof auth_service_1.AuthService !== "undefined" && auth_service_1.AuthService) === "function" ? _a : Object])
], AuthController);


/***/ }),

/***/ "./src/auth/auth.module.ts":
/*!*********************************!*\
  !*** ./src/auth/auth.module.ts ***!
  \*********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const auth_controller_1 = __webpack_require__(/*! ./auth.controller */ "./src/auth/auth.controller.ts");
const auth_service_1 = __webpack_require__(/*! ./auth.service */ "./src/auth/auth.service.ts");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        controllers: [auth_controller_1.AuthController],
        providers: [auth_service_1.AuthService],
        exports: [auth_service_1.AuthService],
    })
], AuthModule);


/***/ }),

/***/ "./src/auth/auth.service.ts":
/*!**********************************!*\
  !*** ./src/auth/auth.service.ts ***!
  \**********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const jwt_1 = __webpack_require__(/*! @nestjs/jwt */ "@nestjs/jwt");
let AuthService = class AuthService {
    constructor(jwtService) {
        this.jwtService = jwtService;
    }
    async generateJwt(wallet) {
        const payload = { wallet, sub: wallet };
        return this.jwtService.sign(payload);
    }
    async validateUser(wallet) {
        return { wallet };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof jwt_1.JwtService !== "undefined" && jwt_1.JwtService) === "function" ? _a : Object])
], AuthService);


/***/ }),

/***/ "./src/common/prisma/prisma.module.ts":
/*!********************************************!*\
  !*** ./src/common/prisma/prisma.module.ts ***!
  \********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PrismaModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const prisma_service_1 = __webpack_require__(/*! ./prisma.service */ "./src/common/prisma/prisma.service.ts");
let PrismaModule = class PrismaModule {
};
exports.PrismaModule = PrismaModule;
exports.PrismaModule = PrismaModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        providers: [prisma_service_1.PrismaService],
        exports: [prisma_service_1.PrismaService],
    })
], PrismaModule);


/***/ }),

/***/ "./src/common/prisma/prisma.service.ts":
/*!*********************************************!*\
  !*** ./src/common/prisma/prisma.service.ts ***!
  \*********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PrismaService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const client_1 = __webpack_require__(/*! @prisma/client */ "@prisma/client");
let PrismaService = class PrismaService extends client_1.PrismaClient {
    async onModuleInit() {
        await this.$connect();
    }
};
exports.PrismaService = PrismaService;
exports.PrismaService = PrismaService = __decorate([
    (0, common_1.Injectable)()
], PrismaService);


/***/ }),

/***/ "./src/common/services/compliance.service.ts":
/*!***************************************************!*\
  !*** ./src/common/services/compliance.service.ts ***!
  \***************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ComplianceService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const shared_1 = __webpack_require__(/*! @flowlink/shared */ "@flowlink/shared");
const shared_2 = __webpack_require__(/*! @flowlink/shared */ "@flowlink/shared");
let ComplianceService = class ComplianceService {
    async evaluateCompliance(input) {
        const reasons = [];
        let allowed = true;
        if (input.policyRules.sanctionsCheck) {
            if (shared_1.MOCK_SANCTIONS_LIST.includes(input.fromWallet.toLowerCase())) {
                allowed = false;
                reasons.push('Wallet address is on sanctions list');
            }
        }
        if (input.policyRules.geofencing && input.policyRules.geofencing.length > 0) {
            if (!input.policyRules.geofencing.includes(input.countryCode)) {
                allowed = false;
                reasons.push(`Country ${input.countryCode} not allowed by geofencing policy`);
            }
        }
        if (input.policyRules.kycLevel) {
            const kycLevels = [shared_2.KycLevel.NONE, shared_2.KycLevel.LOW, shared_2.KycLevel.FULL];
            const userLevel = kycLevels.indexOf(input.kycLevel);
            const requiredLevel = kycLevels.indexOf(input.policyRules.kycLevel);
            if (userLevel < requiredLevel) {
                allowed = false;
                reasons.push(`KYC level ${input.kycLevel} below required ${input.policyRules.kycLevel}`);
            }
        }
        if (input.policyRules.perTxLimit) {
            if (input.amount > input.policyRules.perTxLimit) {
                allowed = false;
                reasons.push(`Amount ${input.amount} exceeds limit ${input.policyRules.perTxLimit}`);
            }
        }
        if (input.policyRules.allowlistOnly) {
            if (!input.allowlist.includes(input.fromWallet.toLowerCase())) {
                allowed = false;
                reasons.push('Wallet not on allowlist');
            }
        }
        let riskScore = 50;
        if (input.allowlist.includes(input.fromWallet.toLowerCase())) {
            riskScore += 20;
        }
        if (shared_1.MOCK_SANCTIONS_LIST.includes(input.fromWallet.toLowerCase())) {
            riskScore -= 30;
        }
        if (input.kycLevel === shared_2.KycLevel.FULL) {
            riskScore += 10;
        }
        else if (input.kycLevel === shared_2.KycLevel.LOW) {
            riskScore += 5;
        }
        riskScore = Math.max(0, Math.min(100, riskScore));
        if (allowed && riskScore < 40) {
            reasons.push('High risk transaction detected');
        }
        return {
            allowed,
            reasons,
            riskScore,
        };
    }
    async simulatePolicy(input) {
        const allowed = [];
        const blocked = [];
        for (let i = 0; i < input.txs.length; i++) {
            const tx = input.txs[i];
            const result = await this.evaluateCompliance({
                fromWallet: tx.from,
                amount: tx.amount,
                currency: 'USDC',
                countryCode: tx.countryCode,
                chainId: tx.chainId,
                kycLevel: shared_2.KycLevel.LOW,
                policyRules: input.policyRules,
                allowlist: input.allowlist,
            });
            if (result.allowed) {
                allowed.push(i.toString());
            }
            else {
                blocked.push({
                    id: i.toString(),
                    reasons: result.reasons,
                });
            }
        }
        return { allowed, blocked };
    }
};
exports.ComplianceService = ComplianceService;
exports.ComplianceService = ComplianceService = __decorate([
    (0, common_1.Injectable)()
], ComplianceService);


/***/ }),

/***/ "./src/payment-links/payment-links.controller.ts":
/*!*******************************************************!*\
  !*** ./src/payment-links/payment-links.controller.ts ***!
  \*******************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PaymentLinksController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const payment_links_service_1 = __webpack_require__(/*! ./payment-links.service */ "./src/payment-links/payment-links.service.ts");
const shared_1 = __webpack_require__(/*! @flowlink/shared */ "@flowlink/shared");
let PaymentLinksController = class PaymentLinksController {
    constructor(paymentLinksService) {
        this.paymentLinksService = paymentLinksService;
    }
    async createPaymentLink(body) {
        try {
            const validated = shared_1.CreatePaymentLinkSchema.parse(body);
            const result = await this.paymentLinksService.createPaymentLink(validated);
            return {
                success: true,
                data: result,
            };
        }
        catch (error) {
            throw new common_1.HttpException({
                errorCode: 'PAYMENT_LINK_CREATION_ERROR',
                message: 'Failed to create payment link',
                details: error.message,
            }, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getPaymentLink(code) {
        try {
            const result = await this.paymentLinksService.getPaymentLink(code);
            return {
                success: true,
                data: result,
            };
        }
        catch (error) {
            throw new common_1.HttpException({
                errorCode: 'PAYMENT_LINK_NOT_FOUND',
                message: 'Payment link not found',
                details: error.message,
            }, common_1.HttpStatus.NOT_FOUND);
        }
    }
    async createPaymentIntent(code, body) {
        try {
            const validated = shared_1.PaymentIntentSchema.parse(body);
            const result = await this.paymentLinksService.createPaymentIntent(code, validated);
            return {
                success: true,
                data: result,
            };
        }
        catch (error) {
            throw new common_1.HttpException({
                errorCode: 'PAYMENT_INTENT_ERROR',
                message: 'Failed to create payment intent',
                details: error.message,
            }, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async settlePayment(code, body) {
        try {
            const validated = shared_1.SettlePaymentSchema.parse(body);
            const result = await this.paymentLinksService.settlePayment(code, validated);
            return {
                success: true,
                data: result,
            };
        }
        catch (error) {
            throw new common_1.HttpException({
                errorCode: 'PAYMENT_SETTLEMENT_ERROR',
                message: 'Failed to settle payment',
                details: error.message,
            }, common_1.HttpStatus.BAD_REQUEST);
        }
    }
};
exports.PaymentLinksController = PaymentLinksController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PaymentLinksController.prototype, "createPaymentLink", null);
__decorate([
    (0, common_1.Get)(':code'),
    __param(0, (0, common_1.Param)('code')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PaymentLinksController.prototype, "getPaymentLink", null);
__decorate([
    (0, common_1.Post)(':code/intent'),
    __param(0, (0, common_1.Param)('code')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PaymentLinksController.prototype, "createPaymentIntent", null);
__decorate([
    (0, common_1.Post)(':code/settle'),
    __param(0, (0, common_1.Param)('code')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PaymentLinksController.prototype, "settlePayment", null);
exports.PaymentLinksController = PaymentLinksController = __decorate([
    (0, common_1.Controller)('links'),
    __metadata("design:paramtypes", [typeof (_a = typeof payment_links_service_1.PaymentLinksService !== "undefined" && payment_links_service_1.PaymentLinksService) === "function" ? _a : Object])
], PaymentLinksController);


/***/ }),

/***/ "./src/payment-links/payment-links.module.ts":
/*!***************************************************!*\
  !*** ./src/payment-links/payment-links.module.ts ***!
  \***************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PaymentLinksModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const payment_links_controller_1 = __webpack_require__(/*! ./payment-links.controller */ "./src/payment-links/payment-links.controller.ts");
const payment_links_service_1 = __webpack_require__(/*! ./payment-links.service */ "./src/payment-links/payment-links.service.ts");
const compliance_service_1 = __webpack_require__(/*! ../common/services/compliance.service */ "./src/common/services/compliance.service.ts");
const attestation_module_1 = __webpack_require__(/*! ../attestation/attestation.module */ "./src/attestation/attestation.module.ts");
let PaymentLinksModule = class PaymentLinksModule {
};
exports.PaymentLinksModule = PaymentLinksModule;
exports.PaymentLinksModule = PaymentLinksModule = __decorate([
    (0, common_1.Module)({
        imports: [attestation_module_1.AttestationModule],
        controllers: [payment_links_controller_1.PaymentLinksController],
        providers: [payment_links_service_1.PaymentLinksService, compliance_service_1.ComplianceService],
        exports: [payment_links_service_1.PaymentLinksService],
    })
], PaymentLinksModule);


/***/ }),

/***/ "./src/payment-links/payment-links.service.ts":
/*!****************************************************!*\
  !*** ./src/payment-links/payment-links.service.ts ***!
  \****************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PaymentLinksService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const prisma_service_1 = __webpack_require__(/*! ../common/prisma/prisma.service */ "./src/common/prisma/prisma.service.ts");
const compliance_service_1 = __webpack_require__(/*! ../common/services/compliance.service */ "./src/common/services/compliance.service.ts");
const attestation_service_1 = __webpack_require__(/*! ../attestation/attestation.service */ "./src/attestation/attestation.service.ts");
const shared_1 = __webpack_require__(/*! @flowlink/shared */ "@flowlink/shared");
const client_1 = __webpack_require__(/*! @prisma/client */ "@prisma/client");
let PaymentLinksService = class PaymentLinksService {
    constructor(prisma, complianceService, attestationService) {
        this.prisma = prisma;
        this.complianceService = complianceService;
        this.attestationService = attestationService;
    }
    async createPaymentLink(data) {
        const code = (0, shared_1.generatePaymentCode)();
        const paymentLink = await this.prisma.paymentLink.create({
            data: {
                code,
                creatorUserId: 'user-1',
                sourceToken: data.sourceToken,
                destStable: data.destStable,
                amountMin: data.amountMin,
                amountMax: data.amountMax,
                requiresKyc: data.requiresKyc,
                policyId: data.policyId,
                status: client_1.PaymentLinkStatus.ACTIVE,
            },
        });
        return {
            id: paymentLink.id,
            code: paymentLink.code,
            qrSvg: `<svg>QR Code for ${code}</svg>`,
        };
    }
    async getPaymentLink(code) {
        const paymentLink = await this.prisma.paymentLink.findUnique({
            where: { code },
            include: { policy: true },
        });
        if (!paymentLink) {
            throw new common_1.NotFoundException('Payment link not found');
        }
        return {
            id: paymentLink.id,
            code: paymentLink.code,
            sourceToken: paymentLink.sourceToken,
            destStable: paymentLink.destStable,
            amountMin: paymentLink.amountMin,
            amountMax: paymentLink.amountMax,
            requiresKyc: paymentLink.requiresKyc,
            policy: paymentLink.policy,
        };
    }
    async createPaymentIntent(code, data) {
        const paymentLink = await this.getPaymentLink(code);
        const linkTxn = await this.prisma.linkTxn.create({
            data: {
                paymentLinkId: paymentLink.id,
                srcWallet: data.fromWallet,
                amountIn: parseFloat(data.amountIn),
                destStable: paymentLink.destStable,
                status: client_1.LinkTxnStatus.INIT,
                reasons: [],
            },
        });
        const attestations = await this.attestationService.getAttestations(data.fromWallet);
        const complianceResult = await this.complianceService.evaluateCompliance({
            fromWallet: data.fromWallet,
            amount: parseFloat(data.amountIn),
            currency: paymentLink.destStable,
            countryCode: data.countryCode,
            chainId: data.chainId,
            kycLevel: attestations.kychain?.level || client_1.KycLevel.NONE,
            policyRules: paymentLink.policy?.rules || {},
            allowlist: [],
        });
        const status = complianceResult.allowed ? client_1.LinkTxnStatus.ROUTING : client_1.LinkTxnStatus.BLOCKED;
        await this.prisma.linkTxn.update({
            where: { id: linkTxn.id },
            data: {
                status,
                reasons: complianceResult.reasons,
            },
        });
        return {
            status,
            reasons: complianceResult.reasons,
            riskScore: complianceResult.riskScore,
        };
    }
    async settlePayment(code, data) {
        const paymentLink = await this.getPaymentLink(code);
        const linkTxn = await this.prisma.linkTxn.findFirst({
            where: {
                paymentLinkId: paymentLink.id,
                status: client_1.LinkTxnStatus.ROUTING,
            },
            orderBy: { createdAt: 'desc' },
        });
        if (!linkTxn) {
            throw new common_1.NotFoundException('No pending transaction found');
        }
        const status = data.txHash ? client_1.LinkTxnStatus.SETTLED : client_1.LinkTxnStatus.FAILED;
        await this.prisma.linkTxn.update({
            where: { id: linkTxn.id },
            data: {
                status,
                txHash: data.txHash,
                amountOut: linkTxn.amountIn * 0.998,
            },
        });
        return {
            status,
            txHash: data.txHash,
        };
    }
};
exports.PaymentLinksService = PaymentLinksService;
exports.PaymentLinksService = PaymentLinksService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object, typeof (_b = typeof compliance_service_1.ComplianceService !== "undefined" && compliance_service_1.ComplianceService) === "function" ? _b : Object, typeof (_c = typeof attestation_service_1.AttestationService !== "undefined" && attestation_service_1.AttestationService) === "function" ? _c : Object])
], PaymentLinksService);


/***/ }),

/***/ "./src/payroll/payroll.controller.ts":
/*!*******************************************!*\
  !*** ./src/payroll/payroll.controller.ts ***!
  \*******************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PayrollController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const platform_express_1 = __webpack_require__(/*! @nestjs/platform-express */ "@nestjs/platform-express");
const payroll_service_1 = __webpack_require__(/*! ./payroll.service */ "./src/payroll/payroll.service.ts");
let PayrollController = class PayrollController {
    constructor(payrollService) {
        this.payrollService = payrollService;
    }
    async createBatch(body) {
        return {
            success: true,
            data: { id: 'batch-1', chainId: body.chainId, rules: body.rules },
        };
    }
    async importCSV(id, file) {
        return {
            success: true,
            data: {
                items: [
                    { recipientWallet: '0x123...', amount: 1000, currency: 'USDC', status: 'PENDING' },
                ],
                blocked: [],
            },
        };
    }
    async dispatchBatch(id) {
        return {
            success: true,
            data: { status: 'PROCESSING', itemsProcessed: 1 },
        };
    }
};
exports.PayrollController = PayrollController;
__decorate([
    (0, common_1.Post)('batches'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PayrollController.prototype, "createBatch", null);
__decorate([
    (0, common_1.Post)('batches/:id/importCSV'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_c = typeof Express !== "undefined" && (_b = Express.Multer) !== void 0 && _b.File) === "function" ? _c : Object]),
    __metadata("design:returntype", Promise)
], PayrollController.prototype, "importCSV", null);
__decorate([
    (0, common_1.Post)('batches/:id/dispatch'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PayrollController.prototype, "dispatchBatch", null);
exports.PayrollController = PayrollController = __decorate([
    (0, common_1.Controller)('payroll'),
    __metadata("design:paramtypes", [typeof (_a = typeof payroll_service_1.PayrollService !== "undefined" && payroll_service_1.PayrollService) === "function" ? _a : Object])
], PayrollController);


/***/ }),

/***/ "./src/payroll/payroll.module.ts":
/*!***************************************!*\
  !*** ./src/payroll/payroll.module.ts ***!
  \***************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PayrollModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const payroll_controller_1 = __webpack_require__(/*! ./payroll.controller */ "./src/payroll/payroll.controller.ts");
const payroll_service_1 = __webpack_require__(/*! ./payroll.service */ "./src/payroll/payroll.service.ts");
let PayrollModule = class PayrollModule {
};
exports.PayrollModule = PayrollModule;
exports.PayrollModule = PayrollModule = __decorate([
    (0, common_1.Module)({
        controllers: [payroll_controller_1.PayrollController],
        providers: [payroll_service_1.PayrollService],
        exports: [payroll_service_1.PayrollService],
    })
], PayrollModule);


/***/ }),

/***/ "./src/payroll/payroll.service.ts":
/*!****************************************!*\
  !*** ./src/payroll/payroll.service.ts ***!
  \****************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PayrollService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
let PayrollService = class PayrollService {
    async createBatch(data) {
        return {
            id: 'batch-1',
            chainId: data.chainId,
            rules: data.rules,
        };
    }
    async importCSV(batchId, file) {
        return {
            items: [
                {
                    recipientWallet: '0x1234567890123456789012345678901234567890',
                    amount: 1000,
                    currency: 'USDC',
                    status: 'PENDING',
                },
            ],
            blocked: [],
        };
    }
    async dispatchBatch(batchId) {
        return {
            status: 'PROCESSING',
            itemsProcessed: 1,
        };
    }
};
exports.PayrollService = PayrollService;
exports.PayrollService = PayrollService = __decorate([
    (0, common_1.Injectable)()
], PayrollService);


/***/ }),

/***/ "./src/policy/policy.controller.ts":
/*!*****************************************!*\
  !*** ./src/policy/policy.controller.ts ***!
  \*****************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PolicyController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const policy_service_1 = __webpack_require__(/*! ./policy.service */ "./src/policy/policy.service.ts");
let PolicyController = class PolicyController {
    constructor(policyService) {
        this.policyService = policyService;
    }
    async createPolicy(body) {
        return {
            success: true,
            data: { id: 'policy-1', name: 'APAC-Standard' },
        };
    }
    async getPolicies() {
        return {
            success: true,
            data: [{ id: 'policy-1', name: 'APAC-Standard' }],
        };
    }
    async simulatePolicy(id, body) {
        return {
            success: true,
            data: {
                allowed: ['0', '1'],
                blocked: [],
            },
        };
    }
};
exports.PolicyController = PolicyController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PolicyController.prototype, "createPolicy", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PolicyController.prototype, "getPolicies", null);
__decorate([
    (0, common_1.Post)(':id/simulate'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PolicyController.prototype, "simulatePolicy", null);
exports.PolicyController = PolicyController = __decorate([
    (0, common_1.Controller)('policy'),
    __metadata("design:paramtypes", [typeof (_a = typeof policy_service_1.PolicyService !== "undefined" && policy_service_1.PolicyService) === "function" ? _a : Object])
], PolicyController);


/***/ }),

/***/ "./src/policy/policy.module.ts":
/*!*************************************!*\
  !*** ./src/policy/policy.module.ts ***!
  \*************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PolicyModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const policy_controller_1 = __webpack_require__(/*! ./policy.controller */ "./src/policy/policy.controller.ts");
const policy_service_1 = __webpack_require__(/*! ./policy.service */ "./src/policy/policy.service.ts");
let PolicyModule = class PolicyModule {
};
exports.PolicyModule = PolicyModule;
exports.PolicyModule = PolicyModule = __decorate([
    (0, common_1.Module)({
        controllers: [policy_controller_1.PolicyController],
        providers: [policy_service_1.PolicyService],
        exports: [policy_service_1.PolicyService],
    })
], PolicyModule);


/***/ }),

/***/ "./src/policy/policy.service.ts":
/*!**************************************!*\
  !*** ./src/policy/policy.service.ts ***!
  \**************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PolicyService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
let PolicyService = class PolicyService {
    async createPolicy(data) {
        return {
            id: 'policy-1',
            name: data.name || 'APAC-Standard',
            rules: data.rules || {},
        };
    }
    async getPolicies() {
        return [
            {
                id: 'policy-1',
                name: 'APAC-Standard',
                rules: {
                    geofencing: ['SG', 'HK', 'MY', 'TH'],
                    sanctionsCheck: true,
                    perTxLimit: 10000,
                    kycLevel: 'LOW',
                },
            },
        ];
    }
    async simulatePolicy(policyId, txs) {
        return {
            allowed: txs.map((_, index) => index.toString()),
            blocked: [],
        };
    }
};
exports.PolicyService = PolicyService;
exports.PolicyService = PolicyService = __decorate([
    (0, common_1.Injectable)()
], PolicyService);


/***/ }),

/***/ "./src/receipts/receipts.controller.ts":
/*!*********************************************!*\
  !*** ./src/receipts/receipts.controller.ts ***!
  \*********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ReceiptsController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const receipts_service_1 = __webpack_require__(/*! ./receipts.service */ "./src/receipts/receipts.service.ts");
let ReceiptsController = class ReceiptsController {
    constructor(receiptsService) {
        this.receiptsService = receiptsService;
    }
    async generateReceipt(body) {
        return {
            success: true,
            data: {
                pdfUrl: '/receipts/demo-receipt.pdf',
                json: {
                    entityType: body.entityType,
                    entityId: body.entityId,
                    timestamp: new Date().toISOString(),
                },
            },
        };
    }
};
exports.ReceiptsController = ReceiptsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ReceiptsController.prototype, "generateReceipt", null);
exports.ReceiptsController = ReceiptsController = __decorate([
    (0, common_1.Controller)('receipts'),
    __metadata("design:paramtypes", [typeof (_a = typeof receipts_service_1.ReceiptsService !== "undefined" && receipts_service_1.ReceiptsService) === "function" ? _a : Object])
], ReceiptsController);


/***/ }),

/***/ "./src/receipts/receipts.module.ts":
/*!*****************************************!*\
  !*** ./src/receipts/receipts.module.ts ***!
  \*****************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ReceiptsModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const receipts_controller_1 = __webpack_require__(/*! ./receipts.controller */ "./src/receipts/receipts.controller.ts");
const receipts_service_1 = __webpack_require__(/*! ./receipts.service */ "./src/receipts/receipts.service.ts");
let ReceiptsModule = class ReceiptsModule {
};
exports.ReceiptsModule = ReceiptsModule;
exports.ReceiptsModule = ReceiptsModule = __decorate([
    (0, common_1.Module)({
        controllers: [receipts_controller_1.ReceiptsController],
        providers: [receipts_service_1.ReceiptsService],
        exports: [receipts_service_1.ReceiptsService],
    })
], ReceiptsModule);


/***/ }),

/***/ "./src/receipts/receipts.service.ts":
/*!******************************************!*\
  !*** ./src/receipts/receipts.service.ts ***!
  \******************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ReceiptsService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
let ReceiptsService = class ReceiptsService {
    async generateReceipt(data) {
        return {
            pdfUrl: '/receipts/demo-receipt.pdf',
            json: {
                entityType: data.entityType,
                entityId: data.entityId,
                timestamp: new Date().toISOString(),
                hash: 'demo-hash-123',
            },
        };
    }
};
exports.ReceiptsService = ReceiptsService;
exports.ReceiptsService = ReceiptsService = __decorate([
    (0, common_1.Injectable)()
], ReceiptsService);


/***/ }),

/***/ "./src/risk/risk.controller.ts":
/*!*************************************!*\
  !*** ./src/risk/risk.controller.ts ***!
  \*************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RiskController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const risk_service_1 = __webpack_require__(/*! ./risk.service */ "./src/risk/risk.service.ts");
const shared_1 = __webpack_require__(/*! @flowlink/shared */ "@flowlink/shared");
let RiskController = class RiskController {
    constructor(riskService) {
        this.riskService = riskService;
    }
    async getRiskScore(body) {
        try {
            const validated = shared_1.RiskScoreSchema.parse(body);
            const result = await this.riskService.getRiskScore(validated.wallet);
            return {
                success: true,
                data: result,
            };
        }
        catch (error) {
            throw new common_1.HttpException({
                errorCode: 'RISK_SCORE_ERROR',
                message: 'Failed to calculate risk score',
                details: error.message,
            }, common_1.HttpStatus.BAD_REQUEST);
        }
    }
};
exports.RiskController = RiskController;
__decorate([
    (0, common_1.Post)('score'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RiskController.prototype, "getRiskScore", null);
exports.RiskController = RiskController = __decorate([
    (0, common_1.Controller)('risk'),
    __metadata("design:paramtypes", [typeof (_a = typeof risk_service_1.RiskService !== "undefined" && risk_service_1.RiskService) === "function" ? _a : Object])
], RiskController);


/***/ }),

/***/ "./src/risk/risk.module.ts":
/*!*********************************!*\
  !*** ./src/risk/risk.module.ts ***!
  \*********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RiskModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const risk_controller_1 = __webpack_require__(/*! ./risk.controller */ "./src/risk/risk.controller.ts");
const risk_service_1 = __webpack_require__(/*! ./risk.service */ "./src/risk/risk.service.ts");
let RiskModule = class RiskModule {
};
exports.RiskModule = RiskModule;
exports.RiskModule = RiskModule = __decorate([
    (0, common_1.Module)({
        controllers: [risk_controller_1.RiskController],
        providers: [risk_service_1.RiskService],
        exports: [risk_service_1.RiskService],
    })
], RiskModule);


/***/ }),

/***/ "./src/risk/risk.service.ts":
/*!**********************************!*\
  !*** ./src/risk/risk.service.ts ***!
  \**********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RiskService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const shared_1 = __webpack_require__(/*! @flowlink/shared */ "@flowlink/shared");
let RiskService = class RiskService {
    async getRiskScore(wallet) {
        let score = 50;
        const reasons = [];
        if (shared_1.MOCK_SANCTIONS_LIST.includes(wallet.toLowerCase())) {
            score -= 30;
            reasons.push('Wallet on sanctions list');
        }
        if (shared_1.MOCK_ATTESTATION_WALLETS.POAP.includes(wallet.toLowerCase())) {
            score += 10;
            reasons.push('Has POAP attestation');
        }
        if (shared_1.MOCK_ATTESTATION_WALLETS.KYCHAIN_FULL.includes(wallet.toLowerCase())) {
            score += 15;
            reasons.push('Has full KYC attestation');
        }
        else if (shared_1.MOCK_ATTESTATION_WALLETS.KYCHAIN_LOW.includes(wallet.toLowerCase())) {
            score += 10;
            reasons.push('Has low KYC attestation');
        }
        score = Math.max(0, Math.min(100, score));
        if (score < 40) {
            reasons.push('High risk profile');
        }
        else if (score > 80) {
            reasons.push('Low risk profile');
        }
        return {
            score,
            reasons,
        };
    }
};
exports.RiskService = RiskService;
exports.RiskService = RiskService = __decorate([
    (0, common_1.Injectable)()
], RiskService);


/***/ }),

/***/ "./src/routing/routing.controller.ts":
/*!*******************************************!*\
  !*** ./src/routing/routing.controller.ts ***!
  \*******************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RoutingController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const routing_service_1 = __webpack_require__(/*! ./routing.service */ "./src/routing/routing.service.ts");
const shared_1 = __webpack_require__(/*! @flowlink/shared */ "@flowlink/shared");
let RoutingController = class RoutingController {
    constructor(routingService) {
        this.routingService = routingService;
    }
    async getRouteQuote(body) {
        try {
            const validated = shared_1.RouteQuoteSchema.parse(body);
            const result = await this.routingService.getRouteQuote(validated);
            return {
                success: true,
                data: result,
            };
        }
        catch (error) {
            throw new common_1.HttpException({
                errorCode: 'ROUTE_QUOTE_ERROR',
                message: 'Failed to get route quote',
                details: error.message,
            }, common_1.HttpStatus.BAD_REQUEST);
        }
    }
};
exports.RoutingController = RoutingController;
__decorate([
    (0, common_1.Post)('quote'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RoutingController.prototype, "getRouteQuote", null);
exports.RoutingController = RoutingController = __decorate([
    (0, common_1.Controller)('route'),
    __metadata("design:paramtypes", [typeof (_a = typeof routing_service_1.RoutingService !== "undefined" && routing_service_1.RoutingService) === "function" ? _a : Object])
], RoutingController);


/***/ }),

/***/ "./src/routing/routing.module.ts":
/*!***************************************!*\
  !*** ./src/routing/routing.module.ts ***!
  \***************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RoutingModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const routing_controller_1 = __webpack_require__(/*! ./routing.controller */ "./src/routing/routing.controller.ts");
const routing_service_1 = __webpack_require__(/*! ./routing.service */ "./src/routing/routing.service.ts");
let RoutingModule = class RoutingModule {
};
exports.RoutingModule = RoutingModule;
exports.RoutingModule = RoutingModule = __decorate([
    (0, common_1.Module)({
        controllers: [routing_controller_1.RoutingController],
        providers: [routing_service_1.RoutingService],
        exports: [routing_service_1.RoutingService],
    })
], RoutingModule);


/***/ }),

/***/ "./src/routing/routing.service.ts":
/*!****************************************!*\
  !*** ./src/routing/routing.service.ts ***!
  \****************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RoutingService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
let RoutingService = class RoutingService {
    async getRouteQuote(data) {
        const amountIn = parseFloat(data.amountIn);
        const amountOut = amountIn * 0.998;
        return {
            dex: '1inch-mock',
            amountOut: amountOut.toString(),
            steps: [
                {
                    dex: '1inch-mock',
                    tokenIn: data.fromToken,
                    tokenOut: data.destStable,
                    amountIn: data.amountIn,
                    amountOut: amountOut.toString(),
                },
            ],
        };
    }
};
exports.RoutingService = RoutingService;
exports.RoutingService = RoutingService = __decorate([
    (0, common_1.Injectable)()
], RoutingService);


/***/ }),

/***/ "./src/vaults/vaults.controller.ts":
/*!*****************************************!*\
  !*** ./src/vaults/vaults.controller.ts ***!
  \*****************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.VaultsController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const vaults_service_1 = __webpack_require__(/*! ./vaults.service */ "./src/vaults/vaults.service.ts");
let VaultsController = class VaultsController {
    constructor(vaultsService) {
        this.vaultsService = vaultsService;
    }
    async createVault(body) {
        return {
            success: true,
            data: { id: 'vault-1', policyId: body.policyId, chainId: body.chainId },
        };
    }
    async getVaults() {
        return {
            success: true,
            data: [{ id: 'vault-1', policyId: 'policy-1', chainId: 137 }],
        };
    }
    async getVault(id) {
        return {
            success: true,
            data: { id, policyId: 'policy-1', chainId: 137 },
        };
    }
};
exports.VaultsController = VaultsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], VaultsController.prototype, "createVault", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], VaultsController.prototype, "getVaults", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], VaultsController.prototype, "getVault", null);
exports.VaultsController = VaultsController = __decorate([
    (0, common_1.Controller)('vaults'),
    __metadata("design:paramtypes", [typeof (_a = typeof vaults_service_1.VaultsService !== "undefined" && vaults_service_1.VaultsService) === "function" ? _a : Object])
], VaultsController);


/***/ }),

/***/ "./src/vaults/vaults.module.ts":
/*!*************************************!*\
  !*** ./src/vaults/vaults.module.ts ***!
  \*************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.VaultsModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const vaults_controller_1 = __webpack_require__(/*! ./vaults.controller */ "./src/vaults/vaults.controller.ts");
const vaults_service_1 = __webpack_require__(/*! ./vaults.service */ "./src/vaults/vaults.service.ts");
let VaultsModule = class VaultsModule {
};
exports.VaultsModule = VaultsModule;
exports.VaultsModule = VaultsModule = __decorate([
    (0, common_1.Module)({
        controllers: [vaults_controller_1.VaultsController],
        providers: [vaults_service_1.VaultsService],
        exports: [vaults_service_1.VaultsService],
    })
], VaultsModule);


/***/ }),

/***/ "./src/vaults/vaults.service.ts":
/*!**************************************!*\
  !*** ./src/vaults/vaults.service.ts ***!
  \**************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.VaultsService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
let VaultsService = class VaultsService {
    async createVault(data) {
        return {
            id: 'vault-1',
            policyId: data.policyId,
            chainId: data.chainId,
        };
    }
    async getVaults() {
        return [
            {
                id: 'vault-1',
                policyId: 'policy-1',
                chainId: 137,
            },
        ];
    }
    async getVault(id) {
        return {
            id,
            policyId: 'policy-1',
            chainId: 137,
        };
    }
};
exports.VaultsService = VaultsService;
exports.VaultsService = VaultsService = __decorate([
    (0, common_1.Injectable)()
], VaultsService);


/***/ }),

/***/ "@flowlink/shared":
/*!***********************************!*\
  !*** external "@flowlink/shared" ***!
  \***********************************/
/***/ ((module) => {

module.exports = require("@flowlink/shared");

/***/ }),

/***/ "@nestjs/common":
/*!*********************************!*\
  !*** external "@nestjs/common" ***!
  \*********************************/
/***/ ((module) => {

module.exports = require("@nestjs/common");

/***/ }),

/***/ "@nestjs/config":
/*!*********************************!*\
  !*** external "@nestjs/config" ***!
  \*********************************/
/***/ ((module) => {

module.exports = require("@nestjs/config");

/***/ }),

/***/ "@nestjs/core":
/*!*******************************!*\
  !*** external "@nestjs/core" ***!
  \*******************************/
/***/ ((module) => {

module.exports = require("@nestjs/core");

/***/ }),

/***/ "@nestjs/jwt":
/*!******************************!*\
  !*** external "@nestjs/jwt" ***!
  \******************************/
/***/ ((module) => {

module.exports = require("@nestjs/jwt");

/***/ }),

/***/ "@nestjs/platform-express":
/*!*******************************************!*\
  !*** external "@nestjs/platform-express" ***!
  \*******************************************/
/***/ ((module) => {

module.exports = require("@nestjs/platform-express");

/***/ }),

/***/ "@nestjs/swagger":
/*!**********************************!*\
  !*** external "@nestjs/swagger" ***!
  \**********************************/
/***/ ((module) => {

module.exports = require("@nestjs/swagger");

/***/ }),

/***/ "@nestjs/throttler":
/*!************************************!*\
  !*** external "@nestjs/throttler" ***!
  \************************************/
/***/ ((module) => {

module.exports = require("@nestjs/throttler");

/***/ }),

/***/ "@prisma/client":
/*!*********************************!*\
  !*** external "@prisma/client" ***!
  \*********************************/
/***/ ((module) => {

module.exports = require("@prisma/client");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/

Object.defineProperty(exports, "__esModule", ({ value: true }));
const core_1 = __webpack_require__(/*! @nestjs/core */ "@nestjs/core");
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const swagger_1 = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
const app_module_1 = __webpack_require__(/*! ./app.module */ "./src/app.module.ts");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: process.env.NODE_ENV === 'production'
            ? [process.env.WEB_URL || 'http://localhost:3000']
            : true,
        credentials: true,
    });
    app.useGlobalPipes(new common_1.ValidationPipe());
    const config = new swagger_1.DocumentBuilder()
        .setTitle('FlowLink API')
        .setDescription('Compliant Web3 Payment Links API')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api', app, document);
    const port = process.env.API_PORT || 3001;
    await app.listen(port);
    console.log(`🚀 FlowLink API running on port ${port}`);
}
bootstrap();

})();

/******/ })()
;