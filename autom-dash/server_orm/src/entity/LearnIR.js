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
exports.LearnIR = void 0;
const typeorm_1 = require("typeorm");
const User_1 = require("./User");
const RemoteDash_1 = require("./RemoteDash");
let LearnIR = class LearnIR {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], LearnIR.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], LearnIR.prototype, "seqNo", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], LearnIR.prototype, "location", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], LearnIR.prototype, "address", void 0);
__decorate([
    typeorm_1.ManyToOne(type => User_1.User, user => user.learnIRs),
    __metadata("design:type", User_1.User)
], LearnIR.prototype, "user", void 0);
__decorate([
    typeorm_1.OneToMany(type => RemoteDash_1.RemoteDash, remoteDash => remoteDash.learnIR),
    __metadata("design:type", Array)
], LearnIR.prototype, "remoteDashes", void 0);
LearnIR = __decorate([
    typeorm_1.Entity()
], LearnIR);
exports.LearnIR = LearnIR;
//# sourceMappingURL=LearnIR.js.map