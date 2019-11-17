
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('kyhoc').del()
    .then(function () {
      // Inserts seed entries
      return knex('kyhoc').insert([
        {id: 1, batdau:'2019-08-15',ketthuc:'2019-12-30', name:'1',lakyphu:false},
      ]);
    });
};
