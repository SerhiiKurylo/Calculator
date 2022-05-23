class BankList {
  
    constructor(){
        this.currentRow = 0; 
        this.setBankList();   
    }  
    
     
  
    //Заповнення списку банків
    setBankList() {
      //Перевірка наявності записів про банк
      $('#bankTable tr[id]').remove();

      $.ajax({
        url: 'http://localhost:8080/api/',
        accepts: 'application/json',
        method: 'GET',
        success: function (data) {

          let list = JSON.parse(data);
          
          for(let i = 0; i<list.length; i++){
            let bank = list[i];
            let template = $("#table-row").html();
            let output = $("#bankTable tr:last");
            $("#table-row tr").attr("id", bank.nameId);
            $("#table-row input[name='banksList']").val(bank.nameId);
            bank.requested = (bank.isRequested) ? "✔️" : "❌";
            let html = Mustache.render(template, bank);
            output.after(html);
          }
        }
      });


    }  
      
  
  }
