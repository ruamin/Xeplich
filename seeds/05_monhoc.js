
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('monhoc').del()
    .then(function () {
      // Inserts seed entries
      return knex('monhoc').insert([
        {id: 1, mamonhoc:'12264151',name:'Công nghệ XML và WEB ngữ nghĩa', sotinchi:'3'},
        {id: 2, mamonhoc:'12261151',name:'Xử lý tín hiệu số(CNTT)', sotinchi:'3'},
        {id: 3, mamonhoc:'12260151',name:'Công nghệ đa phương tiện', sotinchi:'3'},
        {id: 4, mamonhoc:'12272151',name:'Phát triển trò chơi trực tuyến', sotinchi:'3'},
        {id: 5, mamonhoc:'12364151',name:'Lập trình trò chơi và mô phỏng', sotinchi:'3'},
        {id: 6, mamonhoc:'12226151',name:'Lý thuyết hệ điều hành', sotinchi:'3'},
        {id: 7, mamonhoc:'12273151',name:'Thiết kế trò chơi số', sotinchi:'3'},
        {id: 8, mamonhoc:'12561151',name:'Thiết kế xây dựng phần mềm', sotinchi:'3'},
        {id: 9, mamonhoc:'12227151',name:'Trí tuệ nhân tạo', sotinchi:'3'},
        {id: 10, mamonhoc:'12380151',name:'Quản lý dự án hệ thống thông tin', sotinchi:'3'},
        {id: 11, mamonhoc:'12565151',name:'Khai phá dữ liệu', sotinchi:'3'},
        {id: 12, mamonhoc:'12558151',name:'Công nghệ Client/Server', sotinchi:'3'},
        {id: 13, mamonhoc:'12423151',name:'Công nghệ lập trình tích hợp', sotinchi:'3'},
        {id: 14, mamonhoc:'12564151',name:'Thiết kế giao diện người sử dụng', sotinchi:'3'},
        {id: 15, mamonhoc:'12556151',name:'Lập trình nâng cao', sotinchi:'3'},
        {id: 16, mamonhoc:'12524151',name:'Ngôn ngữ lập trình 2', sotinchi:'2'},
        {id: 17, mamonhoc:'12526151',name:'Ngôn ngữ lập trình 1', sotinchi:'2'},
      ]);
    });
};
