
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('account').del()
    .then(function () {
      // Inserts seed entries
      return knex('account').insert([
        {id: 1, username: 'admin', password: '123qwe', fullName: 'admin'},
      ]);
    });
};
