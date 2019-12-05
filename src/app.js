const path = require("path");
const lodash = require("lodash");
const express = require("express");
const nunjucks = require("nunjucks");
const bodyParser = require("body-parser");
const session = require("express-session");
const _ = require("lodash");
const dbConfig = require("./config");
const knex = require("knex")(dbConfig);
const app = express();

app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true
  })
);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.resolve(__dirname, "./public")));
app.set("views", path.resolve(__dirname, "./views"));
nunjucks.configure(path.resolve(__dirname, "./views"), {
  autoescape: true,
  express: app
});
app.set("view engine", "html");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", async (req, res) => {
  if (req.session.loggedin) {
    res.render("home/home.html");
  } else {
    res.send('Please <a href="/account/login">login</a> to view this page!');
  }
});

function filterTkbNew(tkb) {
  return [
    _.filter(tkb, { tiet: 1 }),
    _.filter(tkb, { tiet: 2 }),
    _.filter(tkb, { tiet: 3 }),
    _.filter(tkb, { tiet: 4 }),
    _.filter(tkb, { tiet: 5 }),
    _.filter(tkb, { tiet: 6 }),
    _.filter(tkb, { tiet: 7 }),
    _.filter(tkb, { tiet: 8 }),
    _.filter(tkb, { tiet: 9 }),
    _.filter(tkb, { tiet: 10 }),
    _.filter(tkb, { tiet: 11 }),
    _.filter(tkb, { tiet: 12 })
  ];
}

function demNgayDayY(tkb, idgiangvien, thu) {
  const gioday = _.filter(tkb, { idgiangvien, thu });
  if (gioday.length) {
    return 1;
  }
  return 0;
}

// Không giảng viên nào dạy 2 lớp trong cùng thời gian
function rangbuocHC1(tkb, idgiangvien, idlophocphan, thu, tiet, idgiangduong) {
  const result = _.filter(tkb, {
    idgiangvien,
    idlophocphan,
    thu,
    tiet,
    idgiangduong
  });
  if (result.length >= 2) {
    console.log("Loi giang buoc 1");
    return false;
  }
  return true;
}

// Giảng viên phải dạy đúng lớp và đúng môn học được giao
function rangbuocHC2(
  tkb,
  A,
  idgiangvien,
  idlophocphan,
  idgiangduong,
  thu,
  tiet
) {
  const resultTkb = _.filter(tkb, {
    idgiangvien,
    idlophocphan,
    idgiangduong,
    thu,
    tiet
  });
  const lopPhanCong = _.filter(A, {
    idgiangvien,
    idlophocphan,
    idgiangduong,
    cannotTeach: 0
  }); // dc day
  if (lopPhanCong[0].cannotTeach * resultTkb[0].canTeach === 0) {
    return true;
  }
  return false;
}
// Mỗi giảng viên dạy phải đủ số lớp theo phân công
function rangbuocHC3(tkb, monhoc, A, idgiangvien, idlophocphan) {
  const resultTkb = _.filter(tkb, { idgiangvien, idlophocphan });
  const filterLHP = _.filter(lophocphan, { id: idlophocphan })[0];
  const filterMon = _.filter(monhoc, { id: lophocphan.idmonhoc })[0];
  const resultA = _.filter(A, { idgiangvien, idlophocphan, cannotTeach: 0 });
  if (resultTkb.length / filterMon.sotinchi === resultA.length) {
    return true;
  }
  console.log("Loi giang buoc 3");
  return false;
}
// Mỗi giảng viên phải dạy đủ số môn
function rangbuocHC5(tkb, monhoc, A, idgiangvien, idmonhoc) {
  const resultAGvDuocDayMonHoc = _.filter(A, {
    idgiangvien,
    idmonhoc,
    cannotTeach: 0
  });
  const resultTkbCuaGVDayMonHoc = _.filter(tkb, { idgiangvien, idmonhoc });
  const filterMonHoc = _.filter(monhoc, { id: idmonhoc })[0];
  if (
    resultAGvDuocDayMonHoc.length ===
      resultTkbCuaGVDayMonHoc.length / filterMonHoc.sotinchi ||
    filterMonHoc.length
  ) {
    return true;
  }
  console.log("Loi giang buoc 5");
  return false;
}
//Moi giang duong chi chưa 1 lop trong 1 khoang thoi gian
function rangbuocHC6(tkb, idlophocphan, idgiangduong, thu, tiet) {
  const gdPhanCongDayLop = _.filter(tkb, {
    idlophocphan,
    idgiangduong,
    thu,
    tiet
  });
  if (gdPhanCongDayLop.length >= 2) {
    console.log("Loi giang buoc 6");
    return false;
  }
  return true;
}

// Các lớp học đúng thời gian được phân công
function rangbuocHC7(
  tkb,
  A,
  idgiangvien,
  idlophocphan,
  idgiangduong,
  thu,
  tiet,
  monhoc
) {
  const resultTkbGvDayMonTaiThuTiet = _.filter(tkb, {
    idgiangvien,
    idlophocphan,
    idgiangduong,
    thu,
    tiet
  });
  const lopPhanCongCuaDv = _.filter(A, {
    idgiangvien,
    idlophocphan,
    cannotTeach: 0
  });
  const filterLHP = _.filter(lophocphan, { id: idlophocphan })[0];
  if (
    lopPhanCongCuaDv[0].cannotTeach *
      resultTkbGvDayMonTaiThuTiet[0].canTeach ===
      0 ||
    filterLHP.length
  ) {
    return true;
  }
  return false;
}
function rangbuocMem(tkb, lophocphan, A, idgiangvien, idlophocphan) {
  const resultTkbGvLHP = _.filter(tkb, { idgiangvien, idlophocphan });
  const filterMonGBM = _.filter(monhoc, { id: idmonhoc });
  const resultAGBM = _.filter(A, { idgiangvien, idmonhoc, duocdaylop: 0 });
  if (resultTkbGvMon.length / filterMonGBM[0].sotinchi === resultAGBM.length) {
    return true;
  }
  console.log("Loi giang buoc mem");
  return false;
}
function kiemTra(arrayX) {
  const listTkbOke = [];
  for (let index = 0; index < arrayX.length; index++) {
    const tkb = arrayX[index];
    let KT = true;
    for (let indexTkb = 0; indexTkb < tkb.length; indexTkb++) {
      const {
        idgiangvien,
        idmonhoc,
        idlophocphan,
        idgiangduong,
        thu,
        tiet
      } = tkb[indexTkb];
      if (
        rangbuocHC1(tkb, idgiangvien, idmonhoc, thu, tiet, idgiangduong) ===
          false ||
        rangbuocHC2(tkb, idlophocphan, thu, tiet) === false
        // rangbuocHC3(tkb, A, idgiangvien, idmonhoc, idlophocphan, thu, tiet) ===
        //  false ||
        // rangbuocHC4(tkb, monhoc, A, idgiangvien, idmonhoc) === false ||
        // rangbuocHC5(tkb, monhoc, A, idgiangvien, idmonhoc) === false ||
        // rangbuocHC6(tkb, idlophocphan, idgiangduong, thu, tiet) === false
      ) {
        KT = false;
        break;
      }
    }
    KT && listTkbOke.push(tkb);
  }

  return listTkbOke;
}

app.get("/:type", async (req, res) => {
  const { type } = req.params;
  const template = `${type}/${type}.html`;
  switch (type) {
    case "giangvien":
      const listTeacher = await knex("giangvien").select();
      res.render(template, {
        listTeacher,
        numberOfTeacher: listTeacher.length
      });
      return;
    case "monhoc":
      const [listSubject] = await Promise.all([await knex("monhoc").select()]);
      res.render(template, {
        listSubject,
        numberOfSuject: listSubject.length
      });
      break;
    case "giangduong":
      const [listGiangDuong] = await Promise.all([
        await knex("giangduong").select()
      ]);
      res.render(template, {
        listGiangDuong,
        numberOfSuject: listGiangDuong.length
      });
      break;
    case "lophocphan": {
      const [listSubject, listKyHoc, listHocPhan] = await Promise.all([
        await knex("monhoc").select(),
        await knex("kyhoc").select(),
        await knex("lophocphan").select()
      ]);
      for (let index = 0; index < listHocPhan.length; index++) {
        const monhoc = _.filter(listSubject, {
          id: listHocPhan[index].idmonhoc
        });
        const kyhoc = _.filter(listKyHoc, { id: listHocPhan[index].idkyhoc });
        listHocPhan[index].monhoc = monhoc[0];
        listHocPhan[index].kyhoc = kyhoc[0];
      }
      // console.log('lophocphan');

      res.render(template, {
        listSubject,
        listKyHoc,
        listHocPhan,
        numberOfClass: listHocPhan.length
      });
      break;
    }
    case "phanconggiangday": {
      const [
        listTeacherGiangDay,
        listClassGiangDay,
        listSubjectGiangDay,
        listKyHoc,
        listPhanCongGiangDay
      ] = await Promise.all([
        await knex("giangvien").select(),
        await knex("lophocphan").select(),
        await knex("monhoc").select(),
        await knex("kyhoc").select(),
        await knex("phanconggiangday").select()
      ]);
      for (let index = 0; index < listPhanCongGiangDay.length; index++) {
        const giangVien = _.filter(listTeacherGiangDay, {
          id: listPhanCongGiangDay[index].idgiangvien
        });
        const lopHoc = _.filter(listClassGiangDay, {
          id: listPhanCongGiangDay[index].idlophocphan
        });

        const monHoc = _.filter(listSubjectGiangDay, {
          id: lopHoc[0].idmonhoc
        });
        const kyHoc = _.filter(listKyHoc, {
          id: listPhanCongGiangDay[0].idkyhoc
        });

        listPhanCongGiangDay[index].chiTietGv = giangVien[0];
        listPhanCongGiangDay[index].chiTietLopHoc = lopHoc[0];
        listPhanCongGiangDay[index].chiTietMonHoc = monHoc[0];
        listPhanCongGiangDay[index].chitetKyHoc = kyHoc[0];
      }
      res.render(template, {
        listTeacherGiangDay,
        listClassGiangDay,
        listSubjectGiangDay,
        listPhanCongGiangDay,
        listKyHoc,
        numberOfSuject: listSubjectGiangDay.length
      });

      break;
    }
    case "phanconggiangday2": {
      const [
        listTeacherGiangDay,
        listClassGiangDay,
        listSubjectGiangDay,
        listPhanCongGiangDay
      ] = await Promise.all([
        await knex("giangvien").select(),
        await knex("lop").select(),
        await knex("monhoc").select(),
        await knex("phanconggiangday2").select()
      ]);
      for (let index = 0; index < listPhanCongGiangDay.length; index++) {
        const giangVien = _.filter(listTeacherGiangDay, {
          id: listPhanCongGiangDay[index].idgiangvien
        });
        const lopHoc = _.filter(listClassGiangDay, {
          id: listPhanCongGiangDay[index].idhp
        });
        const monHoc = _.filter(listSubjectGiangDay, {
          id: listPhanCongGiangDay[index].idmonhoc
        });
        listPhanCongGiangDay[index].chiTietGv = giangVien[0];
        listPhanCongGiangDay[index].chiTietLopHoc = lopHoc[0];
        listPhanCongGiangDay[index].chiTietMonHoc = monHoc[0];
      }
      res.render(template, {
        listTeacherGiangDay,
        listClassGiangDay,
        listSubjectGiangDay,
        listPhanCongGiangDay,
        numberOfSuject: listSubjectGiangDay.length
      });
      break;
    }
    case "lop":
      const listClassNeww = await knex("lop").select();
      res.render(template, {
        listClass: listClassNeww,
        numberOfClass: listClassNeww.length
      });
      break;
    default:
      res.redirect("/");
      break;
  }
});

app.get("/tkb/sinhtkb/:ky", async (req, res) => {
  const { ky } = req.params;
  let [
    listTeacherNew,
    listHPNew,
    listRoomNew,
    listPhanCongGiangDayNew,
    listMonhocNew
  ] = await Promise.all([
    await knex("giangvien").select(),
    await knex("lophocphan").select(),
    await knex("giangduong").select(),
    await knex("phanconggiangday")
      .where({ idkyhoc: ky })
      .select(),
    await knex("monhoc").select()
  ]);

  const danhSachThuHoc = [2, 3, 4, 5, 6];
  const danhTietHocTrongNgay = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  // Tao mang A phan cong mon hoc: { idgiangvien: 2, idmonhoc: 2, idlop: 2, duocdaylop: 0 }
  const A = [];
  listTeacherNew.map(giangvien => {
    listHPNew.map(lophocphan => {
      const filter = {
        idlophocphan: lophocphan.id,
        idgiangvien: giangvien.id
      };
      const phancong = _.filter(listPhanCongGiangDayNew, filter);
      if (phancong.length) {
        A.push({ ...filter, cannotTeach: 0 }); // duoc day lop nay
      } else {
        A.push({ ...filter, cannotTeach: 1 });
      }
    });
  });

  const L = [];
  // Tao mang L thời gian có thể học của lớp: { idlop: 2,phong: 1, thu: 2, tiet: 1, duocdaytiet: 0 }

  listHPNew.map(lophocphan => {
    listRoomNew.map(giangduong => {
      danhSachThuHoc.map(thu => {
        danhTietHocTrongNgay.map(tiet => {
          L.push({
            idlophocphan: lophocphan.id,
            thu,
            tiet,
            idgiangduong: giangduong.id,
            cannotTeach: 0
          });
        });
      });
    });
  });
  // console.log({L});

  // Tạo mảng X biểu diễn khả năng giảng viên P được dạy môn S lớp C thứ D tiết T phong r
  // A - { idgiangvien: 2, idmonhoc: 2, idlop: 2, duocdaylop: 1 } L - { idlop: 2, phong : 1, thu: 2, tiet: 1, duocdaytiet: 0 }
  const X = [];
  A.map(phancong => {
    const listlop = _.filter(L, { idlophocphan: phancong.idlophocphan });
    listlop.map(ll => {
      const x = {
        ...phancong,
        ...ll,
        canTeach: 0
      };
      delete x.cannotTeach;
      X.push(x);
    });
  });

  // const X = [];
  // for (let index = 0; index < A.length; index++) {
  //   const listLop = _.filter(L, { idlop: A[index].idlop });
  //   for (let indexLop = 0; indexLop < listLop.length; indexLop++) {
  //     X.push({
  //       ...A[index],
  //       ...listLop[indexLop],
  //       duocdayloptaitiet: 0 // 0 Là không được dạy lớp này tại tiết này
  //     });
  //   }
  // }

  // For mảng A phân công giảng dạy : 0 được dạy - 1 không được dạy ({ idgiangvien: 2, idmonhoc: 2, idlop: 2, duocdaylop: 0 })
  let dem = 0;
  listTeacherNew = _.shuffle(listTeacherNew);
  // main process
  // var lastRoomAssigment = {};

  listTeacherNew.map(giangvien => {
    const pcgdcuagiaovien = _.filter(A, {
      idgiangvien: giangvien.id,
      cannotTeach: 0
    });

    listHPNew.map(lophocphan => {
      const pcdaylop = _.filter(pcgdcuagiaovien, {
        idlophocphan: lophocphan.id
      });
      const monhoc = _.find(listMonhocNew, { id: lophocphan.idmonhoc });

      if (pcdaylop.length) {
        let soTinChiDaXepLich = 0;
        let kt = true;

        pcdaylop.map(pcday => {
          soTinChiDaXepLich = 0;

          for (const giangduong of listRoomNew) {
            if (!kt) {
              kt = true; //da xếp lịch thành công cho lớp học phần
              break;
            }

            if (lophocphan.sosinhvien !== giangduong.sochongoi) {
              continue; // xet vao giang duong khac
            }

            //   lastRoomAssigment = lastRoomAssigment[giangduong.id] || {
            //     thu: 2,
            //     tiet: 1,
            //   };

            //   if (lastRoomAssigment.thu === 6 && 12 - lastRoomAssigment.tiet < monhoc.sotinchi) {
            //     continue;
            //   }

            for (const thu of danhSachThuHoc) {
              if (!kt) {
                break;
              }

              const soTietLopHocTrongNgay = _.filter(X, {
                canTeach: 1,
                idlophocphan: pcday.idlophocphan,
                thu
              }); // tim het tat ca cac tiet lop hoc phan da xếp lịch

              const soTietGVDayTrongNgay = _.filter(X, {
                canTeach: 1,
                thu,
                idgiangvien: giangvien.id
              }); // tim hết tất cả các tiest giảng viên đã dạy

              const soTietGiangDuongTrongNgay = _.filter(X, {
                canTeach: 1,
                thu,
                idgiangduong: giangduong.id
              });

              if (soTietGVDayTrongNgay.length + monhoc.sotinchi > 6) {
                continue;
              }

              const tietCuoiCungDay = soTietGVDayTrongNgay.length
                ? soTietGVDayTrongNgay[soTietGVDayTrongNgay.length - 1].tiet
                : 0; //tiết cuối cùng giảng viên dạy trong ngày
              const tietCuoiCungHoc = soTietLopHocTrongNgay.length
                ? soTietLopHocTrongNgay[soTietLopHocTrongNgay.length - 1].tiet
                : 0;
              const tietCuoiCungGiangDuong = soTietGiangDuongTrongNgay.length
                ? soTietGiangDuongTrongNgay[
                    soTietGiangDuongTrongNgay.length - 1
                  ].tiet
                : 0;

              //tiết cuối cùng lớp học phần học trong ngày
              const soTietConLaiTrongBuoiCuaGV = 12 - tietCuoiCungDay; //số tiết giảng viên có thể dạy tiếp
              const soTietConLaiLopHocTrongBuoi = 12 - tietCuoiCungHoc; //số tiết lớp có thể học đc tiếp
              const soTietConLaiGiangDuongTrongBuoi =
                12 - tietCuoiCungGiangDuong; //số tiết lớp có thể học đc tiếp

              if (
                12 - soTietLopHocTrongNgay.length >= monhoc.sotinchi &&
                12 - soTietLopHocTrongNgay.length >= monhoc.sotinchi &&
                12 - soTietGiangDuongTrongNgay.length >= monhoc.sotinchi &&
                soTietConLaiTrongBuoiCuaGV > monhoc.sotinchi &&
                soTietConLaiGiangDuongTrongBuoi > monhoc.sotinchi &&
                soTietConLaiLopHocTrongBuoi >= monhoc.sotinchi
              ) {
                for (const tiet of danhTietHocTrongNgay) {
                  if (soTinChiDaXepLich >= monhoc.sotinchi) {
                    kt = false;
                    break; //da xếp lịch xong cho lớp học phần
                  }

                  //HC1
                  const gvCoTheDay = _.find(X, {
                    canTeach: 1,
                    thu,
                    tiet,
                    idgiangvien: giangvien.id
                  });

                  if (!gvCoTheDay) {
                    //HC2
                    const lopCoTheDay = _.find(X, {
                      canTeach: 1,
                      idlophocphan: lophocphan.id,
                      thu,
                      tiet
                    });

                    const giangDuongCoTheDay = _.find(X, {
                      canTeach: 1,
                      idgiangduong: giangduong.id,
                      thu,
                      tiet
                    });

                    if (!lopCoTheDay && !giangDuongCoTheDay) {
                      const tietCoTheDay = _.find(L, {
                        cannotTeach: 0,
                        idlophocphan: lophocphan.id,
                        thu,
                        tiet,
                        idgiangduong: giangduong.id
                      });

                      if (tietCoTheDay) {
                        if (
                          tiet <= 6 &&
                          7 - tiet < monhoc.sotinchi - soTinChiDaXepLich
                        ) {
                          continue;
                        }

                        if (
                          tiet > 6 &&
                          13 - tiet < monhoc.sotinchi - soTinChiDaXepLich
                        ) {
                          continue;
                        }
                        //chỉ dạy ssnags hoăc dạy chiều
                        // if (tietCuoiCungDay <= 6 && tiet >= 7) {
                        //   continue;
                        // }
                        // xep lich
                        const Xpsctd = _.find(X, {
                          canTeach: 0,
                          idlophocphan: lophocphan.id,
                          thu,
                          tiet,
                          idgiangduong: giangduong.id,
                          idgiangvien: giangvien.id
                        }); // co phai la chua day khong?

                        // console.log({X})
                        if (Xpsctd) {
                          const indexOfXpsctd = _.indexOf(X, Xpsctd);
                          // console.log({indexOfXpsctd})

                          X[indexOfXpsctd] = {
                            ...Xpsctd,
                            canTeach: 1
                          };
                          dem += 1;
                          soTinChiDaXepLich += 1;
                          // lastRoomAssigment[giangduong.id] = {thu, tiet};
                          console.log("add to X", dem);
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        });
      }
    });
  });

  const XCuoiCung = _.filter(X, { canTeach: 1 });
  console.log({ XCuoiCung });
  const listTkbOke = kiemTra(XCuoiCung);
  console.log({ listTkbOke });
  const listDone = await knex("xrandom").insert({
    value: JSON.stringify(listTkbOke)
  });
  console.log("================================================");
  console.log("Tkb Da themmmmmmmmm: =======: ", listDone);
  console.log("================================================");
  return res.redirect("/tkb/sinhtkb");
});
app.get("/tkb/giangvien", async (req, res) => {
  try {
    const { giangvien = 1, idtkb = 1 } = req.query;
    const [
      listTeacherNew,
      listGiangDuong,
      listHocPhan,
      listMonHoc,
      listKyHoc
    ] = await Promise.all([
      await knex("giangvien").select(),
      await knex("giangduong").select(),
      await knex("lophocphan").select(),
      await knex("monhoc").select(),
      await knex("kyhoc").select()
    ]);

    const tkb = await knex("xlaitao")
      .select()
      .where("id", idtkb)
      .first();
    const tkbCuoi = JSON.parse(tkb.value);
    let danhsachDuocSapXep = _.sortBy(tkbCuoi, ["thu", "tiet"]);
    let tkbThemThongTin = [];
    for (let thongtin = 0; thongtin < danhsachDuocSapXep.length; thongtin++) {
      const thongtinhientai = danhsachDuocSapXep[thongtin];
      const thongtinGiangVien = _.filter(listTeacherNew, {
        id: thongtinhientai.idgiangvien
      })[0];
      const thongtinLop = _.filter(listHocPhan, {
        id: thongtinhientai.idlophocphan
      })[0];
      const thongtinGiangDuong = _.filter(listGiangDuong, {
        id: thongtinhientai.idgiangduong
      })[0];
      const thongtinMonHoc = _.filter(listMonHoc, {
        id: thongtinLop.idmonhoc
      })[0];

      tkbThemThongTin.push({
        ...thongtinhientai,
        thongtinGiangVien,
        thongtinLop,
        thongtinGiangDuong,
        thongtinMonHoc
      });
    }

    let thongTinGiangVien;
    if (giangvien) {
      tkbThemThongTin = _.filter(tkbThemThongTin, {
        idgiangvien: parseInt(giangvien)
      });

      thongTinGiangVien = _.filter(listTeacherNew, {
        id: parseInt(giangvien)
      })[0];

      const tkbThu2 = _.filter(tkbThemThongTin, { thu: 2 });
      const tkbThu3 = _.filter(tkbThemThongTin, { thu: 3 });
      const tkbThu4 = _.filter(tkbThemThongTin, { thu: 4 });
      const tkbThu5 = _.filter(tkbThemThongTin, { thu: 5 });
      const tkbThu6 = _.filter(tkbThemThongTin, { thu: 6 });

      const danhSachTkb = {
        thuHai: filterTkbNew(tkbThu2),
        thuBa: filterTkbNew(tkbThu3),
        thuTu: filterTkbNew(tkbThu4),
        thuNam: filterTkbNew(tkbThu5),
        thuSau: filterTkbNew(tkbThu6)
      };
      //console.log(JSON.stringify(danhSachTkb));

      return res.render("tkb/tkb.html", {
        danhSachTkb,
        listTeacherNew,
        giangvien: thongTinGiangVien,
        idtkb,
        listKyHoc
      });
    }
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
      data: error
    });
  }
});

app.get("/tkb/rangbuoc", async (req, res) => {
  try {
    const [
      listTeacherNew,
      listClassNew,
      listSubjectNew,
      listPhanCongMonHoc,
      listRandomX
    ] = await Promise.all([
      await knex("giangvien").select(),
      await knex("lophocphan").select(),
      await knex("monhoc").select(),
      await knex("phanconggiangday").select(),
      await knex("xrandom").select()
    ]);
    let listDung = [];
    for (let indexX = 0; indexX < listRandomX.length; indexX++) {
      const jsonX = JSON.parse(listRandomX[indexX].value);
      const jsonXAfterSort = _.sortBy(jsonX, ["thu", "tiet"]);
      let KT_NGOAI = true;
      if (KT_NGOAI) {
        listDung.push({ id: indexX });
      }
    }

    for (
      let indexListDung = 0;
      indexListDung < listDung.length;
      indexListDung++
    ) {
      const valueJson = JSON.parse(
        listRandomX[listDung[indexListDung].id].value
      );
      let tongNgayLenTruongGv = 0;
      for (let indexgv = 0; indexgv < listTeacherNew.length; indexgv++) {
        const gvhientai = listTeacherNew[indexgv];
        tongNgayLenTruongGv += demNgayDayY(valueJson, gvhientai.id, 2);
        tongNgayLenTruongGv += demNgayDayY(valueJson, gvhientai.id, 3);
        tongNgayLenTruongGv += demNgayDayY(valueJson, gvhientai.id, 4);
        tongNgayLenTruongGv += demNgayDayY(valueJson, gvhientai.id, 5);
        tongNgayLenTruongGv += demNgayDayY(valueJson, gvhientai.id, 6);
      }
      listDung[indexListDung].tongngay = tongNgayLenTruongGv;
    }
    const listDungSort = _.sortBy(listDung, "tongngay");

    // Truncate x table
    await knex("xlaitao").truncate();
    let listPromise = [];
    let listtkb = [];
    for (
      let indexListDung = 0;
      indexListDung < listDungSort.length;
      indexListDung++
    ) {
      const Xdung = listDungSort[indexListDung];
      listPromise.push(
        knex("xlaitao").insert({
          value: listRandomX[Xdung.id].value,
          tongngay: Xdung.tongngay
        })
      );
    }
    const listThemVaoX = await Promise.all(listPromise);

    const isInsert = false; //them vao bang tkb

    if (isInsert) {
      const xlaitaoValues = await knex("xlaitao").select();
      const xlaitaoValue = _.filter(xlaitaoValues, {
        id: Number(listThemVaoX[0])
      })[0].value;

      const xlaitaoObj = JSON.parse(xlaitaoValue);

      for (let index = 0; index < xlaitaoObj.length; index++) {
        const element = xlaitaoObj[index];
        await knex("thoikhoabieu").insert({
          idlophocphan: element.idlophocphan,
          idgiangvien: element.idgiangvien,
          ky: 1,
          idgiangduong: element.idgiangduong,
          thu: element.thu,
          tiet: element.tiet
        });
      }
    }

    return res.json({ listThemVaoX });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
      data: error
    });
  }
});

app.get("/tkb/rangbuoc/laitao", async (req, res) => {
  try {
    const [
      listTeacherNew,
      listClassNew,
      listSubjectNew,
      listPhanCongMonHoc,
      listLaiTao
    ] = await Promise.all([
      await knex("giangvien").select(),
      await knex("lop").select(),
      await knex("monhoc").select(),
      await knex("phanconggiangday").select(),
      await knex("xlaitao").select()
    ]);
    let listDung = [];
    for (let indexX = 0; indexX < listLaiTao.length; indexX++) {
      const jsonX = JSON.parse(listLaiTao[indexX].value);
      const jsonXAfterSort = _.sortBy(jsonX, ["thu", "tiet"]);
      let KT_NGOAI = true;

      for (let indexGv = 0; indexGv < listTeacherNew.length; indexGv++) {
        let KT = true;
        const giangvienHienTai = listTeacherNew[indexGv];
        const listTietHocGv = _.filter(jsonXAfterSort, {
          idgiangvien: giangvienHienTai.id
        });

        // const listTietThu2 = _.filter(listTietHocGv, { thu: 2 })
        // if (listTietThu2.length) {
        //   for (let indexTietThu2 = 0; indexTietThu2 < listTietThu2.length - 1; indexTietThu2++) {
        //     const tietDau = listTietThu2[indexTietThu2].tiet
        //     const tietSau = listTietThu2[indexTietThu2 + 1].tiet
        //     if (tietSau - tietDau !== 1) {
        //       KT = false
        //       KT_NGOAI = false
        //       break
        //     }
        //   }
        // }
        // const listTietThu3 = _.filter(listTietHocGv, { thu: 3 })
        // if (listTietThu3.length) {
        //   for (let indexTietThu3 = 0; indexTietThu3 < listTietThu3.length - 1; indexTietThu3++) {
        //     const tietDau = listTietThu3[indexTietThu3].tiet
        //     const tietSau = listTietThu3[indexTietThu3 + 1].tiet
        //     if (tietSau - tietDau !== 1) {
        //       KT = false
        //       KT_NGOAI = false
        //       break
        //     }
        //   }
        // }
        // const listTietThu4 = _.filter(listTietHocGv, { thu: 4 })
        // if (listTietThu4.length) {
        //   for (let indexTietThu4 = 0; indexTietThu4 < listTietThu4.length - 1; indexTietThu4++) {
        //     const tietDau = listTietThu4[indexTietThu4].tiet
        //     const tietSau = listTietThu4[indexTietThu4 + 1].tiet
        //     if (tietSau - tietDau !== 1) {
        //       KT = false
        //       KT_NGOAI = false
        //       break
        //     }
        //   }
        // }
        // const listTietThu5 = _.filter(listTietHocGv, { thu: 5 })
        // if (listTietThu5.length) {
        //   for (let indexTietThu5 = 0; indexTietThu5 < listTietThu5.length - 1; indexTietThu5++) {
        //     const tietDau = listTietThu5[indexTietThu5].tiet
        //     const tietSau = listTietThu5[indexTietThu5 + 1].tiet
        //     if (tietSau - tietDau !== 1) {
        //       KT = false
        //       KT_NGOAI = false
        //       break
        //     }
        //   }
        // }
        // const listTietThu6 = _.filter(listTietHocGv, { thu: 6 })
        // if (listTietThu6.length) {
        //   for (let indexTietThu6 = 0; indexTietThu6 < listTietThu6.length - 1; indexTietThu6++) {
        //     const tietDau = listTietThu6[indexTietThu6].tiet
        //     const tietSau = listTietThu6[indexTietThu6 + 1].tiet
        //     if (tietSau - tietDau !== 1) {
        //       KT = false
        //       KT_NGOAI = false
        //       break
        //     }
        //   }
        // }
        if (!KT) {
          break;
        }
      }

      if (KT_NGOAI) {
        listDung.push({ id: indexX });
      }
    }

    for (
      let indexListDung = 0;
      indexListDung < listDung.length;
      indexListDung++
    ) {
      const valueJson = JSON.parse(
        listLaiTao[listDung[indexListDung].id].value
      );
      let tongNgayLenTruongGv = 0;
      for (let indexgv = 0; indexgv < listTeacherNew.length; indexgv++) {
        const gvhientai = listTeacherNew[indexgv];
        tongNgayLenTruongGv += demNgayDayY(valueJson, gvhientai.id, 2);
        tongNgayLenTruongGv += demNgayDayY(valueJson, gvhientai.id, 3);
        tongNgayLenTruongGv += demNgayDayY(valueJson, gvhientai.id, 4);
        tongNgayLenTruongGv += demNgayDayY(valueJson, gvhientai.id, 5);
        tongNgayLenTruongGv += demNgayDayY(valueJson, gvhientai.id, 6);
      }
      listDung[indexListDung].tongngay = tongNgayLenTruongGv;
    }
    const listDungSort = _.sortBy(listDung, "tongngay");

    // Truncate x table
    await knex("xlaitao").truncate();
    let listPromise = [];
    for (
      let indexListDung = 0;
      indexListDung < listDungSort.length / 2;
      indexListDung++
    ) {
      const Xdung = listDungSort[indexListDung];
      listPromise.push(
        knex("xlaitao").insert({
          value: listLaiTao[Xdung.id].value,
          tongngay: Xdung.tongngay
        })
      );
    }

    const listThemVaoX = await Promise.all(listPromise);

    return res.json({ listThemVaoX });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
      data: error
    });
  }
});

const kiemTrarangbuocLaiTao = async () => {
  const [
    listTeacherNew,
    listClassNew,
    listSubjectNew,
    listPhanCongMonHoc,
    listLaiTao
  ] = await Promise.all([
    await knex("giangvien").select(),
    await knex("lop").select(),
    await knex("monhoc").select(),
    await knex("phanconggiangday").select(),
    await knex("xlaitao").select()
  ]);
  let listDung = [];
  for (let indexX = 0; indexX < listLaiTao.length; indexX++) {
    const jsonX = JSON.parse(listLaiTao[indexX].value);
    const jsonXAfterSort = _.sortBy(jsonX, ["thu", "tiet"]);
    let KT_NGOAI = true;

    for (let indexGv = 0; indexGv < listTeacherNew.length; indexGv++) {
      let KT = true;
      const giangvienHienTai = listTeacherNew[indexGv];
      const listTietHocGv = _.filter(jsonXAfterSort, {
        idgiangvien: giangvienHienTai.id
      });
      if (!KT) {
        break;
      }
    }

    if (KT_NGOAI) {
      listDung.push({ id: indexX });
    }
  }

  for (
    let indexListDung = 0;
    indexListDung < listDung.length;
    indexListDung++
  ) {
    const valueJson = JSON.parse(listLaiTao[listDung[indexListDung].id].value);
    let tongNgayLenTruongGv = 0;
    for (let indexgv = 0; indexgv < listTeacherNew.length; indexgv++) {
      const gvhientai = listTeacherNew[indexgv];
      tongNgayLenTruongGv += demNgayDayY(valueJson, gvhientai.id, 2);
      tongNgayLenTruongGv += demNgayDayY(valueJson, gvhientai.id, 3);
      tongNgayLenTruongGv += demNgayDayY(valueJson, gvhientai.id, 4);
      tongNgayLenTruongGv += demNgayDayY(valueJson, gvhientai.id, 5);
      tongNgayLenTruongGv += demNgayDayY(valueJson, gvhientai.id, 6);
    }
    listDung[indexListDung].tongngay = tongNgayLenTruongGv;
  }
  const listDungSort = _.sortBy(listDung, "tongngay");

  // Truncate x table
  await knex("xlaitao").truncate();
  let listPromise = [];
  for (
    let indexListDung = 0;
    indexListDung < listDungSort.length / 2;
    indexListDung++
  ) {
    const Xdung = listDungSort[indexListDung];
    listPromise.push(
      knex("xlaitao").insert({
        value: listLaiTao[Xdung.id].value,
        tongngay: Xdung.tongngay
      })
    );
  }

  const listThemVaoX = await Promise.all(listPromise);
  // console.log('========================================')
  // console.log('listThemVaoX laitao', listThemVaoX.length)
  // console.log('========================================')
  return listThemVaoX.length;
};

const taoTkbDotBien = async tkb => {
  const [
    listTeacherNew,
    listClassNew,
    listSubjectNew,
    listPhanCongMonHoc
  ] = await Promise.all([
    await knex("giangvien").select(),
    await knex("lop").select(),
    await knex("monhoc").select(),
    await knex("phanconggiangday").select()
  ]);
  const newTkb = tkb;

  // Lay random lich phan cong bat ki (P, C, S)
  const randomPSC =
    listPhanCongMonHoc[_.random(0, listPhanCongMonHoc.length - 1)];
  console.log("================================================");
  console.log("randomPSC", randomPSC);
  console.log("================================================");

  const lichPhanCongGiangDayHienTai = _.filter(tkb, {
    idmonhoc: randomPSC.idmonhoc,
    idgiangvien: randomPSC.idgiangvien,
    idlop: randomPSC.idlop
  });

  console.log("================================================");
  console.log("lichPhanCongGiangDayHienTai", lichPhanCongGiangDayHienTai);
  console.log("================================================");

  // Xoa lich day cu cua P, C , S
  for (
    let indexLichDay = 0;
    indexLichDay < lichPhanCongGiangDayHienTai.length;
    indexLichDay++
  ) {
    const indexCuaLichHoc = _.filter(tkb, {
      idmonhoc: lichPhanCongGiangDayHienTai[indexLichDay].idmonhoc,
      idgiangvien: lichPhanCongGiangDayHienTai[indexLichDay].idgiangvien,
      idlop: lichPhanCongGiangDayHienTai[indexLichDay].idlop
    }).length;
    tkb[indexCuaLichHoc] = 0;
  }

  console.log("================================================");
  console.log("Xoa thanh cong");
  console.log("================================================");
  // Them lich day moi vao thoi gian bat ki
  const soTinChiDaXepLich = _.filter(listSubjectNew, { id: randomPSC.idmonhoc })
    .length;
  const buoiHocCuaLop = _.filter(listClassNew, { id: randomPSC.idlop })[0]
    .buoihoc;
  for (let indexTinChi = 0; indexTinChi < soTinChiDaXepLich; indexTinChi++) {
    const randomThuHoc = _.random(2, 6);
    const randomTietHoc =
      buoiHocCuaLop === "s" ? _.random(1, 6) : _.random(7, 12);
    let KT = true;
    while (KT === true) {
      if (tkb[0] === 0) {
        tkb[0] === 1;
        KT = false;
      }
      KT = false;
    }
  }
  return newTkb;
};

app.get("/tkb/laitao", async (req, res) => {
  try {
    do {
      const [listX] = await Promise.all([await knex("xlaitao").select()]);

      // Xoa thong tin lai tao cu
      await knex("xlaitao").truncate();
      let listSauLaiTaoPromise = [];
      for (let indexX1 = 0; indexX1 < listX.length - 1; indexX1 += 2) {
        const x1 = JSON.parse(listX[indexX1].value);
        const sangX1 = _.filter(x1, tkb => {
          return tkb.tiet >= 1 && tkb.tiet <= 6;
        });
        const chieuX1 = _.filter(x1, tkb => {
          return tkb.tiet >= 7 && tkb.tiet <= 12;
        });
        const x2 = JSON.parse(listX[indexX1 + 1].value);
        const sangX2 = _.filter(x2, tkb => {
          return tkb.tiet >= 1 && tkb.tiet <= 6;
        });
        const chieuX2 = _.filter(x2, tkb => {
          return tkb.tiet >= 7 && tkb.tiet <= 12;
        });
        const xmoi3 = [...sangX1, ...chieuX2];
        const xmoi4 = [...sangX2, ...chieuX1];
        listSauLaiTaoPromise.push(
          knex("xlaitao").insert({ value: JSON.stringify(xmoi3) })
        );
        listSauLaiTaoPromise.push(
          knex("xlaitao").insert({ value: JSON.stringify(xmoi4) })
        );
      }
      const listSauLaiTaoThemThanhCong = await Promise.all(
        listSauLaiTaoPromise
      );
      // console.log('========================================')
      // console.log('listSauLaiTaoThemThanhCong =', listSauLaiTaoThemThanhCong.length)
      // console.log('========================================')
    } while ((await kiemTrarangbuocLaiTao()) !== 1);

    // Lay phan tu tkb de lai tao
    const layPhanTuDeTaoDotBien = await knex("xlaitao")
      .select()
      .first();

    // console.log('================================================')
    // console.log('layPhanTuDeTaoDotBien', layPhanTuDeTaoDotBien)
    // console.log('================================================')
    await taoTkbDotBien(JSON.stringify(layPhanTuDeTaoDotBien.value));

    await kiemTrarangbuocLaiTao();
    return res.json({ success: true });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
      data: error
    });
  }
});

var groupBy = function(xs, key) {
  return xs.reduce(function(rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
};

app.get("/tkb/khoa", async (req, res) => {
  try {
    const { idtkb = 1 } = req.query;
    const [
      listTeacherNew,
      listClassNew,
      listSubjectNew,
      listGiangDuong,
      listPhanCongGiangDay
    ] = await Promise.all([
      await knex("giangvien").select(),
      await knex("lophocphan").select(),
      await knex("monhoc").select(),
      await knex("giangduong").select(),
      await knex("phanconggiangday").select()
    ]);

    const tkb = await knex("xlaitao")
      .select()
      .where("id", idtkb)
      .first();

    const tkbCuoi = JSON.parse(tkb.value);
    console.log("========================================");
    console.log("xlaitao ", tkbCuoi.length);
    console.log("========================================");
    let danhsachDuocSapXep = _.sortBy(tkbCuoi, ["name"]);

    let tkbThemThongTin = [];
    for (let thongtin = 0; thongtin < danhsachDuocSapXep.length; thongtin++) {
      const thongtinhientai = danhsachDuocSapXep[thongtin];
      const thongtinGiangVien = _.filter(listTeacherNew, {
        id: thongtinhientai.idgiangvien
      })[0];
      const thongtinLop = _.filter(listClassNew, {
        id: thongtinhientai.idlophocphan
      })[0];
      const thongtinMonHoc = _.filter(listSubjectNew, {
        id: thongtinLop.idmonhoc
      })[0];
      const thongtinGiangDuong = _.filter(listGiangDuong, {
        id: thongtinhientai.idgiangduong
      })[0];
      tkbThemThongTin.push({
        ...thongtinhientai,
        thongtinGiangVien,
        thongtinLop,
        thongtinMonHoc,
        thongtinGiangDuong
      });
    }

    let resultList = [];
    var data = groupBy(tkbThemThongTin, "idlophocphan");
    _.forEach(data, function(value, key) {
      let tiet = "";
      let vlz = {};
      _.forEach(value, function(value2, key) {
        tiet += " " + value2.tiet;
        vlz = value2;
      });
      vlz.tiet = tiet;
      resultList.push(vlz);
    });
    resultList = _.sortBy(resultList, ["thongtinMonHoc.name"]);
    console.log(resultList);

    return res.render("tkb/tkb-khoa.html", {
      resultList
    });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
      data: error
    });
  }
});

app.get("/edit/:type/:id", async (req, res) => {
  try {
    const { type, id } = req.params;
    if (!id) {
      throw new Error("Không tìm thấy thông tin");
    }

    const dataEdit = await knex(type)
      .select()
      .where({ id })
      .first();
    const listTeacher = await knex("giangvien").select();
    const listHocPhan = await knex("lophocphan").select();
    const listSubject = await knex("monhoc").select();
    const listGiangDuong = await knex("giangduong").select();
    const listKyHoc = await knex("kyhoc").select();
    const listPhanCongGiangDay = await knex("phanconggiangday").select();
    //console.log(type);
    const template = `${type}/edit-${type}.html`;

    res.render(template, {
      dataEdit,
      listTeacher,
      listHocPhan,
      listSubject,
      listGiangDuong,
      listKyHoc,
      listPhanCongGiangDay
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
      data: error
    });
  }
});

app.post("/edit/:type/:id", async (req, res, next) => {
  try {
    const { type, id } = req.params;
    const {
      name,
      capbac,
      hocvi,
      malophocphan,
      sosinhvien,
      sochongoi,
      sotinchi,
      idmonhoc,
      idgiangvien,
      idlop,
      mamonhoc,
      toanha,
      tenphong,
      idkyhoc
    } = req.body;
    if (!id) {
      throw new Error("Không tìm thấy thông tin");
    }
    switch (type) {
      case "giangvien":
        if (!name) {
          throw new Error("Tên giảng viên là bắt buộc");
        }
        if (!capbac) {
          throw new Error("Tên cấp bậc là bắt buộc");
        }
        if (!hocvi) {
          throw new error("Tên học vị là bắt buộc");
        }
        await knex(type)
          .where({ id })
          .update({ name, capbac, hocvi });
        return res.redirect("/giangvien");
      case "monhoc":
        if (!name) {
          throw new Error("Tên môn học là bắt buộc");
        }
        if (!mamonhoc) {
          throw new Error("Mã môn học là bắt buộc");
        }
        if (!sotinchi) {
          throw new Error("Vui lòng chọn số tín chỉ");
        }
        await knex(type)
          .where({ id })
          .update({ name, sotinchi, mamonhoc });
        return res.redirect("/monhoc");
      case "phanconggiangday":
        if (!idmonhoc) {
          throw new Error("Tên môn học là bắt buộc");
        }
        if (!idgiangvien) {
          throw new Error("Vui lòng chọn giảng viên");
        }
        if (!idlop) {
          throw new Error("Vui lòng chọn lớp");
        }
        if (!idkyhoc) {
          throw new Error("Vui lòng chọn kỳ học");
        }
        await knex(type)
          .where({ id })
          .update({ idgiangvien, idlophocphan: idlop, idkyhoc });
        return res.redirect("/phanconggiangday");
      case "lophocphan":
        if (!malophocphan) {
          throw new Error("Mã lớp là bắt buộc");
        }
        if (!idmonhoc) {
          throw new Error("Môn học là bắt buộc");
        }
        if (!sosinhvien) {
          throw new Error("Số sinh viên là bắt buộc");
        }
        await knex(type)
          .where({ id })
          .update({ malophocphan, idmonhoc, sosinhvien });

        return res.redirect("/lophocphan");
      case "giangduong":
        if (!toanha) {
          throw new Error("Tòa nhà là bắt buộc");
        }
        if (!tenphong) {
          throw new Error("Tên phòng là bắt buộc");
        }
        if (!sochongoi) {
          throw new Error("Tên phòng là bắt buộc");
        }
        await knex(type)
          .where({ id })
          .update({ toanha, tenphong, sochongoi });
        return res.redirect("/giangduong");
      case "phanconggiangday":
        if (!idgiangvien) {
          throw new Error("Giảng viên là bắt buộc");
        }
        if (!idlophocphan) {
          throw new Error("Tên lớp là bắt buộc");
        }
        if (!idmonhoc) {
          throw new Error("Tên môn là bắt buộc");
        }
        await knex(type)
          .where({ id })
          .update({ idgiangvien, idlophocphan });
        return res.redirect("/phanconggiangduong");
      default:
        return res.redirect("/");
    }
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
      data: error
    });
  }
});

app.post("/giangvien", async (req, res, next) => {
  try {
    const { name, capbac, hocvi } = req.body;
    if (!name) {
      throw new Error("Tên giảng viên là bắt buộc");
    }
    const idRow = await knex("giangvien").insert({ name, capbac, hocvi });
    const infoGv = await knex("giangvien")
      .select()
      .where("id", idRow[0])
      .first();

    res.json({
      success: true,
      message: "Thêm giảng viên thành công",
      data: infoGv
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
      data: error
    });
  }
});

app.delete("/:type/:id", async (req, res, next) => {
  try {
    const { type, id } = req.params;
    if (!id) {
      throw new Error("Không tìm thấy thông tin");
    }
    await knex(type)
      .where({ id })
      .del();
    res.json({
      success: true,
      message: "Xoá thành công",
      data: { id }
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
      data: error
    });
  }
});

app.post("/monhoc", async (req, res, next) => {
  try {
    const { mamonhoc, name, sotinchi } = req.body;

    if (!name) {
      throw new Error("Tên môn học là bắt buộc");
    }
    if (!mamonhoc) {
      throw new Error("Mã môn học là bắt buộc");
    }
    if (!sotinchi) {
      throw new Error("Số tín chỉ là bắt buộc");
    }
    const listMonTheoMa = await knex("monhoc")
      .select()
      .where("mamonhoc", mamonhoc);
    if (listMonTheoMa.length) {
      throw new Error("Mã môn học đã tồn tại");
    }

    const idRow = await knex("monhoc").insert({ mamonhoc, name, sotinchi });
    const infoMh = await knex("monhoc")
      .select()
      .where("id", idRow[0])
      .first();

    res.json({
      success: true,
      message: "Thêm môn học thành công",
      data: infoMh
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
      data: error
    });
  }
});

app.post("/phanconggiangday", async (req, res, next) => {
  try {
    const { monhoc, giangvien, lophocphan, kyhoc } = req.body;

    if (!monhoc) {
      throw new Error("Môn học là bắt buộc");
    }
    if (!giangvien) {
      throw new Error("Giảng viên là bắt buộc");
    }
    if (!lophocphan) {
      throw new Error("Lớp là bắt buộc");
    }
    if (!kyhoc) {
      throw new Error("kỳ học là bắt buộc");
    }
    const idRow = await knex("phanconggiangday").insert({
      idgiangvien: giangvien,
      idlophocphan: lophocphan,
      idkyhoc: kyhoc
    });
    const infoPCMH = await knex("phanconggiangday")
      .select()
      .where("id", idRow[0])
      .first();

    res.json({
      success: true,
      message: "Thêm phân công giảng dạy thành công",
      data: infoPCMH
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
      data: error
    });
  }
});

app.post("/phanconggiangday2", async (req, res, next) => {
  try {
    const { idMonHoc, giangvien, lop } = req.body;

    if (!idMonHoc) {
      throw new Error("Môn học là bắt buộc");
    }
    if (!giangvien) {
      throw new Error("Giảng viên là bắt buộc");
    }
    if (!lop) {
      throw new Error("Lớp là bắt buộc");
    }

    const idRow = await knex("phanconggiangday2").insert({
      idmonhoc: idMonHoc,
      idgiangvien: giangvien,
      idlop: lop
    });
    const infoPCMH = await knex("phanconggiangday2")
      .select()
      .where("id", idRow[0])
      .first();

    res.json({
      success: true,
      message: "Thêm phân công giảng dạy thành công",
      data: infoPCMH
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
      data: error
    });
  }
});
app.post("/lophocphan", async (req, res, next) => {
  try {
    const { monhoc, maLopHocPhan, sosinhvien, kyhoc } = req.body;
    if (!monhoc) {
      throw new Error("Môn học là bắt buộc");
    }
    if (!maLopHocPhan) {
      throw new Error("Tên lớp là bắt buộc");
    }
    if (!sosinhvien) {
      throw new Error("Số sinh viên là bắt buộc");
    }
    const listHocPhan = await knex("lophocphan")
      .select()
      .where("malophocphan", maLopHocPhan);

    if (listHocPhan.length) {
      return res.json({
        success: false,
        message: "Đã tồn tại"
      });
    }
    const idRow = await knex("lophocphan").insert({
      maLopHocPhan,
      idmonhoc: monhoc,
      sosinhvien
    });
    const infoLopHP = await knex("lophocphan")
      .select()
      .where("id", idRow[0])
      .first();

    res.json({
      success: true,
      message: "Thêm lớp thành công",
      data: infoLopHP
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
      data: error
    });
  }
});
app.post("/giangduong", async (req, res, next) => {
  try {
    const { toanha, tenphong } = req.body;

    if (!toanha) {
      throw new Error("Tên tòa nhà là bắt buộc");
    }
    if (!tenphong) {
      throw new Error("Phòng học là bắt buộc");
    }

    const idRow = await knex("giangduong").insert({ toanha, tenphong });
    const infoLop = await knex("giangduong")
      .select()
      .where("id", idRow[0])
      .first();
    res.json({
      success: true,
      message: "Thêm giảng đường thành công",
      data: infoLop
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
      data: error
    });
  }
});

// Login
app.get("/account/login", async (req, res) => {
  if (req.session.loggedin) {
    return res.render("home/home.html");
  } else {
    return res.render("account/login.html");
  }
});

app.post("/account/login", async (req, res, next) => {
  try {
    //console.log("Login");
    var logins = await knex("account").select();
    var user;
    for (let index = 0; index < logins.length; index++) {
      if (
        logins[index].username == req.body.username &&
        logins[index].password == req.body.password
      ) {
        user = logins[index];
      }
    }
    //console.log(user);
    if (user.username) {
      req.session.loggedin = true;
      req.session.username = user.username;
      return res.redirect("/");
    } else {
      return res.redirect("/account/login");
    }
    //res.end();
  } catch (error) {
    return res.redirect("/account/login");
  }
});
app.get("/account/logout", function(req, res) {
  req.session.destroy();
  return res.redirect("/account/login");
});

module.exports = app;
