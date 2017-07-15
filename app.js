// BUDGET CONTROLLER
var budgetController = (function() {
   
   var Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
   }

   var Income = function(id, description, value) {
       this.id = id;
       this.description = description;
       this.value = value;
   }

   var data = {
       allItems : {
           exp : [],
           inc : [],
       },
       totals: {
           exp : 0,
           inc : 0
       }
   };

   return {
       addItem : function(type, des, val) {
            var newItem, id;

            /*id generation logic
                [1,2,3,4,5] ---> next id = last id value + 1 = 6
                if one of items got deleted then also
                [1,2,4] ---> next id = 4 + 1 = 5
            */
            // Create a new id
            id =  data.allItems[type].length > 0 ? data.allItems[type][data.allItems[type].length - 1].id + 1 : 0;

            // create new item based on type = 'inc' or 'exp'
            if(type === 'inc') {
                newItem = new Income(id, des, val);
            }
            else if(type === 'exp'){
                newItem = new Expense(id, des, val);
            }

            // add newly create item into data
            data.allItems[type].push(newItem);

            // return item
            return newItem;
       },
       testing : function() {
           console.log(data);
       }
   }


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
        },

        addListItem : function(obj, type) {
            
            var html, newHtml;

            // initialize html with proper html text
            if(type === 'inc') {
                html ='<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div> <div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            else if(type === 'exp') {
                html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }

            newHtml = html.replace('%id', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);


        }
    };
   
})();

// APP CONTROLLER
var appController = (function(budgetCtrl, UICtrl){

    var input, domStrings, newItem;
    
    domStrings = UICtrl.getDomStrings();

    var ctrlAddItem = function() {
    
    // 1. get input from user
    input = UICtrl.getInput();
       
    // 2. add new item to data structure
    newItem = budgetCtrl.addItem(input.inputType, input.input_desc, input.input_val);

       // 3. add new item to the UI
       // 4. calculate budget
       // 5. update the UI
   };

    var setupEventListeners = function () {
        
        document.querySelector(domStrings.add_btn).addEventListener('click', ctrlAddItem);
        document.addEventListener('keyup', function(event) {
            
            if(event.keyCode === 13) {
            ctrlAddItem();
            }
        });
    };

    return {
        init : function() {
            console.log('Application Started');
            setupEventListeners();
        }
    }
      
   
})(budgetController, UIController);

appController.init();