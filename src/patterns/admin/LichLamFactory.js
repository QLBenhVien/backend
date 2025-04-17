// factories/LichLamFactory.js
class LichLamFactory {
  static create(NhanVienId, NgayKham, Ca) {
    return {
      MaNV: NhanVienId,
      NgayKham,
      Ca,
    };
  }
}

module.exports = LichLamFactory;
