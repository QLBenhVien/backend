class PhieuKhamPrototype {
  constructor(template) {
    this.template = template; // Mẫu phiếu khám gốc
  }

  clone(overrides = {}) {
    return { ...this.template, ...overrides }; // Tạo bản sao và ghi đè dữ liệu mới
  }
}

module.exports = PhieuKhamPrototype;
