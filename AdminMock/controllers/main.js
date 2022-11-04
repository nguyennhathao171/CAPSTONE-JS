var sanPhamSer = new SanPhamService();

//Hàm rút gọn cú pháp document.getElements..
function getELE(id) {
  return document.getElementById(id);
}

getListProducts();
function getListProducts() {
  sanPhamSer
    .layDSSP()
    .then(function (result) {
      console.log(result.data);
      renderTable(result.data);
      setLocalStorage(result.data);
    })
    .catch(function (error) {
      console.log(error);
    });
}
function setLocalStorage(mangSP) {
  localStorage.setItem("DSSP", JSON.stringify(mangSP));
}

//Gắn sự kiện click cho button search
getELE("basic-addon2").addEventListener("click", function () {
  var mangSP = getLocalStorage();
  var mangTK = [];
  console.log(mangSP);

  var chuoiTK = getELE("inputTK").value;

  mangTK = sanPhamSer.timKiemSP(mangSP, chuoiTK);

  console.log(mangTK);
  renderTable(mangTK);
});

function getLocalStorage() {
  var mangKQ = JSON.parse(localStorage.getItem("DSSP"));
  return mangKQ;
}

// Validation

function validateForm() {}

function required(val, spanId) {
  if (val.length === 0) {
    getELE(spanId).innerHTML = "Trường này bắt buộc nhập!";
    return false;
  }

  getELE(spanId).innerHTML = "";
  return true;
}

function length(val, spanId, min, max) {
  if (val.length < min || val.length > max) {
    document.getElementById(
      spanId
    ).innerHTML = `*Độ dài phải từ ${min} tới ${max} kí tự`;
    return false;
  }

  document.getElementById(spanId).innerHTML = "";
  return true;
}

// pattern check name
function string(val, spanId) {
  var pattern = /^[A-z ]+$/g;
  if (pattern.test(val)) {
    document.getElementById(spanId).innerHTML = "";
    return true;
  }

  document.getElementById(spanId).innerHTML = `*Chỉ chấp nhận kí tự từ a tới z`;
  return false;
}

getELE("btnThemSP").addEventListener("click", function () {
  var footerEle = document.querySelector(".modal-footer");
  footerEle.innerHTML = `
        <button onclick="addProducts()" class="btn btn-success">Add Product</button>
    `;
});

function renderTable(mangSP) {
  var content = "";
  var count = 1;
  mangSP.map(function (sp, index) {
    content += `
            <tr>
                <td>${count}</td>
                <td>${sp.tenSP}</td>
                <td>${sp.gia}</td>
                <td>${sp.hinhAnh}</td>
                <td>${sp.moTa}</td>
                <td>
                    <button class="btn btn-danger" onclick="xoaSP('${sp.id}')">Xóa</button>
                    <button class="btn btn-info" onclick="xemSP('${sp.id}')">Xem</button>
                </td>
            </tr>
        `;
    count++;
  });
  getELE("tblDanhSachSP").innerHTML = content;
}

function addProducts() {
  //B1: Lấy thông tin(info) từ form
  // data, info
  var tenSP = getELE("TenSP").value;
  var gia = getELE("GiaSP").value;
  var hinhAnh = getELE("HinhSP").value;
  var moTa = getELE("MoTa").value;

  var sp = new SanPham(tenSP, gia, hinhAnh, moTa);
  console.log(sp);

  //B2: lưu info xuống database(cơ sở dữ liệu)
  sanPhamSer
    .themSP(sp)
    .then(function (result) {
      //Load lại danh sách sau khi thêm thành công
      getListProducts();

      //gọi sự kiên click có sẵn của close button
      //Để tắt modal khi thêm thành công
      document.querySelector("#myModal .close").click();
    })
    .catch(function (error) {
      console.log(error);
    });
}

function xoaSP(id) {
  sanPhamSer
    .xoaSanPham(id)
    .then(function (result) {
      //Load lại danh sách sau khi xóa thành công
      getListProducts();
    })
    .catch(function (error) {
      console.log(error);
    });
}

function xemSP(id) {
  sanPhamSer
    .xemSanPham(id)
    .then(function (result) {
      console.log(result.data);
      //Mở modal
      $("#myModal").modal("show");
      //Điền thông tin lên form
      getELE("TenSP").value = result.data.tenSP;
      getELE("GiaSP").value = result.data.gia;
      getELE("HinhSP").value = result.data.hinhAnh;
      getELE("MoTa").value = result.data.moTa;

      //Thêm button cập nhật cho form
      var footerEle = document.querySelector(".modal-footer");
      footerEle.innerHTML = `
            <button onclick="capNhatSP('${result.data.id}')" class="btn btn-success">Update Product</button>
        `;
    })
    .catch(function (error) {
      console.log(error);
    });
}

function capNhatSP(id) {
  //B1: Lấy thông tin(info) từ form
  var tenSP = getELE("TenSP").value;
  var gia = getELE("GiaSP").value;
  var hinhAnh = getELE("HinhSP").value;
  var moTa = getELE("MoTa").value;

  var sp = new SanPham(tenSP, gia, hinhAnh, moTa);
  console.log(sp);

  //B2: Cập nhật thông tin mới xuống DB
  sanPhamSer
    .capNhatSanPham(id, sp)
    .then(function (result) {
      console.log(result.data);
      //Load lại danh sách sau khi cập nhật thành công
      getListProducts();

      //gọi sự kiên click có sẵn của close button
      //Để tắt modal khi cập nhật thành công
      document.querySelector("#myModal .close").click();
    })
    .catch(function (error) {
      console.log(error);
    });
}
