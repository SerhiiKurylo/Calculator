
let Manage = {

  initBankList() {
    this.bankList = new BankList();
    this.initHandle();
  },

  // Ініціалізація кнопок
  initHandle() {

    //Button Create
    $("#create").on("click", function () {
      $(".inputNewBank").show();
    })

    //Button Edit
    $("#edit").on("click", function () {
      $(".inputNewBank").show();
      //Заповнюємо данними для редагування
      const checked = $('input[name="banksList"]:checked').val();
      console.log(checked);
      if (checked !== undefined) {

        $.ajax({
          url: 'http://localhost:8080/api/edit/' + checked,
          accepts: 'application/json',
          method: 'GET',
          success: function (data) {

            //let list = JSON.parse(data);
            Manage.bankList.currentRow = checked;
            for (let [key, value] of Object.entries(data)) {
              if (key !== "id") {
                $("#" + key).val(value);
              } else {
                Manage.bankList.currentRow = value;
              }
            }
          }
        });
      }
    })

    //Button Delete
    $("#remove").on("click", function () {
      $(".inputNewBank").hide();
     // let chekedRow = $('input[name="banksList"]:checked');     
      const checked = $('input[name="banksList"]:checked').val();
      if (checked !== undefined) {

        $.ajax({
          url: 'http://localhost:8080/api/' + checked,
          accepts: 'application/json',
          method: 'DELETE',
          success: function (data) {
            $("#" + checked).remove();
            $(".form-input")[0].reset();
          }
        });

      }
    })

    //Button Save
    $("#saveButton").on("click", function () {

      let requestData = {
        id: Manage.bankList.currentRow,
        bankName: $('#bankName').val(),
        rate: $('#rate').val(),
        maxLoan: $('#maxLoan').val(),
        termLoan: $('#termLoan').val(),
      }
      
      $.ajax({
        url: 'http://localhost:8080/api/save/' + Manage.bankList.currentRow,
        type: 'POST',
        data: JSON.stringify(requestData),
        contentType: 'application/json',
        success: function () {
          window.location.href = '/'
        }
      })

    })

    //Button Cancel
    $("#cancleButton").on("click", function () {
      $(".inputNewBank").hide();
      $(".form-input")[0].reset();
    })

  }
}

function init() {
  Manage.initBankList();
}

window.onload = init;