
let model = {
    bank: {bankName:"", rate: 0, maxLoan: 0, minPayment: 0, termLoan: 0, loan:0, id:0, isRequest: false},
    banksList:[],
    loan: 0,
    minPayment: 0,
    monthPay: 0,

    setView: function(){
        //Встановлюємо список банків
        this.setBanksList();

        let selectList = document.getElementById("bankList");

        while (selectList.firstChild) {
            selectList.removeChild(selectList.firstChild);
          }


        for(let i=0; i<this.banksList.length; i++){
            let elementOptions = document.createElement("option");
            elementOptions.value = this.banksList[i].id;
            elementOptions.innerHTML = this.banksList[i].name;
            elementOptions.selected = (this.banksList[i].id === this.bank.id);
            selectList.appendChild(elementOptions);
        }
        
        //Заповнюємо данні банку
           document.getElementById("bankName").innerHTML = this.bank.bankName;     
           document.getElementById("bankTerms").innerHTML = `<p>Maximum loan: ${this.bank.maxLoan} $</p>`+
                                                             `<p>Interest rate: ${this.bank.rate} %</p>` +
                                                             `<p>Loan term: ${this.bank.termLoan} month</p>`; 
            
        
        //Заповнюємо данні і назначаємо обробники
        let elementLoan = document.getElementById("loan");
        let elementRange = document.getElementById("range"); 
        let requestMessage = document.getElementById("isRequest");
        let requestButton = document.getElementById("buttonRequest");

        if(this.bank.isRequest){
            requestMessage.innerHTML = "Your request is being processed by the bank";
            elementLoan.setAttribute("disabled", "disabled");
            elementRange.setAttribute("disabled", "disabled");
            requestButton.setAttribute("disabled", "disabled");    
       } else {
            requestMessage.innerHTML = "";
            elementLoan.removeAttribute("disabled");
            elementRange.removeAttribute("disabled");
            requestButton.removeAttribute("disabled");  
       }

        
        

        elementLoan.value = ((this.bank.loan == 0) ? this.bank.maxLoan : this.bank.loan);
        elementLoan.setAttribute("max", this.bank.maxLoan); 
        this.loan = elementLoan.value;
       
        let calcLoan = function(){

            if (elementLoan.value < 0){
                elementLoan.value = 0;
            }
            
            if(Number(elementLoan.value) > Number(model.bank.maxLoan)){
                elementLoan.value = model.bank.maxLoan;
            }
            model.loan = elementLoan.value;
            elementRange.value = model.loan; 
            model.calcMinPayment();
        };

        elementLoan.onchange = calcLoan;
        elementLoan.onclick  = calcLoan;
     
        elementRange.setAttribute("max", this.bank.maxLoan);
        elementRange.setAttribute("step", 1000);
        elementRange.setAttribute("value", elementLoan.value);
        elementRange.onchange = function(){
            elementLoan.value = elementRange.value
            model.loan = elementLoan.value;
            model.calcMinPayment();
        };
        
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
        
        let textEstimatedData = `<p>Initial loan: ${this.loan} $</p>`+
                                `<p>Down payment: ${this.minPayment} $</p>`+
                                `<p>Pay per month: ${this.monthPay} $</p>`      
        document.getElementById("estimatedData").innerHTML =  textEstimatedData;
        
    },
    //Відправка запиту
    sendRequest:function(){
        model.bank.loan          = model.loan;
        //model.bank.minPayment    = model.minPayment;
        model.bank.isRequest     = true;
        localStorage.setItem(model.bank.bankName + model.bank.id, JSON.stringify(model.bank));
    },

    changeBank:function(value){
            
        for(let i=0; i<model.banksList.length;i++){
             
            if(value == model.banksList[i].id){    
                model.setBank(model.banksList[i].idName);
                break;
            }
        }

    }
}


// Ініціалізація сторінки
function init(){

    
    let bankId = window.location.search.match(/\w+\d+/);
    if(bankId){
        bankId = bankId[0];
        model.setBank(bankId);
    }
    
}

window.onload = init;