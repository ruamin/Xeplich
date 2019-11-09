
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('giangvien').del()
    .then(function () {
      // Inserts seed entries
      return knex('giangvien').insert([
        {id: 1, name='Nguyễn Trung Tín',capbac='Trung Tá', hocvi='Tiến sĩ'},
      ]);
    });
};
