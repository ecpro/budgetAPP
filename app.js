// BUDGET CONTROLLER
var budgetController = (function () {

    var Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    }

    var Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    }

    var data = {
        allItems: {
            exp: [],
            inc: [],
        },
        totals: {
            exp: 0,
            inc: 0
        },
        balanceInfo: {
            balanceSum: 0,
            percentExpenses: 0,
            percentRemaining: 0
        }
    };

    var calculateTotals = function calculateTotals(type) {
        var sum = 0;
        data.allItems[type].forEach(function (cur) {
            sum = sum + cur.value;
        });
        data.totals[type] = sum;
    }

    return {

        addItem: function (type, des, val) {
            var newItem, id;

            /*id generation logic
                [1,2,3,4,5] ---> next id = last id value + 1 = 6
                if one of items got deleted then also
                [1,2,4] ---> next id = 4 + 1 = 5
            */
            // Create a new id
            id = data.allItems[type].length > 0 ? data.allItems[type][data.allItems[type].length - 1].id + 1 : 0;

            // create new item based on type = 'inc' or 'exp'
            if (type === 'inc') {
                newItem = new Income(id, des, val);
            }
            else if (type === 'exp') {
                newItem = new Expense(id, des, val);
            }

            // add newly create item into data
            data.allItems[type].push(newItem);

            // return item
            return newItem;
        },

        testing: function () {
            console.log(data);
        },

        updateBalanceInfo: function () {

            // 1. calculate totals - inc and exp
            calculateTotals('inc');
            calculateTotals('exp');

            // calculate the balance
            data.balanceInfo.balanceSum = data.totals.inc - data.totals.exp;
            console.info("balanceSum : " + data.balanceInfo.balanceSum);

            // calculate the percentage 
            // total expenses / total income * 100
            data.balanceInfo.percentExpenses = (data.totals.inc > 0) ? Math.round((data.totals.exp / data.totals.inc) * 100) : -1;
            console.info("percentExpenses: " + data.balanceInfo.percentExpenses);
        },

        getBalanceInfo: function () {
            return {
                balance: data.balanceInfo.balanceSum,
                percentExp: data.balanceInfo.percentExpenses,
                percentRem: data.balanceInfo.percentRemaining,
                totalIncome: data.totals.inc,
                totalExpenses: data.totals.exp
            }
        }
    }


})();


// UI CONTROLLER
var UIController = (function () {

    var domStrings = {
        add_type: '.add__type',
        add_desc: '.add__description',
        add_value: '.add__value',
        add_btn: '.add__btn',
        expenses_list: '.expenses__list',
        income_list: '.income__list',
        balanceSumLabel: '.budget__value',
        incomeLabel : '.budget__income--value',
        expensesLabel : '.budget__expenses--value',
        percentExpLabel : '.budget__expenses--percentage'

    };

    return {
        getInput: function () {
            return {
                inputType: document.querySelector(domStrings.add_type).value,
                input_desc: document.querySelector(domStrings.add_desc).value,
                input_val: parseFloat(document.querySelector(domStrings.add_value).value)
            };
        },

        getDomStrings: function () {
            return domStrings;
        },

        addListItem: function (obj, type) {

            var html, newHtml, newHtmlParent;

            // initialize html with proper html text
            if (type === 'inc') {
                html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div> <div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
                newHtmlParent = document.querySelector(domStrings.income_list);
            }
            else if (type === 'exp') {
                html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
                newHtmlParent = document.querySelector(domStrings.expenses_list);
            }

            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);

            newHtmlParent.insertAdjacentHTML('beforeend', newHtml);

        },

        clearInputFields: function () {
            var nodeList;
            nodeList = document.querySelectorAll(domStrings.add_desc + ', ' + domStrings.add_value);
            Array.prototype.forEach.call(nodeList, function (item) {
                item.value = "";
            });

            nodeList[0].focus();
        },

        displayBudget : function(obj) {
            document.querySelector(domStrings.balanceSumLabel).textContent = obj.balance;
            document.querySelector(domStrings.incomeLabel).textContent = obj.totalIncome;
            document.querySelector(domStrings.expensesLabel).textContent = obj.totalExpenses;

            if(obj.percentExp > 0) {
                document.querySelector(domStrings.percentExpLabel).textContent = obj.percentExp + ' %';
            }
            else {
                document.querySelector(domStrings.percentExpLabel).textContent = '--';
            }

        }
    }

})();

// APP CONTROLLER
var appController = (function (budgetCtrl, UICtrl) {

    var input, domStrings, newItem, balanceInfo;

    domStrings = UICtrl.getDomStrings();


    var ctrlAddItem = function () {

        // 1. get input from user
        input = UICtrl.getInput();

        if (input.input_desc !== "" && !isNaN(input.input_val) && input.input_val > 0) {
            // 2. add new item to data structure
            newItem = budgetCtrl.addItem(input.inputType, input.input_desc, input.input_val);

            // 3. add new item to the UI
            UICtrl.addListItem(newItem, input.inputType);

            //4. clear input fields
            UICtrl.clearInputFields();

            // 6.update budget and get budget info
            budgetCtrl.updateBalanceInfo();
            balanceInfo = budgetCtrl.getBalanceInfo();

            // 7.update the UI
            UICtrl.displayBudget(balanceInfo);

        }
        else {
            console.warn("invalid input");
        }

    };

    var setupEventListeners = function () {

        document.querySelector(domStrings.add_btn).addEventListener('click', ctrlAddItem);
        document.addEventListener('keyup', function (event) {

            if (event.keyCode === 13) {
                ctrlAddItem();
            }
        });
    };

    return {
        init: function () {
            console.log('Application Started');
            setupEventListeners();
            UICtrl.displayBudget( {
                balance: 0,
                percentExp: 0,
                percentRem: 0,
                totalIncome: 0,
                totalExpenses: 0
            });
        }
    }


})(budgetController, UIController);

appController.init();