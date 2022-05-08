
let Manage = {
  
    initBankList(){
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
          let bank = Bank.getBank(checked);
          console.log(bank);
          Manage.bankList.currentRow = checked;
          for (let [key, value] of Object.entries(bank)) {
            if (key !== "id" && key !== "loan" && key !== "minPayment" && key !== "isRequest") {
              $("#" + key).val(value);
            }
          }
        }
      })
  
      //Button Delete
      $("#remove").on("click", function () {
        $(".inputNewBank").hide();
        const checked = $('input[name="banksList"]:checked').val();
          if (checked !== undefined) {
          localStorage.removeItem(checked);
          $("#" + checked).remove();
        }
        $(".form-input")[0].reset();
        Manage.bankList.setBankList();
      })
  
      //Button Save
      $("#saveButton").on("click", function () {
  
        let formNewBank = $(".newBank");
        let newBank = null;
        let currentRow = Manage.bankList.currentRow;
  
        if (currentRow) {
          newBank = Bank.getBank(currentRow);
        } else {
          console.log("+++++");
          newBank = new Bank();
          console.log("-----");
        }
  
  
        for (let i = 0; i < formNewBank.length; i++) {
          newBank[formNewBank[i].id] = formNewBank[i].value;
        }
        

        console.log("!1!");
        console.log(newBank);

        newBank.minPayment = Bank.setMinPayment(newBank);
        newBank.nameId = Bank.getNameId(newBank);
        console.log("!2!");
        console.log(newBank);
        Bank.setBank(newBank.nameId, newBank);
        
        idRow = newBank.bankName + newBank.id
  
        if (Manage.bankList.currentRow) {
          //При зміні назви банку міняємо весь рядок
          if (newBank.nameId!== currentRow){
            localStorage.removeItem(currentRow);
          }
          Manage.bankList.currentRow = "";
        }
        $(".inputNewBank").hide();
        $(".form-input")[0].reset();
        Manage.bankList.setBankList();
      })
  
      //Button Cancel
      $("#cancleButton").on("click", function () {
        $(".inputNewBank").hide();
        $(".form-input")[0].reset();
      })
  
    }
  
  }
  
  function init() {
   //localStorage.clear();
    Manage.initBankList();
  }
  
  window.onload = init;