exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex("giangduong")
    .del()
    .then(function() {
      // Inserts seed entries
      return knex("giangduong").insert([
        { id: 1, toanha: "H9", sochongoi: 110, tenphong: "9302" },
        { id: 2, toanha: "H9", sochongoi: 110, tenphong: "9201" },
        { id: 3, toanha: "H9", sochongoi: 110, tenphong: "9202" },
        { id: 4, toanha: "H9", sochongoi: 110, tenphong: "9203" },
        { id: 5, toanha: "H9", sochongoi: 110, tenphong: "9301" },
        { id: 6, toanha: "H9", sochongoi: 70, tenphong: "9303" },
        { id: 7, toanha: "H9", sochongoi: 70, tenphong: "9501" },
        { id: 8, toanha: "H9", sochongoi: 70, tenphong: "9502" },
        { id: 9, toanha: "H9", sochongoi: 70, tenphong: "9503" },
        { id: 10, toanha: "H9", sochongoi: 70, tenphong: "9504" },
        { id: 11, toanha: "H9", sochongoi: 70, tenphong: "9601" },
        { id: 12, toanha: "H9", sochongoi: 70, tenphong: "9602" },
        { id: 13, toanha: "H9", sochongoi: 70, tenphong: "9603" },
        { id: 14, toanha: "H5", sochongoi: 110, tenphong: "5308" },
        { id: 15, toanha: "H5", sochongoi: 110, tenphong: "5309" },
        { id: 16, toanha: "H5", sochongoi: 110, tenphong: "5310" },
        { id: 17, toanha: "H5", sochongoi: 110, tenphong: "5311" },
        { id: 18, toanha: "H5", sochongoi: 110, tenphong: "5312" },
        { id: 19, toanha: "H5", sochongoi: 110, tenphong: "5313" },
        { id: 20, toanha: "H5", sochongoi: 110, tenphong: "5314" },
        { id: 21, toanha: "H5", sochongoi: 110, tenphong: "5315" },
        { id: 22, toanha: "H5", sochongoi: 110, tenphong: "5408" },
        { id: 23, toanha: "H5", sochongoi: 110, tenphong: "5409" },
        { id: 24, toanha: "H5", sochongoi: 110, tenphong: "5410" },
        { id: 25, toanha: "H5", sochongoi: 110, tenphong: "5411" },
        { id: 26, toanha: "H5", sochongoi: 70, tenphong: "5412" },
        { id: 27, toanha: "H5", sochongoi: 110, tenphong: "5413" },
        { id: 28, toanha: "H5", sochongoi: 70, tenphong: "5414" },
        { id: 29, toanha: "H5", sochongoi: 70, tenphong: "5508" },
        { id: 30, toanha: "H5", sochongoi: 110, tenphong: "5509" }
      ]);
    });
};
