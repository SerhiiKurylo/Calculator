class BankList {
  
    constructor(){
        this.currentRow = ""; 
        this.setBankList();   
    }  
    
    get idRow() {
      return localStorage.getItem("bankId");
    }
  
    setIdRow(id) {
      ("here") 
      localStorage.setItem("bankId", id);
    }
    
  
    //Заповнення списку банків
    setBankList() {
      //Перевірка наявності записів про банк
      $('#bankTable tr[id]').remove();
      if (!localStorage.hasOwnProperty("bankId")) {
        localStorage.setItem("bankId", 0);
      } else if (this.idRow !== "0") {
        let keys = Object.keys(localStorage);
        for (let key of keys) {
          if (key !== "bankId") {
            let bank = JSON.parse(localStorage.getItem(key));
            this.addRow(bank);
          }
        }
      }
    }
  
    //Додавання рядків в таблицю банків
    addRow(bank) {
  
      let template = $("#table-row").html();
      let output = $("#bankTable tr:last");
      $("#table-row tr").attr("id", bank.nameId);
      $("#table-row input[name='banksList']").val(bank.nameId);
      bank.requested = Bank.getRequested(bank.isRequest);
      let html = Mustache.render(template, bank);
      output.after(html);
    }
  
  }