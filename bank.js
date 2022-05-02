
class Bank{
  constructor(bankName, rate, maxLoan, termLoan){
     this.bankName   = bankName;
     this.rate       = rate;
     this.maxLoan    = maxLoan;
     this.minPayment = 0;
     this.termLoan   = termLoan;
     this.id         = this.setId();
     this.loan       = 0;
     this.isRequest  = false;
  }

    setId(){ 
      let id = localStorage.getItem("bankId");
      id++;
      localStorage.setItem("bankId", id);
      return id;    
  }

}

let view = {

  idRow: "", 
  
  //Заповнення списку банків
  setBankList:function(){
    //Перевірка наявності записів про банк
    $('#bankTable tr[id]').remove();
    if (!localStorage.hasOwnProperty("bankId")){
        localStorage.setItem("bankId", "0");
    } else if(localStorage.getItem("bankId") !== "0"){  
        let keys = Object.keys(localStorage);
        for(let key of keys) {
          if (key !== "bankId"){
            let bank = JSON.parse( localStorage.getItem(key));
            this.addRow(bank);
          }  
    } 
  }
  },
  
  //Додавання рядків в таблицю банків
  addRow:function(row){
    $('#bankTable tr:last').after('<tr></tr>');
    let newRow = $("#bankTable").find("tr:last");
    let id = row.bankName + row.id;
    newRow.attr("id", id);
    newRow.append(`<td><input type='radio' name='banksList' value=${id}></input></td>`);
    for(let key in row){
        if(key!== "id" && key!== "loan"){
          $("#"+id).append("<td></td>");
          let newTd = $("#"+id).find("td:last");  
          let newtext = row[key];
          if(newtext === true){
            newtext = "✔️";
            newTd.attr("class", "td-green");
          } else if(newtext === false){
            newtext = "";
          }
          newTd.text(newtext);
        }       
    }
    $("#"+id).append(`<td><form action="calculator.html"><input type="submit" name=${id} value="Calculate" ></input></form></td>`); 
  },
   

initHandle: function(){

  //Button Create
  $("#create").on("click", function(){
    $(".inputNewBank").show();
  })

  //Button Edit
  $("#edit").on("click", function(){
    $(".inputNewBank").show();     
      //Заповнюємо данними для редагування
      const checked = $('input[name="banksList"]:checked').val();
      if(checked !== undefined){
        let  bank = JSON.parse(localStorage.getItem(checked));
        view.idRow = checked; //Запам'ятовуємо рядок редагування
        for(let [key,value] of Object.entries(bank)){
          if(key !=="id" && key!== "loan" && key !=="minPayment" && key !=="isRequest" ){
            $("#" + key).val(value);
          }
        }
      }
})

  //Button Delete
  $("#remove").on("click", function(){
  $(".inputNewBank").hide();
  const checked = $('input[name="banksList"]:checked').val();

  if(checked !== undefined){
    localStorage.removeItem(checked);
    $("#" + checked).remove();
  }
  $(".form-input")[0].reset();

  })

  //Button Save
  $("#saveButton").on("click", function(){
    
    let formNewBank = $(".newBank");
    console.log(formNewBank);
    let newBank = null;

    if(view.idRow){
        newBank = JSON.parse(localStorage.getItem(view.idRow));
    } else {
       newBank = new Bank();
    }
    

    for(let i = 0; i <formNewBank.length; i++){
      newBank[formNewBank[i].id] = formNewBank[i].value;
    }
   
    newBank.minPayment = (newBank.maxLoan * newBank.rate)/100;
    
    let idRow = newBank.bankName+newBank.id;
    localStorage.setItem(idRow, JSON.stringify(newBank));

    if(view.idRow){
      //При зміні назви банку міняємо весь рядок
      if(idRow !== view.idRow){
        localStorage.removeItem(view.idRow);
      }      
      view.idRow = "";
    } 
    $(".inputNewBank").hide();
    $(".form-input")[0].reset();
    view.setBankList();
  })

//Button Cancel
$("#cancleButton").on("click", function(){
  $(".inputNewBank").hide();
  $(".form-input")[0].reset();
})

}

}

function init(){
  view.initHandle();
  view.setBankList();
}

window.onload = init;
