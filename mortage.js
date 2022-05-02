
let model = {
    bank: {bankName:"", rate: 0, maxLoan: 0, minPayment: 0, termLoan: 0, loan:0, id:0, isRequest: false},
    banksList:[],
    loan: 0,
    minPayment: 0,
    monthPay: 0,

    setView: function(){
        //Встановлюємо список банків
        this.setBanksList();

        for(let i=0; i<this.banksList.length; i++){
            console.log(this.banksList[i].id);
        $("#bankList").append(`<option value=${this.banksList[i].id}>${this.banksList[i].name}</option>`); 
            if(this.banksList[i].id === this.bank.id){
                $("#bankList :last").prop("selected", "selected");     
            } 
    
        }
        
        //Заповнюємо данні банку
        $("#bankName").text(this.bank.bankName);     
        $("#maxLoan").text(`Maximum loan: ${this.bank.maxLoan} $`);
        $("#interestRate").text(`Interest rate: ${this.bank.rate} %`);
        $("#loanTerm").text(`Loan term: ${this.bank.termLoan} month`);   
        
        //Заповнюємо данні і назначаємо обробники
        let elementLoan = $("#loan");
        let elementRange = $("#range"); 
        let requestMessage = $("#isRequest");
        let requestButton = $("#buttonRequest");

        if(this.bank.isRequest){
            requestMessage.text("Your request is being processed by the bank");
            elementLoan.attr("disabled", "disabled");
            elementRange.attr("disabled", "disabled");
            requestButton.attr("disabled", "disabled");    
       } else {
        requestMessage.text("");
            elementLoan.attr("disabled", null);
            elementRange.attr("disabled", null);
            requestButton.attr("disabled", null);  
       }

        
       let val = ((this.bank.loan == 0) ? this.bank.maxLoan : this.bank.loan);

        console.log("!" + val)          
        elementLoan.val(val); 
        elementLoan.attr("max", this.bank.maxLoan); 
        this.loan = val;
       
        let calcLoan = function(){

            if (elementLoan.val() < 0){
                elementLoan.val(0);
            }
            
            if(Number(elementLoan.val()) > Number(model.bank.maxLoan)){
                elementLoan.val(model.bank.maxLoan);
            }
            model.loan = elementLoan.val();
            elementRange.val(model.loan); 
            model.calcMinPayment();
        };

        elementLoan.on({"change":calcLoan, "click":calcLoan});
     
        elementRange.attr("max", this.bank.maxLoan);
        elementRange.attr("step", 1000);
        elementRange.attr("value", elementLoan.value);
        elementRange.on("change", function(){
        elementLoan.val(elementRange.val());
            model.loan = elementLoan.val();
            model.calcMinPayment();
        });
        
        model.calcMinPayment();

    },

    setBanksList: function(){
        this.banksList = [];
        let keys = Object.keys(localStorage);
        for(let key of keys) {
          if (key !== "bankId"){
                let bankParse = JSON.parse( localStorage.getItem(key));
                let bankElements = {id: bankParse.id ,idName: bankParse.bankName + bankParse.id, name: bankParse.bankName};
                this.banksList.push(bankElements);          
            }  
        }
        $('option', $("#bankList")).remove();
    },  
    
    setBank: function(bankId){
        bankJSON = JSON.parse(localStorage.getItem(bankId));
        if(bankJSON){
            this.bank = bankJSON;
            this.setView(); 
        }
    },

    calcMinPayment:function(){
        let calcFun = function(loan){
            model.minPayment = Math.floor((loan * model.bank.rate))/100;
            model.monthPay   =  Math.floor(100*(loan - model.minPayment)/model.bank.termLoan)/100;
        }
        
        if(!this.bank.isRequest){
            calcFun(this.loan);
        } else {
            calcFun(this.bank.loan);
        }   
        
        $("#initialLoan").text(`Initial loan: ${this.loan} $`);
        $("#downPayment").text(`Down payment: ${this.minPayment} $`);
        $("#payPerMonth").text(`Pay per month: ${this.monthPay} $`);      
        
    },
    //Відправка запиту
    sendRequest:function(){
        model.bank.loan          = model.loan;
        //model.bank.minPayment    = model.minPayment;
        model.bank.isRequest     = true;
        localStorage.setItem(model.bank.bankName + model.bank.id, JSON.stringify(model.bank));
    },

    changeBank:function(value){
            
       

    },

    initHandle:function(){
        $("#bankList").on("change", function(){
            
            let value =  $("#bankList :selected").val();

            for(let i=0; i<model.banksList.length;i++){
             
                if(value == model.banksList[i].id){    
                    model.setBank(model.banksList[i].idName);
                    break;
                }
            }
        })
    }


}


// Ініціалізація сторінки
function init(){

    model.initHandle();
    let bankId = window.location.search.match(/\w+\d+/);
    if(bankId){
        bankId = bankId[0];
        model.setBank(bankId);
    }
    
}

window.onload = init;