"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const typeorm_1 = require("typeorm");
const RemoteDash_1 = require("./RemoteDash");
const LearnIR_1 = require("./LearnIR");
const IRSignal_1 = require("./IRSignal");
let User = class User {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], User.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], User.prototype, "passwordDigest", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    typeorm_1.OneToMany(type => LearnIR_1.LearnIR, learnIR => learnIR.user),
    __metadata("design:type", Array)
], User.prototype, "learnIRs", void 0);
__decorate([
    typeorm_1.OneToMany(type => IRSignal_1.IRSignal, IRSignal => IRSignal.user),
    __metadata("design:type", Array)
], User.prototype, "IRSignals", void 0);
__decorate([
    typeorm_1.OneToMany(type => RemoteDash_1.RemoteDash, remoteDash => remoteDash.user),
    __metadata("design:type", Array)
], User.prototype, "remoteDashes", void 0);
User = __decorate([
    typeorm_1.Entity("users")
], User);
exports.User = User;
//# sourceMappingURL=User.js.map