
class Bank {
    constructor(bankName, rate, maxLoan, termLoan) {
      this.bankName = bankName;
      this.rate = rate;
      this.maxLoan = maxLoan;
      this.minPayment = Bank.setMinPayment(this);
      this.termLoan = termLoan;
      this.id = this.setId();
      this.loan = 0;
      this.isRequest = false;
      //this.nameId = Bank.getNameId(this);
    }
  
    setId() {
      let id = localStorage.getItem("bankId");
      id++;
      localStorage.setItem("bankId", id);
      return id;  
    }
  
    static getNameId(thisBank) {
        console.log(thisBank)
        console.log("@id!= " + thisBank.id);
      return thisBank.bankName + thisBank.id;
    }
  
    static setMinPayment(thisBank) {
      return (thisBank.maxLoan * thisBank.rate) / 100;
    }
  
    static getRequested(isRequest){
      return (isRequest) ? "✔️" : "❌";
    }

    static getBank(key){
      return  JSON.parse(localStorage.getItem(key));
    }

    static setBank(nameId, newBank){
        localStorage.setItem(nameId, JSON.stringify(newBank));
    }

  }
  
  
  
  
  