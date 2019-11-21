exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex("giangvien")
    .del()
    .then(function() {
      // Inserts seed entries
      return knex("giangvien").insert([
        {
          id: 1,
          name: "Nguyễn Trung Tín",
          capbac: "Trung Tá",
          hocvi: "Tiến sĩ"
        },
        { id: 2, name: "Vi Bảo Ngọc", capbac: "Trung Tá", hocvi: "Thạc sĩ" },
        {
          id: 3,
          name: "Trần Cao Trưởng",
          capbac: "Trung Tá",
          hocvi: "Tiến sĩ"
        },
        { id: 4, name: "Hà Trí Trung", capbac: "Trung Tá", hocvi: "Tiến sĩ" },
        { id: 5, name: "Hà Đại Dương", capbac: "Trung Tá", hocvi: "Tiến sĩ" },
        { id: 6, name: "Hồ Nhật Quang", capbac: "Trung Tá", hocvi: "Tiến sĩ" },
        {
          id: 7,
          name: "Nguyễn Quốc Khánh",
          capbac: "Trung Tá",
          hocvi: "Tiến sĩ"
        },
        {
          id: 8,
          name: "Nguyễn Thị Hiền",
          capbac: "Trung Tá",
          hocvi: "Tiến sĩ"
        },
        { id: 9, name: "Vũ Văn Trường", capbac: "Trung Tá", hocvi: "Thạc sĩ" },
        { id: 10, name: "Phan Văn Việt", capbac: "Trung Tá", hocvi: "Tiến sĩ" },
        {
          id: 11,
          name: "Nguyễn Hoài Anh",
          capbac: "Trung Tá",
          hocvi: "Tiến sĩ"
        },
        {
          id: 12,
          name: "Đỗ Thị Mai Hường",
          capbac: "Trung Tá",
          hocvi: "Thạc sĩ"
        },
        {
          id: 13,
          name: "Nguyễn Văn Giang",
          capbac: "Trung Tá",
          hocvi: "Tiến sĩ"
        },
        {
          id: 14,
          name: "Nguyễn Mậu Uyên",
          capbac: "Trung Tá",
          hocvi: "Tiến sĩ"
        },
        { id: 15, name: "Trần Văn An", capbac: "Trung Tá", hocvi: "Thạc sĩ" },
        { id: 16, name: "Hoa Tất Thắng", capbac: "Trung Tá", hocvi: "Tiến sĩ" },
        { id: 17, name: "Tống Minh Đức", capbac: "Trung Tá", hocvi: "Tiến sĩ" },
        {
          id: 18,
          name: "Nguyễn Văn Việt",
          capbac: "Trung Tá",
          hocvi: "Thạc sĩ"
        },
        {
          id: 19,
          name: "Trần Hồng Quang",
          capbac: "Trung Tá",
          hocvi: "Tiến sĩ"
        },
        {
          id: 20,
          name: "Nguyễn Việt Hùng",
          capbac: "Trung Tá",
          hocvi: "Tiến sĩ"
        },
        {
          id: 21,
          name: "Nguyễn Văn Quân",
          capbac: "Trung Tá",
          hocvi: "Thạc sĩ"
        },
        {
          id: 22,
          name: "Nguyễn Kim Thanh",
          capbac: "Trung Tá",
          hocvi: "Tiến sĩ"
        },
        {
          id: 23,
          name: "Nguyễn Quang Uy",
          capbac: "Trung Tá",
          hocvi: "Tiến sĩ"
        },
        { id: 24, name: "Lưu Hồng Dũng", capbac: "Trung Tá", hocvi: "Thạc sĩ" },
        {
          id: 25,
          name: "Nguyễn Trung Thành",
          capbac: "Trung Tá",
          hocvi: "Tiến sĩ"
        },
        { id: 26, name: "Cao Văn Lợi", capbac: "Trung Tá", hocvi: "Tiến sĩ" }
      ]);
    });
};
