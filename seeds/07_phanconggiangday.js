exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex("phanconggiangday")
    .del()
    .then(function() {
      // Inserts seed entries
      return knex("phanconggiangday").insert([
        { id: 1, idlophocphan: 1, idgiangvien: 1, idkyhoc: 1 },
        { id: 2, idlophocphan: 17, idgiangvien: 4, idkyhoc: 1 },
        { id: 3, idlophocphan: 18, idgiangvien: 4, idkyhoc: 1 },
        { id: 4, idlophocphan: 29, idgiangvien: 1, idkyhoc: 1 }
      ]);
    });
};
