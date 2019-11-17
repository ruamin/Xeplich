const path = require("path");
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

var sess; // global session, NOT recommended

function checkSession() {
  if (sess != undefined) {
    return true;
  } else {
    return false;
  }
}

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
function giangBuocHC1(tkb, idgiangvien, idmonhoc, thu, tiet) {
  const result = _.filter(tkb, { idgiangvien, idmonhoc, thu, tiet });
  if (result.length >= 2) {
    console.log("Loi giang buoc 1");
    return false;
  }
  return true;
}
//  Không lớp nào phải học 2 môn trong cùng 1 thời gian
function giangBuocHC2(tkb, idlop, thu, tiet) {
  const result = _.filter(tkb, { idlop, thu, tiet });
  if (result.length >= 2) {
    console.log("Loi giang buoc 2");
    return false;
  }
  return true;
}
// Giảng viên phải dạy đúng lớp và đúng môn học được giao
function giangBuocHC3(tkb, A, idgiangvien, idmonhoc, idlop, thu, tiet) {
  const resultTkb = _.filter(tkb, { idgiangvien, idmonhoc, idlop, thu, tiet });
  const lopPhanCong = _.filter(A, {
    idgiangvien,
    idmonhoc,
    idlop,
    duocdaylop: 0
  }); // dc day
  if (lopPhanCong[0].duocdaylop * resultTkb[0].duocdayloptaitiet === 0) {
    return true;
  }
  return false;
}
// Mỗi giảng viên dạy 1 môn nào đó phải đủ số lớp theo phân công
function giangBuocHC4(tkb, monhoc, A, idgiangvien, idmonhoc) {
  const resultTkb = _.filter(tkb, { idgiangvien, idmonhoc });
  const filterMon = _.filter(monhoc, { id: idmonhoc })[0];
  const resultA = _.filter(A, { idgiangvien, idmonhoc, duocdaylop: 0 });
  if (resultTkb.length / filterMon.sotinchi === resultA.length) {
    return true;
  }
  console.log("Loi giang buoc 4");
  return false;
}
// Mỗi giảng viên phải dạy đủ số môn
function giangBuocHC5(tkb, monhoc, A, idgiangvien, idmonhoc) {
  const resultAGvDuocDayMonHoc = _.filter(A, {
    idgiangvien,
    idmonhoc,
    duocdaylop: 0
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
// Các lớp học đúng thời gian được phân công
function giangBuocHC6(tkb, A, idgiangvien, idmonhoc, idlop, thu, tiet, monhoc) {
  const resultTkbGvDayMonTaiThuTiet = _.filter(tkb, {
    idgiangvien,
    idmonhoc,
    idlop,
    thu,
    tiet
  });
  const lopPhanCongCuaDv = _.filter(A, {
    idgiangvien,
    idmonhoc,
    idlop,
    duocdaylop: 0
  });
  const filterMonHoc = _.filter(monhoc, { id: idmonhoc })[0];
  if (
    lopPhanCongCuaDv[0].duocdaylop *
      resultTkbGvDayMonTaiThuTiet[0].duocdayloptaitiet ===
      0 ||
    filterMonHoc.length
  ) {
    return true;
  }
  return false;
}
function giangBuocMem(tkb, monhoc, A, idgiangvien, idmonhoc) {
  const resultTkbGvMon = _.filter(tkb, { idgiangvien, idmonhoc });
  const filterMonGBM = _.filter(monhoc, { id: idmonhoc });
  const resultAGBM = _.filter(A, { idgiangvien, idmonhoc, duocdaylop: 0 });
  if (resultTkbGvMon.length / filterMonGBM[0].sotinchi === resultAGBM.length) {
    return true;
  }
  console.log("Loi giang buoc mem");
  return false;
}
function kiemTra(arrayX, A, monhoc, listTkbOke = []) {
  for (let index = 0; index < arrayX.length; index++) {
    const tkb = arrayX[index];
    let KT = true;
    for (let indexTkb = 0; indexTkb < tkb.length; indexTkb++) {
      const { idgiangvien, idmonhoc, idlop, thu, tiet } = tkb[indexTkb];
      if (
        giangBuocHC1(tkb, idgiangvien, idmonhoc, thu, tiet) === false ||
        giangBuocHC2(tkb, idlop, thu, tiet) === false ||
        giangBuocHC3(tkb, A, idgiangvien, idmonhoc, idlop, thu, tiet) ===
          false ||
        giangBuocHC4(tkb, monhoc, A, idgiangvien, idmonhoc) === false ||
        giangBuocHC5(tkb, monhoc, A, idgiangvien, idmonhoc) === false ||
        giangBuocHC6() === false
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
        listPhanCongGiangDay
      ] = await Promise.all([
        await knex("giangvien").select(),
        await knex("lophocphan").select(),
        await knex("monhoc").select(),
        await knex("phanconggiangday").select()
      ]);
      for (let index = 0; index < listPhanCongGiangDay.length; index++) {
        const giangVien = _.filter(listTeacherGiangDay, {
          id: listPhanCongGiangDay[index].idgiangvien
        });
        const lopHoc = _.filter(listClassGiangDay, {
          id: listPhanCongGiangDay[index].idlophocphan
        }); 
       
        const monHoc = _.filter(listSubjectGiangDay, { id: lopHoc[0].idmonhoc });
      
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
          id: listPhanCongGiangDay[index].idlop
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

app.get("/tkb/sinhtkb", async (req, res) => {
  let [
    listTeacherNew,
    listHPNew,
    listRoomNew,
    listPhanCongGiangDayNew
  ] = await Promise.all([
    await knex("giangvien").select(),
    await knex("lophocphan").select(),
    await knex("monhoc").select(),
    await knex("phanconggiangday").select()
  ]);

  const danhSachThuHoc = [2, 3, 4, 5, 6];
  const danhTietHocTrongNgay = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  // Tao mang A phan cong mon hoc: { idgiangvien: 2, idmonhoc: 2, idlop: 2, duocdaylop: 0 }
  const A = [];
  listTeacherNew.map((giangvien)=> {
    listHPNew.map((lophocphan)=> {
      const filter = {
        idlophocphan:lophocphan.id,
        idgiangvien:giangvien.id,
      };
      const phancong=_.filter(listPhanCongGiangDayNew, filter);
      if(phancong.length){
        A.push({...filter, cannotTeach:0});//duoc day lop nay
      }
      else {
        A.push({...filter, cannotTeach:1});
      }
    });
  });
  console.log({A});
  
  const L = [];
  // Tao mang L thời gian có thể học của lớp: { idlop: 2,phong: 1, thu: 2, tiet: 1, duocdaytiet: 0 }

  listHPNew.map((lophocphan) => {
    listRoomNew.map((giangduong)=>{
      danhSachThuHoc.map((thu)=>{
        danhTietHocTrongNgay.map((tiet)=>{
          L.push({idlophocphan:lophocphan.id, thu, tiet, idgiangduong:giangduong.id})
        });
      });
    });
  });
  console.log(L);
  // for (let lop = 0; lop < listClassNew.length; lop++) {
  //   for (let thuhoc = 0; thuhoc < danhSachThuHoc.length; thuhoc++) {
  //     for (let tiethoc = 0; tiethoc < danhTietHocTrongNgay.length; tiethoc++) {
  //       if (listClassNew[lop].buoihoc === "s") {
  //         if (
  //           danhTietHocTrongNgay[tiethoc] >= 1 &&
  //           danhTietHocTrongNgay[tiethoc] <= 6
  //         ) {
  //           L.push({
  //             idlop: listClassNew[lop].id,
  //             thu: danhSachThuHoc[thuhoc],
  //             tiet: danhTietHocTrongNgay[tiethoc],
  //             buoihoc: "s",
  //             duocdaytiet: 0 // 0 là được dạy tiết này
  //           });
  //         } else {
  //           L.push({
  //             idlop: listClassNew[lop].id,
  //             thu: danhSachThuHoc[thuhoc],
  //             tiet: danhTietHocTrongNgay[tiethoc],
  //             buoihoc: "s",
  //             duocdaytiet: 1 // 1 là không được dạy tiết này
  //           });
  //         }
  //       } else {
  //         if (
  //           danhTietHocTrongNgay[tiethoc] >= 1 &&
  //           danhTietHocTrongNgay[tiethoc] <= 6
  //         ) {
  //           L.push({
  //             idlop: listClassNew[lop].id,
  //             thu: danhSachThuHoc[thuhoc],
  //             tiet: danhTietHocTrongNgay[tiethoc],
  //             buoihoc: "c",
  //             duocdaytiet: 1 // 1 là không được dạy tiết này
  //           });
  //         } else {
  //           L.push({
  //             idlop: listClassNew[lop].id,
  //             thu: danhSachThuHoc[thuhoc],
  //             tiet: danhTietHocTrongNgay[tiethoc],
  //             buoihoc: "c",
  //             duocdaytiet: 0 // 0 là được dạy tiết này
  //           });
  //         }
  //       }
  //     }
  //   }
  // }

  // Tạo mảng X biểu diễn khả năng giảng viên P được dạy môn S lớp C thứ D tiết T phong r
  // A - { idgiangvien: 2, idmonhoc: 2, idlop: 2, duocdaylop: 1 } L - { idlop: 2, phong : 1, thu: 2, tiet: 1, duocdaytiet: 0 }
  const X = [];
  A.map((phancong) => {
  const listlop = _.filter(L, {idlophocphan: A.idlophocphan});
  listlop.map((ll) => {
    const x= {
      ...phancong,
      ...ll,
      canTeach: 0,
    };
    delete x.cannotTeach;
    X.push(x);
  });
});
console.log(X);
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
  //listTeacherNew = _.shuffle(listTeacherNew);
  //main process
  var lastRoomAssigment={};
  listTeacherNew.map((giangvien)=>{
    const pcgdcuagiaovien=_.filter(A, {idgiangvien:giangvien.id, cannotTeach:0});
    listHPNew.map((lophocphan)=>{
      const pcdaylop =_.filter(pcgdcuagiaovien, {idlophocphan:lophocphan.id});
      if (pcdaylop.length){
        let soTinChiCuaMon=0;
        let kt=true;
        pcdaylop.map((L)=>{
          soTinChiCuaMon=0;
          for(const giangduong of listRoomNew){
            if(!kt){
              kt=true;//da xếp lịch thành công cho lớp học phần 
              break;
            }
             lastRoomAssigment=lastRoomAssigment[giangduong.id]||{thu:2, tiet:1};
            if(
              lastRoomAssigment.thu===6&&
              12-lastRoomAssigment.tiet<lophocphan.sotinchi
            ){
              continue;
            }
            for(const thu of danhSachThuHoc ){
              if(!kt){
                break;
              }
              const soTietLopHocTrongNgay = _.filter(X, {
                canTeach: 1,
                idlophocphan: L.idlophocphan,
                thu,
                idgiangduong: giangduong.id,
              }); // tim het tat ca cac tiet lop hoc phan da hoc
    
              const soTietGVDayTrongNgay=_.filter(X,{
                canTeach:1,
                idlophocphan:L.idlophocphan,
                thu,
                idgiangduong:giangduong.id,
                idgiangvien:giangvien.id
              });// tim hết tất cả các tiest giảng viên đã dạy
              const tietCuoiCungDay=soTietGVDayTrongNgay.length
              ? soTietGVDayTrongNgay[soTietGVDayTrongNgay.length-1].tiet
            :0; //tiết cuối cùng giảng viên dạy trong ngày
            const tietCuoiCungHoc=soTietLopHocTrongNgay.length?soTietLopHocTrongNgay[soTietLopHocTrongNgay-1].tiet:0;
            //tiết cuối cùng lớp học phần học trong ngày
            const soTietConLaiTrongBuoiCuaGV = 12-tietCuoiCungDay; //số tiết giảng viên có thể dạy tiếp
            const soTietConLaiLopHocTrongBuoi = 12-tietCuoiCungHoc;//số tiết lớp có thể học đc tiếp
            let tietCuoiCung=0;
            if(
              12-soTietLopHocTrongNgay.length>=lophocphan.sotinchi&&
              12-soTietLopHocTrongNgay.length>= lophocphan.sotinchi&&
              soTietConLaiTrongBuoiCuaGV>lophocphan.sotinchi&&
              soTietConLaiLopHocTrongBuoi>=lophocphan.sotinchi
            ){
              for (const tiet of danhTietHocTrongNgay){
                if (soTinChiCuaMon>=lophocphan.sotinchi){
                  kt=false;
                  break;//da xếp lịch xong cho lớp học phần
                }
                //HC1
                const gvCoTheDay =_.filter(X, {
                  canTeach:1,
                  thu,
                  tiet,
                  idgiangvien:giangduong.id,
                  idgiangvien:giangvien.id,
                });
                if(gvCoTheDay.length){
                  tietCuoiCung=gvCoTheDay[0].tiet;

                }
                else{
                  const soTietConLaiSang=6-tietCuoiCung;
                  if(tiet<=6&& soTietConLaiSang>lophocphan.sotinchi){
                    continue;
                  }
                  //HC2
                  const lopCoTheDay=_.filter(X,{
                    canTeach:1,
                    idlophocphan:lophocphan.id,
                    thu,
                    tiet,
                    idgiangduong:giangduong.id,

                  });
                  if(!lopCoTheDay.length)
                  {
                    const tietCoTheDay=_.filter(L,{
                      cannotTeach:0,
                      idlophocphan:lophocphan.id,
                      thu,
                      tiet,
                      idgiangduong:giangduong.id,
                    });
                    // xep lich
                    const Xpsctd = _.filter(X, {
                      canTeach: 0,
                      idlophocphan: lophocphan.id,
                      thu,
                      tiet,
                      idgiangduong:giangduong.id,
                      idgiangvien:giangvien.id,
                    }); // co phai la chua day khong?
                    if(Xpsctd.lenght){
                      //neu chua day
                      const tietDau=Xpsctd[0];
                      const indexOfXpsctd=_.filter(X,tietDau);
                      X[indexOfXpsctd]={
                        ...filter,
                        canTeach:1,
                      };
                      dem+=1;
                      soTinChiCuaMon+=1;
                      lastRoomAssigment[giangduong.id]={thu,tiet};
                      console.log('add to X',dem);
                    }
                  }
                }
              }
            }

          }
          }
        });
      }
    })
   });
  // for (let indexGV = 0; indexGV < listTeacherNew.length; indexGV++) {
  //   const phanCongGiangDayCuaGvHienTai = _.filter(A, {
  //     idgiangvien: listTeacherNew[indexGV].id,
  //     duocdaylop: 0
  //   });
  //   for (let indexLop = 0; indexLop < listClassNew.length; indexLop++) {
  //     const dsMonHocCuaGvTaiLopHienTai = _.filter(
  //       phanCongGiangDayCuaGvHienTai,
  //       { idlop: listClassNew[indexLop].id }
  //     );

  //     if (dsMonHocCuaGvTaiLopHienTai.length) {
  //       let soTinChiCuaMon = 0;
  //       let KT = true;

  //       for (
  //         let indexMon = 0;
  //         indexMon < dsMonHocCuaGvTaiLopHienTai.length;
  //         indexMon++
  //       ) {
  //         const monHoc = dsMonHocCuaGvTaiLopHienTai[indexMon];
  //         const thongTinMonHoc = _.filter(listSubjectNew, {
  //           id: monHoc.idmonhoc
  //         })[0];
  //         soTinChiCuaMon = 0;

  //         for (let indexThu = 0; indexThu < danhSachThuHoc.length; indexThu++) {
  //           if (!KT) {
  //             KT = true;
  //             break;
  //           }
  //           const thuHoc = danhSachThuHoc[indexThu];

  //           const filterSoTietLopDaHocTheoBuoi = _.filter(X, {
  //             idlop: listClassNew[indexLop].id,
  //             buoihoc: listClassNew[indexLop].buoihoc,
  //             thu: thuHoc,
  //             duocdayloptaitiet: 1
  //           });

  //           const filterSoTietGvDaDayTheoBuoi = _.filter(X, {
  //             idgiangvien: listTeacherNew[indexGV].id,
  //             buoihoc: listClassNew[indexLop].buoihoc,
  //             thu: thuHoc,
  //             duocdayloptaitiet: 1
  //           });
  //           const tietCuoiCungGiangVienDay = filterSoTietGvDaDayTheoBuoi.length
  //             ? filterSoTietGvDaDayTheoBuoi[
  //                 filterSoTietGvDaDayTheoBuoi.length - 1
  //               ].tiet
  //             : 0;
  //           const soTietConLaiTrongBuoiCuaGiangVien =
  //             listClassNew[indexLop].buoihoc === "s"
  //               ? 6 - tietCuoiCungGiangVienDay
  //               : 12 - tietCuoiCungGiangVienDay;
  //           if (
  //             6 - filterSoTietLopDaHocTheoBuoi.length >=
  //               thongTinMonHoc.sotinchi &&
  //             6 - filterSoTietGvDaDayTheoBuoi.length >=
  //               thongTinMonHoc.sotinchi &&
  //             soTietConLaiTrongBuoiCuaGiangVien >= thongTinMonHoc.sotinchi &&
  //             6 -
  //               (filterSoTietLopDaHocTheoBuoi.length
  //                 ? filterSoTietLopDaHocTheoBuoi[
  //                     filterSoTietLopDaHocTheoBuoi.length - 1
  //                   ].tiet
  //                 : 0) >=
  //               thongTinMonHoc.sotinchi
  //           ) {
  //             for (
  //               let indexTiet = 0;
  //               indexTiet < danhTietHocTrongNgay.length;
  //               indexTiet++
  //             ) {
  //               if (soTinChiCuaMon >= thongTinMonHoc.sotinchi) {
  //                 KT = false;
  //                 break;
  //               }
  //               const tietHoc = danhTietHocTrongNgay[indexTiet];

  //               // HC1
  //               const kiemTraXemGvDoTaiThuDoTietDoDaDayLopNaoChua = _.filter(
  //                 X,
  //                 {
  //                   idgiangvien: listTeacherNew[indexGV].id,
  //                   thu: thuHoc,
  //                   tiet: tietHoc,
  //                   duocdayloptaitiet: 1
  //                 }
  //               );
  //               if (!kiemTraXemGvDoTaiThuDoTietDoDaDayLopNaoChua.length) {
  //                 // HC2
  //                 const kiemTraXemLopDoTaiThuDoTietDoDaHocMonNaoChua = _.filter(
  //                   X,
  //                   {
  //                     idlop: listClassNew[indexLop].id,
  //                     thu: thuHoc,
  //                     tiet: tietHoc,
  //                     duocdayloptaitiet: 1
  //                   }
  //                 );

  //                 if (!kiemTraXemLopDoTaiThuDoTietDoDaHocMonNaoChua.length) {
  //                   const kiemTraThuVaTietCoDuocHocKhong = _.filter(L, {
  //                     idlop: listClassNew[indexLop].id,
  //                     thu: thuHoc,
  //                     tiet: tietHoc,
  //                     duocdaytiet: 0
  //                   });
  //                   if (kiemTraThuVaTietCoDuocHocKhong.length) {
  //                     const filterX = {
  //                       idgiangvien: listTeacherNew[indexGV].id,
  //                       idmonhoc: monHoc.idmonhoc,
  //                       idlop: listClassNew[indexLop].id,
  //                       thu: thuHoc,
  //                       tiet: tietHoc,
  //                       duocdayloptaitiet: 0
  //                     };

  //                     const Xpsctd = _.filter(X, filterX);

  //                     if (Xpsctd.length) {
  //                       const indexOfXpsctd = X.indexOf(Xpsctd[0]);
  //                       X[indexOfXpsctd] = {
  //                         ...Xpsctd[0],
  //                         duocdayloptaitiet: 1
  //                       };
  //                       dem += 1;
  //                       soTinChiCuaMon += 1;
  //                       console.log("Da them vao X ", dem);
  //                     }
  //                   }
  //                 }
  //               }
  //             }
  //           }
  //         }
  //       }
  //     }
  //   }
  // }

  const XCuoiCung = _.filter(X, { canTeach: 1 });
  console.log({XCuoiCung});
  
  // const listDone = await knex("xrandom").insert({
  //   value: JSON.stringify(XCuoiCung)
  // });
  // console.log("================================================");
  // console.log("Tkb Da themmmmmmmmm: =======: ", listDone);
  // console.log("================================================");
  // return res.redirect("/tkb/sinhtkb");
});

app.get("/tkb/giangvien", async (req, res) => {
  try {
    const { giangvien = 1, idtkb = 1 } = req.query;
    const [listTeacherNew, listClassNew, listSubjectNew] = await Promise.all([
      await knex("giangvien").select(),
      await knex("lop").select(),
      await knex("monhoc").select()
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
      const thongtinLop = _.filter(listClassNew, {
        id: thongtinhientai.idlop
      })[0];
      const thongtinMonHoc = _.filter(listSubjectNew, {
        id: thongtinhientai.idmonhoc
      })[0];
      tkbThemThongTin.push({
        ...thongtinhientai,
        thongtinGiangVien,
        thongtinLop,
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
      return res.render("tkb/tkb.html", {
        danhSachTkb,
        listTeacherNew,
        giangvien: thongTinGiangVien,
        idtkb
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

app.get("/tkb/giangbuoc", async (req, res) => {
  try {
    const [
      listTeacherNew,
      listClassNew,
      listSubjectNew,
      listPhanCongMonHoc,
      listRandomX
    ] = await Promise.all([
      await knex("giangvien").select(),
      await knex("lop").select(),
      await knex("monhoc").select(),
      await knex("phanconggiangday").select(),
      await knex("xrandom").select()
    ]);
    let listDung = [];
    for (let indexX = 0; indexX < listRandomX.length; indexX++) {
      const jsonX = JSON.parse(listRandomX[indexX].value);
      const jsonXAfterSort = _.sortBy(jsonX, ["thu", "tiet"]);
      let KT_NGOAI = true;

      // for (let indexGv = 0; indexGv < listTeacherNew.length; indexGv++) {
      //   let KT = true
      //   const giangvienHienTai = listTeacherNew[indexGv]
      //   const listTietHocGv = _.filter(jsonXAfterSort, { idgiangvien: giangvienHienTai.id })

      //   if (!KT) {
      //     break
      //   }
      // }

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

    return res.json({ listThemVaoX });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
      data: error
    });
  }
});

app.get("/tkb/giangbuoc/laitao", async (req, res) => {
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

const kiemTraGiangBuocLaiTao = async () => {
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
  const soTinChiCuaMon = _.filter(listSubjectNew, { id: randomPSC.idmonhoc })
    .length;
  const buoiHocCuaLop = _.filter(listClassNew, { id: randomPSC.idlop })[0]
    .buoihoc;
  for (let indexTinChi = 0; indexTinChi < soTinChiCuaMon; indexTinChi++) {
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
    } while ((await kiemTraGiangBuocLaiTao()) !== 1);

    // Lay phan tu tkb de lai tao
    const layPhanTuDeTaoDotBien = await knex("xlaitao")
      .select()
      .first();

    // console.log('================================================')
    // console.log('layPhanTuDeTaoDotBien', layPhanTuDeTaoDotBien)
    // console.log('================================================')
    await taoTkbDotBien(JSON.stringify(layPhanTuDeTaoDotBien.value));

    await kiemTraGiangBuocLaiTao();
    return res.json({ success: true });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
      data: error
    });
  }
});

app.get("/tkb/lop", async (req, res) => {
  try {
    const { lop = 1, idtkb = 1 } = req.query;
    const [
      listTeacherNew,
      listClassNew,
      listSubjectNew,
      listPhanCongGiangDay
    ] = await Promise.all([
      await knex("giangvien").select(),
      await knex("lop").select(),
      await knex("monhoc").select(),
      await knex("phanconggiangday").select()
    ]);

    const tkb = await knex("xlaitao")
      .select()
      .where("id", idtkb)
      .first();
    console.log("========================================");
    console.log("xlaitao ", tkb.length);
    console.log("========================================");

    const tkbCuoi = JSON.parse(tkb.value);
    let danhsachDuocSapXep = _.sortBy(tkbCuoi, ["thu", "tiet"]);

    let tkbThemThongTin = [];
    for (let thongtin = 0; thongtin < danhsachDuocSapXep.length; thongtin++) {
      const thongtinhientai = danhsachDuocSapXep[thongtin];
      const thongtinGiangVien = _.filter(listTeacherNew, {
        id: thongtinhientai.idgiangvien
      })[0];
      const thongtinLop = _.filter(listClassNew, {
        id: thongtinhientai.idlop
      })[0];
      const thongtinMonHoc = _.filter(listSubjectNew, {
        id: thongtinhientai.idmonhoc
      })[0];
      tkbThemThongTin.push({
        ...thongtinhientai,
        thongtinGiangVien,
        thongtinLop,
        thongtinMonHoc
      });
    }

    let thongTinLop;
    if (lop) {
      tkbThemThongTin = _.filter(tkbThemThongTin, { idlop: parseInt(lop) });
      // console.log('========================================')
      // console.log('tkbThemThongTin ', tkbThemThongTin)
      // console.log('========================================')
      thongTinLop = _.filter(listClassNew, { id: parseInt(lop) })[0];
      const danhSachMonHocCuaLop = _.filter(listPhanCongGiangDay, {
        idlop: thongTinLop.id
      });
      const danhSachTkb = [];
      for (
        let indexMonHoc = 0;
        indexMonHoc < danhSachMonHocCuaLop.length;
        indexMonHoc++
      ) {
        const monHocHienTai = danhSachMonHocCuaLop[indexMonHoc];

        const thongTinTietHocCuaMonHienTai = _.filter(tkbThemThongTin, {
          idmonhoc: monHocHienTai.idmonhoc
        });
        if (thongTinTietHocCuaMonHienTai.length) {
          // console.log('========================================')
          // console.log('thongTinTietHocCuaMonHienTai ', thongTinTietHocCuaMonHienTai)
          // console.log('========================================')
          const thuHocHienTai = thongTinTietHocCuaMonHienTai[0].thu;
          let tietHocHienTai = thongTinTietHocCuaMonHienTai[0].tiet;
          for (
            let indexTietMon = 1;
            indexTietMon < thongTinTietHocCuaMonHienTai.length;
            indexTietMon++
          ) {
            const thongTinTietHoc = thongTinTietHocCuaMonHienTai[indexTietMon];
            tietHocHienTai = `${tietHocHienTai}.${thongTinTietHoc.tiet}`;
          }
          danhSachTkb.push({
            stt: indexMonHoc + 1,
            thongtinGiangVien:
              thongTinTietHocCuaMonHienTai[0].thongtinGiangVien,
            thongtinLop: thongTinTietHocCuaMonHienTai[0].thongtinLop,
            thongtinMonHoc: thongTinTietHocCuaMonHienTai[0].thongtinMonHoc,
            thuHocHienTai,
            tietHocHienTai
          });
        }
      }

      return res.render("tkb/tkb-lop.html", {
        danhSachTkb,
        listClassNew,
        lop: thongTinLop,
        idtkb
      });
    }
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
    const listGiangDuong= await knex("giangduong").select();
    const listKyHoc= await knex("kyhoc").select();   
    console.log(type)
    const template = `${type}/edit-${type}.html`;
    
    
    res.render(template, {
      dataEdit,
      listTeacher,
      listHocPhan,
      listSubject,
      listGiangDuong,
      listKyHoc
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
      sotinchi,
      idmonhoc,
      idgiangvien,
      idlop,
      mamonhoc,
      toanha, 
      tenphong, 
      idkyhoc,
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
        if(!hocvi)
        {
          throw new error("Tên học vị là bắt buộc")
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
        await knex(type)
          .where({ id })
          .update({ idgiangvien, idlophocphan: idlop });
        return res.redirect("/phanconggiangday");
      case "lophocphan":
        if (!malophocphan) {
          throw new Error("Mã lớp là bắt buộc");
        }
        if (!idmonhoc) {
          throw new Error("Môn học là bắt buộc");
        }
        if (!idkyhoc) {
          throw new Error("Kỳ học là bắt buộc");
        }
        await knex(type)
          .where({ id })
          .update({ malophocphan, idmonhoc, idkyhoc });



        return res.redirect("/lophocphan");
        case "giangduong":
          if (!toanha) {
            throw new Error("Tòa nhà là bắt buộc");
          }
          if (!tenphong) {
            throw new Error("Tên phòng là bắt buộc");
          }
          await knex(type)
            .where({ id })
            .update({ toanha, tenphong });
          return res.redirect("/giangduong");
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
    const { monhoc, giangvien, lophocphan } = req.body;

      if (!monhoc) { throw new Error('Môn học là bắt buộc') }
    if (!giangvien) {
      throw new Error("Giảng viên là bắt buộc");
    }
    if (!lophocphan) {
      throw new Error("Lớp là bắt buộc");
    }

    const idRow = await knex("phanconggiangday").insert({
      idgiangvien: giangvien,
      idlophocphan: lophocphan
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

app.post("/lop", async (req, res, next) => {
  try {
    const { name, khoahoc, buoihoc } = req.body;

    if (!name) {
      throw new Error("Tên lớp là bắt buộc");
    }
    if (!khoahoc) {
      throw new Error("Khoá học là bắt buộc");
    }
    if (!buoihoc) {
      throw new Error("Buổi học là bắt buộc");
    }

    const idRow = await knex("lop").insert({ name, khoahoc, buoihoc });
    const infoLop = await knex("lop")
      .select()
      .where("id", idRow[0])
      .first();

    res.json({
      success: true,
      message: "Thêm lớp thành công",
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
app.post("/lophocphan", async (req, res, next) => {
  try {
    const { monhoc, maLopHocPhan, kyhoc } = req.body;
    if (!monhoc) {
      throw new Error("Môn học là bắt buộc");
    }
    if (!maLopHocPhan) {
      throw new Error("Tên lớp là bắt buộc");
    }
    if (!kyhoc) {
      throw new Error("Môn học là bắt buộc");
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
  const idRow = await knex("lophocphan").insert({ maLopHocPhan, idmonhoc:monhoc, idkyhoc:kyhoc });
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
