
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
class Form{
  constructor(id, type, value){
    this.id      = id;
    this.type    = type;
    this.value   = value;
  }
}


let view = {

  bankTable : document.getElementById("bankTable"),
  createForm: document.getElementById("form"),
  idRow: "", 

  //Заповнення списку банків
  setBankList:function(){
    //Перевірка наявності записів про банк
    
    if (!localStorage.hasOwnProperty("bankId")){
        localStorage.setItem("bankId", "0");
    } else if(localStorage.getItem("bankId") !== "0"){  
        let keys = Object.keys(localStorage);
        for(let key of keys) {
          if (key !== "bankId"){
            let bank = JSON.parse( localStorage.getItem(key));
            this.addRow(view.bankTable, bank);
          }  
    } 
  }
  },
  
  //Додавання рядків в таблицю банків
  addRow:function(table, row){
      let newRow = table.insertRow();
      let id = row.bankName + row.id;
      newRow.setAttribute("id", id);
      this.createCeil(newRow, `<input type='radio' name='banksList' value=${id}></input>`);
      for(let key in row){
        if(key!== "id" && key!== "loan"){
          this.createCeil(newRow, row[key]);
        } 
      }
      //Додаємо кнопку переходу на сторінку розрахунку
      const newTextFormCalc = `<form action="calculator.html"><input type="submit" name=${id} value="Calculate" ></input></form>`; // class=${id}
      this.createCeil(newRow, newTextFormCalc);
  },
  
  //Створення колонок
  createCeil: function(newRow, newtext){
    let newCeil = newRow.insertCell();
    if(newtext === true){
      newtext = "&#10003";
      newCeil.setAttribute("class", "td-green");
    } else if(newtext === false){
      newtext = "";
    }
    newCeil.innerHTML = newtext;

  },

  //Створення нових рядків
  createRow: function(){
    this.addForm();
  },
  
  //Видалення рядків
  deleteRow:function(){

    const checked = document.querySelector('input[name="banksList"]:checked');
    if(checked){
      this.deleteForm(checked.value);
    }
  },

  deleteForm: function(checked){
    localStorage.removeItem(checked);
    let deleteRow = document.getElementById(checked);
    deleteRow.remove();   
  },
  
  //Корегування рядків
  editRow:function(){
    this.addForm();     
      //Заповнюємо данними для редагування
      const checked = document.querySelector('input[name="banksList"]:checked');
      if(checked){
        let  bank = JSON.parse(localStorage.getItem(checked.value));
        view.idRow = checked.value; //Запам'ятовуємо рядок редагування
        for(let [key,value] of Object.entries(bank)){
          if(key !=="id" && key!== "loan" && key !=="minPayment" && key !=="isRequest" ){
            let element = document.getElementById(key);
            element.value = value;
          }
        }
      }
    
    },
    
      //Додавання елементів на форму
   addForm: function(){
      
    if (!view.createForm.hasChildNodes()){
      let bankName = new Form("bankName" ,"Text", "Bank");
      let rate = new Form("rate","number", "Rate");
      let maxLoan = new Form("maxLoan","number", "Maximum loan");
      let termLoan = new Form("termLoan", "number", "Loan term");
      let formElements = [bankName, rate, maxLoan, termLoan];
      
      for(let i=0; i<formElements.length; i++){
        let newLabel = document.createElement("label");
        newLabel.for = formElements[i].id;
        newLabel.innerHTML = formElements[i].value + ":";
        newLabel.setAttribute("class", "newBanklabel");
        view.createForm.appendChild(newLabel);
        view.createForm.appendChild(document.createElement("br"));

        let newElement    = document.createElement("input");
        newElement.id     = formElements[i].id;
        newElement.type   = formElements[i].type;
        newElement.name   = formElements[i].id;
        newElement.setAttribute("class", "newBank");
        newElement.required = true;
        view.createForm.appendChild(newElement);
        view.createForm.appendChild(document.createElement("br"));
      }
  
      //Кнопка для створення/редагування нового запису
      let newButton = document.createElement("input");
      newButton.type  = "submit";
      newButton.value = "Save";
      newButton.setAttribute("class", "newBankButton");

      view.createForm.onsubmit = function(){
        let formNewBank = document.getElementsByClassName("newBank");
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

      };
  
      view.createForm.appendChild(newButton);

      //Кнопка відміни дії
      let buttonCancel = document.createElement("input");
      buttonCancel.type  = "Button";
      buttonCancel.value = "Cancel";
      buttonCancel.setAttribute("class", "newBankButton");

      buttonCancel.onclick = function(){
        view.idRow = "";
        while (view.createForm.firstChild) {
          view.createForm.removeChild(view.createForm.firstChild);
        }
      }
      view.createForm.appendChild(buttonCancel);

    }
  }

}

function init(){
  view.setBankList();
}

window.onload = init;
