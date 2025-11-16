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
exports.GameService = void 0;
const common_1 = require("@nestjs/common");
let GameService = class GameService {
    board = [];
    constructor() {
        this.initializeBoard();
    }
    initializeBoard() {
        this.board = [
            { type: '차', team: 'red', position: { x: 0, y: 0 } },
            { type: '왕', team: 'red', position: { x: 4, y: 0 } },
        ];
    }
    getBoard() {
        return this.board;
    }
    movePiece(from, to) {
        const piece = this.board.find((p) => p.position.x === from.x && p.position.y === from.y);
        if (!piece)
            return false;
        piece.position = to;
        return true;
    }
};
exports.GameService = GameService;
exports.GameService = GameService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], GameService);
//# sourceMappingURL=game.service.js.map