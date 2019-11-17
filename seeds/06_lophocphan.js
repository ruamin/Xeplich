
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('lophocphan').del()
    .then(function () {
      // Inserts seed entries
      return knex('lophocphan').insert([
        {id: 1, malophocphan:'12264151 1 ',idmonhoc:'1', idkyhoc:'1'},
      ]);
    });
};
