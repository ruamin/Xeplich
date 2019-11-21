(function(cbFn) {
  cbFn(window.jQuery, window);
})(function cbFn($, window) {
  $(pageHomeReady);

  function pageHomeReady() {
    $("select").formSelect();

    var $formAddGv = $("#form-add-gv");
    var $formAddLop = $("#form-add-lop");
    var $formAddMh = $("#form-add-mh");
    var $formAddPCGD = $("#form-add-phanconggiangday");
    var $formAddLHP = $("#form-add-lhp");
    var $formAddGD = $("#form-add-gd");

    $formAddGv.on("submit", handleAddGv);
    $formAddLop.on("submit", handleAddLop);
    $formAddMh.on("submit", handleAddMh);
    $formAddPCGD.on("submit", handleAddPCGD);
    $formAddLHP.on("submit", handleAddLHP);
    $formAddGD.on("submit", handleAddGD);

    $("body").on("click", ".btn-delete-gv", handleDeleteGv);
    $("body").on("click", ".btn-delete-lop", handleDeleteLop);
    $("body").on("click", ".btn-delete-mh", handleDeleteMh);
    //   $("body").on("click", ".btn-delete-pcgd", handleDeletePCMH);
    $("body").on("click", ".btn-delete-lhp", handleDeleteLHP);
    $("body").on("click", ".btn-delete-gd", handleDeleteGD);
    $("body").on("click", ".btn-delete-pcgd", handleDeletePCGD);

    function handleAddGv(event) {
      event.preventDefault();
      var formData = $formAddGv.serializeArray();
      if (!formData[0].value) {
        return showToastr("Tên giảng viên là bắt buộc", true);
      }
      $.ajax({
        type: "POST",
        url: $formAddGv.attr("action"),
        data: $formAddGv.serialize(),
        success: function(response) {
          showToastr(response.message);
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        }
      });
    }
    function handleAddGD(event) {
      event.preventDefault();
      var formData = $formAddGD.serializeArray();
      if (!formData[0].value) {
        return showToastr("Tên giảng đường là bắt buộc", true);
      }
      $.ajax({
        type: "POST",
        url: $formAddGD.attr("action"),
        data: $formAddGD.serialize(),
        success: function(response) {
          showToastr(response.message);
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        }
      });
    }
    function handleAddLop(event) {
      event.preventDefault();
      var formData = $formAddLop.serializeArray();
      if (!formData[0].value) {
        return showToastr("Tên lớp là bắt buộc", true);
      }
      if (!formData[1].value) {
        return showToastr("Khoá học là bắt buộc", true);
      }
      if (!formData[2]) {
        return showToastr("Vui lòng chọn buổi học", true);
      }

      $.ajax({
        type: "POST",
        url: $formAddLop.attr("action"),
        data: $formAddLop.serialize(),
        success: function(response) {
          showToastr(response.message);
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        }
      });
    }

    function handleAddLHP(event) {
      event.preventDefault();
      var formData = $formAddLHP.serializeArray();
      if (!formData[0].value) {
        return showToastr("Vui lòng chọn môn học", true);
      }
      if (!formData[1].value) {
        return showToastr("Lớp học phần là bắt buộc", true);
      }
      if (!formData[2]) {
        return showToastr("Vui lòng chọn học kỳ", true);
      }

      $.ajax({
        type: "POST",
        url: $formAddLHP.attr("action"),
        data: $formAddLHP.serialize(),
        success: function(response) {
          if (response.success) {
            showToastr(response.message);
            setTimeout(() => {
              window.location.reload();
            }, 1000);
          } else {
            showToastr(response.message, true);
          }
        }
      });
    }
    function handleAddMh(event) {
      event.preventDefault();
      var formData = $formAddMh.serializeArray();
      if (!formData[0].value) {
        return showToastr("Tên môn học là bắt buộc", true);
      }
      if (!formData[1]) {
        return showToastr("Vui lòng chọn số tín chỉ", true);
      }

      $.ajax({
        type: "POST",
        url: $formAddMh.attr("action"),
        data: $formAddMh.serialize(),
        success: function(response) {
          if (response.success) {
            showToastr(response.message);
            setTimeout(() => {
              window.location.reload();
            }, 1000);
            return;
          }
          showToastr(response.message, true);
        }
      });
    }

    function handleAddPCGD(event) {
      event.preventDefault();
      var formData = $formAddPCGD.serializeArray();
      if (!formData[0]) {
        return showToastr("Vui lòng chọn môn học", true);
      }
      if (!formData[1]) {
        return showToastr("Vui lòng chọn giảng viên", true);
      }
      if (!formData[1]) {
        return showToastr("Vui lòng chọn lớp", true);
      }

      $.ajax({
        type: "POST",
        url: $formAddPCGD.attr("action"),
        data: $formAddPCGD.serialize(),
        success: function(response) {
          showToastr(response.message);
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        }
      });
    }

    function handleDeleteLHP(event) {
      event.preventDefault();
      window.Swal.fire({
        title: "Bạn có chắc không?",
        text: "Thông xin sẽ bị xoá vĩnh viễn!",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        cancelButtonText: "Huỷ",
        confirmButtonText: "Vâng, tiếp tục!"
      }).then(result => {
        if (result.value) {
          var currentBtn = $(event.currentTarget);
          $.ajax({
            type: "DELETE",
            url: currentBtn.attr("href"),
            success: function(response) {
              if (response.success) {
                $(`#lophocphan-${response.data.id}`).remove();
                window.Swal.fire(
                  "Thành công!",
                  "Xoá thông tin thành công.",
                  "success"
                );
                setTimeout(() => {
                  window.location.reload();
                }, 2000);
              }
            }
          });
        }
      });
    }

    function handleDeleteGv(event) {
      event.preventDefault();
      window.Swal.fire({
        title: "Bạn có chắc không?",
        text: "Thông xin sẽ bị xoá vĩnh viễn!",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        cancelButtonText: "Huỷ",
        confirmButtonText: "Vâng, tiếp tục!"
      }).then(result => {
        if (result.value) {
          var currentBtn = $(event.currentTarget);
          $.ajax({
            type: "DELETE",
            url: currentBtn.attr("href"),
            success: function(response) {
              if (response.success) {
                $(`#giangvien-${response.data.id}`).remove();
                window.Swal.fire(
                  "Thành công!",
                  "Xoá thông tin thành công.",
                  "success"
                );
                setTimeout(() => {
                  window.location.reload();
                }, 2000);
              }
            }
          });
        }
      });
    }
    function handleDeleteGD(event) {
      event.preventDefault();
      window.Swal.fire({
        title: "Bạn có chắc không?",
        text: "Thông xin sẽ bị xoá vĩnh viễn!",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        cancelButtonText: "Huỷ",
        confirmButtonText: "Vâng, tiếp tục!"
      }).then(result => {
        if (result.value) {
          var currentBtn = $(event.currentTarget);
          $.ajax({
            type: "DELETE",
            url: currentBtn.attr("href"),
            success: function(response) {
              if (response.success) {
                $(`#giangduong-${response.data.id}`).remove();
                window.Swal.fire(
                  "Thành công!",
                  "Xoá thông tin thành công.",
                  "success"
                );
                setTimeout(() => {
                  window.location.reload();
                }, 2000);
              }
            }
          });
        }
      });
    }
    function handleDeleteLop(event) {
      event.preventDefault();
      window.Swal.fire({
        title: "Bạn có chắc không?",
        text: "Thông xin sẽ bị xoá vĩnh viễn!",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        cancelButtonText: "Huỷ",
        confirmButtonText: "Vâng, tiếp tục!"
      }).then(result => {
        if (result.value) {
          var currentBtn = $(event.currentTarget);
          $.ajax({
            type: "DELETE",
            url: currentBtn.attr("href"),
            success: function(response) {
              if (response.success) {
                $(`#lop-${response.data.id}`).remove();
                window.Swal.fire(
                  "Thành công!",
                  "Xoá thông tin thành công.",
                  "success"
                );
                setTimeout(() => {
                  window.location.reload();
                }, 2000);
              }
            }
          });
        }
      });
    }
    function handleDeletePCGD(event) {
      event.preventDefault();
      window.Swal.fire({
        title: "Bạn có chắc không?",
        text: "Thông xin sẽ bị xoá vĩnh viễn!",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        cancelButtonText: "Huỷ",
        confirmButtonText: "Vâng, tiếp tục!"
      }).then(result => {
        if (result.value) {
          var currentBtn = $(event.currentTarget);
          $.ajax({
            type: "DELETE",
            url: currentBtn.attr("href"),
            success: function(response) {
              if (response.success) {
                $(`#pcgd-${response.data.id}`).remove();
                window.Swal.fire(
                  "Thành công!",
                  "Xoá thông tin thành công.",
                  "success"
                );
                setTimeout(() => {
                  window.location.reload();
                }, 2000);
              }
            }
          });
        }
      });
    }
    function handleDeleteMh(event) {
      event.preventDefault();
      window.Swal.fire({
        title: "Bạn có chắc không?",
        text: "Thông xin sẽ bị xoá vĩnh viễn!",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        cancelButtonText: "Huỷ",
        confirmButtonText: "Vâng, tiếp tục!"
      }).then(result => {
        if (result.value) {
          var currentBtn = $(event.currentTarget);
          $.ajax({
            type: "DELETE",
            url: currentBtn.attr("href"),
            success: function(response) {
              if (response.success) {
                $(`#monhoc-${response.data.id}`).remove();
                window.Swal.fire(
                  "Thành công!",
                  "Xoá thông tin thành công.",
                  "success"
                );
                setTimeout(() => {
                  window.location.reload();
                }, 2000);
              }
            }
          });
        }
      });
    }
    function handleDeletePCMH(event) {
      event.preventDefault();
      window.Swal.fire({
        title: "Bạn có chắc không?",
        text: "Thông xin sẽ bị xoá vĩnh viễn!",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        cancelButtonText: "Huỷ",
        confirmButtonText: "Vâng, tiếp tục!"
      }).then(result => {
        if (result.value) {
          var currentBtn = $(event.currentTarget);
          $.ajax({
            type: "DELETE",
            url: currentBtn.attr("href"),
            success: function(response) {
              if (response.success) {
                $(`#pcgd-${response.data.id}`).remove();
                window.Swal.fire(
                  "Thành công!",
                  "Xoá thông tin thành công.",
                  "success"
                );
                setTimeout(() => {
                  window.location.reload();
                }, 2000);
              }
            }
          });
        }
      });
    }

    function showToastr(message, error) {
      window.toastr.remove();
      if (error) {
        return window.toastr.error(message);
      }
      window.toastr.success(message);
    }
  }
});
