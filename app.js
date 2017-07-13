
// BUDGET CONTROLLER
var budgetController = (function() {
   
})();


// UI CONTROLLER
var UIController = (function() {

    var domStrings = {
        add_type : '.add__type',
        add_desc : '.add__description',
        add_value : '.add__value',
        add_btn : '.add__btn',

    };

    return {
        getInput : function() {
            return {
                inputType : document.querySelector(domStrings.add_type).value,
                input_desc : document.querySelector(domStrings.add_desc).value,
                input_val : document.querySelector(domStrings.add_value).value
            };
        },

        getDomStrings : function() {
            return domStrings;
        }
    };
   
})();

// APP CONTROLLER
var appController = (function(budgetCtrl, UICtrl){

    var domStrings = UICtrl.getDomStrings();

    var ctrlAddItem = function() {

       console.log(UICtrl.getInput());
       // 1. get input from user
       // 2. add new item to data structure
       // 3. add new item to the UI
       // 4. calculate budget
       // 5. update the UI
   };

    function init() {
        
        document.querySelector(domStrings.add_btn).addEventListener('click', ctrlAddItem);
        document.addEventListener('keyup', function(event) {
            
            if(event.keyCode === 13) {
            ctrlAddItem();
            }
        });
    };

    init();
      
   
})(budgetController, UIController);