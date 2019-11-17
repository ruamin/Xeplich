
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('giangvien').del()
    .then(function () {
      // Inserts seed entries
      return knex('giangvien').insert([
        {id: 1, name:'Nguyễn Trung Tín', capbac:'Trung Tá', hocvi:'Tiến sĩ'},
        {id: 2, name:'Vi Bảo Ngọc', capbac:'Trung Tá', hocvi:'Thạc sĩ'},
        {id: 3, name:'Trần Cao Trưởng', capbac:'Trung Tá', hocvi:'Tiến sĩ'},
        {id: 4, name:'Hà Trí Trung', capbac:'Trung Tá', hocvi:'Tiến sĩ'},
        {id: 5, name:'Hà Đại Dương', capbac:'Trung Tá', hocvi:'Tiến sĩ'},
        {id: 6, name:'Hồ Nhật Quang', capbac:'Trung Tá', hocvi:'Tiến sĩ'},
        {id: 7, name:'Nguyễn Quốc Khánh', capbac:'Trung Tá', hocvi:'Tiến sĩ'},
        {id: 8, name:'Nguyễn Thị Hiền', capbac:'Trung Tá', hocvi:'Tiến sĩ'},
        {id: 9, name:'Vũ Văn Trường', capbac:'Trung Tá', hocvi:'Thạc sĩ'},
        {id: 10, name:'Phan Văn Việt', capbac:'Trung Tá', hocvi:'Tiến sĩ'},
        {id: 11, name:'Nguyễn Hoài Anh', capbac:'Trung Tá', hocvi:'Tiến sĩ'},
        {id: 12, name:'Đỗ Thị Mai Hường', capbac:'Trung Tá', hocvi:'Thạc sĩ'},
        {id: 13, name:'Nguyễn Văn Giang', capbac:'Trung Tá', hocvi:'Tiến sĩ'},
        {id: 15, name:'Nguyễn Mậu Uyên', capbac:'Trung Tá', hocvi:'Tiến sĩ'},

      ]);
    });
};
