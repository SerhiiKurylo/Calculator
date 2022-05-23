
let model = {

   bankData:{
   
        get loan() {
            return $("#loan").val()
        },
        get rate() {
            return $("#interestRate").attr("data-value")
        },
        get termLoan() {
            return $("#loanTerm").attr("data-value")
        },   
        get minPayment() {
            return Math.floor((this.loan * this.rate)) / 100
        },
        get monthPay() {
            return Math.floor((this.loan - this.minPayment) / this.termLoan)
        }

   },

    setBanksList: function(){
        
        let head = {
            accepts: 'application/json',
            method: 'GET'
        };

        fetch('http://localhost:8080/getBankList', head)
            .then(response => {
                return response.json();
            })
            .then(data => {
                console.log(data);
                
                for (let i = 0; i < data.length; i++) {
                    $("#bankList").append(`<option value=${data[i].id}>${data[i].bankName}</option>`);
                    if (data[i].id == model.bankData.id) {
                        $("#bankList :last").prop("selected", "selected");
                    }
                    
                }
                
            });
            
    },  
    
    setBank: function (bankId) {
     
        let head = {
            accepts: 'application/json',
            method: 'GET'
        };
        fetch('http://localhost:8080/calculate/' + bankId, head)
            .then(response => {
                return response.json();
            })
            .then(data => {
                let template = $("#mortage").html();
                let output = $("#template");
                data.requestMessage = data.isRequested ? "Your request is being processed by the bank" : "";
                output.append(Mustache.render(template, data));
                //Встановлення доступності кнопки Request і зміни сумми Loan

                let elementLoan = $("#loan");
                let elementRange = $("#range");
                let requestButton = $("#buttonRequest");

                if (data.isRequested) {
                    elementLoan.attr("disabled", "disabled");
                    elementRange.attr("disabled", "disabled");
                    requestButton.attr("disabled", "disabled");
                } else {
                    elementLoan.attr("disabled", null);
                    elementRange.attr("disabled", null);
                    requestButton.attr("disabled", null);
                }
                model.initHandle();
            })
    },


    calcMinPayment:function(){

        $("#initialLoan").text(`Initial loan: ${model.bankData.loan} $`);
        $("#downPayment").text(`Down payment: ${model.bankData.minPayment} $`);
        $("#payPerMonth").text(`Pay per month: ${model.bankData.monthPay} $`);      
        
    },

   
    initHandle:function(){

        //Вибір в списку
        $("#bankList").on("change", function(){
            let value = $("#bankList :selected").val();
            if (model.bankData.id != value) {
                $('#template').empty();
                model.bankData.id = value;
                model.setBank(value);
            }

        })
      
        //зміна loan
        $("#range").on("change", function (e) {

            $("#loan").val($("#range").val());
            model.calcMinPayment();

        })

        $("#loan").on("change", function (e) {
            
            $("#range").val($("#loan").val());
            model.calcMinPayment();

        })

    },

    initSubmit: function(){
        $("#formPayment").on("submit", function(){

            let head = {
                headers: {
                    'content-type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify(model.bankData)
            };
             fetch('http://localhost:8080/requestMortage', head)
                .then(response => {
                   console.log(response.status);
                })
        })

    }


}


// Ініціалізація сторінки
function init() {

    model.bankData.id = window.location.search.match(/\d+/);

    if (model.bankData.id) {

        new Promise(function (resolve, error) {
            model.setBank(model.bankData.id);
            resolve('done')
        })
        .then(model.setBanksList());
    }

    model.initSubmit();

}

window.onload = init;