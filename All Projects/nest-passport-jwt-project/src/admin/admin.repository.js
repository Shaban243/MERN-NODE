"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminRepository = void 0;
const typeorm_1 = require("typeorm");
class AdminRepository extends typeorm_1.Repository {
    async findByEmail(email) {
        return this.findOne({ where: { email } });
    }
}
exports.AdminRepository = AdminRepository;
//# sourceMappingURL=admin.repository.js.map