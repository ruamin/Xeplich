exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex("lophocphan")
    .del()
    .then(function() {
      // Inserts seed entries
      return knex("lophocphan").insert([
        {
          id: 1,
          malophocphan: "12264151 1",
          sosinhvien: 110,
          idmonhoc: "1"
        },
        {
          id: 17,
          malophocphan: "12226151 1",
          sosinhvien: 110,
          idmonhoc: "6"
        },
        {
          id: 18,
          malophocphan: "12264151 2",
          sosinhvien: 110,
          idmonhoc: "6"
        },
        {
          id: 19,
          malophocphan: "12264151 3",
          sosinhvien: 110,
          idmonhoc: "6"
        },
        {
          id: 21,
          malophocphan: "12261151",
          sosinhvien: 110,
          idmonhoc: "2"
        },
        {
          id: 29,
          malophocphan: "12264151 2",
          sosinhvien: 110,
          idmonhoc: "1"
        },
        {
          id: 30,
          malophocphan: "12272151",
          sosinhvien: 110,
          idmonhoc: "4"
        }
      ]);
    });
};
