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
exports.RemoteDash = void 0;
const typeorm_1 = require("typeorm");
const User_1 = require("./User");
const LearnIR_1 = require("./LearnIR");
let RemoteDash = class RemoteDash {
    ;
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], RemoteDash.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], RemoteDash.prototype, "seqNo", void 0);
__decorate([
    (0, typeorm_1.Column)("text"),
    __metadata("design:type", String)
], RemoteDash.prototype, "layout", void 0);
__decorate([
    (0, typeorm_1.Column)("text"),
    __metadata("design:type", String)
], RemoteDash.prototype, "components", void 0);
__decorate([
    (0, typeorm_1.Column)("text"),
    __metadata("design:type", String)
], RemoteDash.prototype, "iconUrl", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], RemoteDash.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(type => LearnIR_1.LearnIR, learnIR => learnIR.remoteDashes),
    __metadata("design:type", LearnIR_1.LearnIR)
], RemoteDash.prototype, "learnIR", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(type => User_1.User, user => user.remoteDashes),
    __metadata("design:type", User_1.User)
], RemoteDash.prototype, "user", void 0);
RemoteDash = __decorate([
    (0, typeorm_1.Entity)()
], RemoteDash);
exports.RemoteDash = RemoteDash;
//# sourceMappingURL=RemoteDash.js.map