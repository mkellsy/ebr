({
    getCustomersList : function(component, event, helper) {
        var evt = $A.get("e.Encompass:toggleSpinner");
        evt.fire();
        
        if(!component.get("v.prevSearchString")){
        	component.set("v.prevSearchString", '');
        }

        if(component.get("v.searchString") && component.get("v.searchString") != ""){
            var action  = component.get("c.getCustomers");
        	action.setParams({
            	"distributor":component.get("v.distributor"),
            	"searchString":component.get("v.searchString"),
        	});
        	action.setCallback(this, function(a) {            
            	var customerList = a.getReturnValue();
            	console.log('customerList:>>'+customerList);
            
            	if(customerList.length>0){
                	var StatusString = customerList[0].Status; 
                	var SearchString = component.get("v.searchString");
                	if(StatusString == 'APINotInstalled'){
                    	component.set("v.displayString", 'Required SalesForce APIs are not installed for Distributor ' + component.get("v.distributor"))
                    	component.set("v.showCustomers",false);
                	}else if(StatusString == 'VersionNotValid'){
                    	component.set("v.displayString", 'Version not valid')
                    	component.set("v.showCustomers",false);
                	}else if(SearchString){
                    	component.set("v.showCustomers",true);
                	}
                	else{
                    	component.set("v.showCustomers",false);
                    	component.set("v.displayString", 'Use Search to find desired Customer')
                	}  
            	}else{
                	component.set("v.showCustomers",false);
                	component.set("v.displayString", 'No Customers Matching Search Term were found')
            	}
            	component.set("v.customerCount",customerList.length);
            	component.set("v.customerList",customerList);
            	component.set("v.allCustomers",customerList);
            
            	var evt = $A.get("e.Encompass:toggleSpinner");
            	evt.fire();
            
        	});
        	$A.enqueueAction(action);
        }else{
        	component.set("v.showCustomers",false);
			component.set("v.displayString", 'Use Search to find desired Customer');
            evt = $A.get("e.Encompass:toggleSpinner");
        	evt.fire();
        }
	},
    
    /*searchCustomers : function(component, event, helper) {
        var searchStr = component.find("textsearch").get("v.value");
        console.log('searchStr>>'+searchStr);
        
        var allCustomers = component.get("v.allCustomers");
        var filteredCustomers = [];
        console.log('allCustomers>>'+allCustomers);
        
        for (var i = 0; i < allCustomers.length ; i++) {
            console.log('allCustomers[i].Customer>>'+allCustomers[i].Name);
            console.log('allCustomers[i].City>>'+allCustomers[i].City);
            console.log('allCustomers[i].State>>'+allCustomers[i].State);
            
            if (allCustomers[i].Name.toLowerCase().includes(searchStr.toLowerCase()) || allCustomers[i].City.toLowerCase().includes(searchStr.toLowerCase()) ||allCustomers[i].State.toLowerCase().includes(searchStr.toLowerCase())) {
                filteredCustomers.push(allCustomers[i]);
            }
        }
        component.set("v.customerCount",filteredCustomers.length);
        component.set("v.customerList",filteredCustomers);
    },*/
    
    searchCustomers : function(component, event, helper) {
        event.getParams().keyCode
        if(((event.getParams().keyCode > 47 && event.getParams().keyCode < 91)||event.getParams().keyCode ==8)&& component.get("v.searchString") != component.get("v.prevSearchString")){
            console.log('Key pressed in search:>> ' + event.getParams().keyCode);
            var locKey = component.get("v.keyDelay");
            clearTimeout(locKey);
            locKey = setTimeout(function(){
                clearTimeout(locKey);
                component.set("v.keyDelay", null);
                component.set("v.prevSearchString", component.get("v.searchString"));
               	component.getCust(component, event, helper);
            }, 1000)
            component.set("v.keyDelay", locKey);
            /*var evt = $A.get("e.Encompass:toggleSpinner");
            evt.fire();
            //var searchStr = component.find("textsearch").get("v.value");
            var searchStr = component.get("v.searchString");
            component.set("v.prevSearchString", searchStr)
            console.log('searchStr>>'+searchStr);
            var action  = component.get("c.getCustomers");
            action.setParams({
                "sessionId":component.get("v.sessionId"),
                "distributor":component.get("v.distributor"),
                "searchString":searchStr
            });
            
            action.setCallback(this, function(a) {            
                var customerList = a.getReturnValue();
                console.log('customerList:>>'+customerList);
                
                if(customerList.length>0){
                    component.set("v.showCustomers",true);   
                }else{
                    component.set("v.showCustomers",false);    
                }
                component.set("v.customerCount",customerList.length);
                component.set("v.customerList",customerList);
                component.set("v.allCustomers",customerList);
                
                var evt = $A.get("e.Encompass:toggleSpinner");
                evt.fire();
                
            });
            $A.enqueueAction(action);*/
        }
    },
    
    
    /*sortByName: function(component, event, helper) {
        helper.sortBy(component, "Customer");
    },
    */
    getCustomerDetails: function(component, event, helper) {
        //var customerCard = component.find("customerCard");
        //$A.util.addClass(customerCard,'highlight');
        
        var customerID = event.target.getAttribute("data-recId");
        var sessionId = component.get("v.sessionId");
        var searchStr = component.get("v.searchString");
        
        console.log("customerID:>>>"+customerID);
        console.log("sessionId:>>>"+sessionId);
        
        var evt = component.get("e.GetCustomerDetails");
        evt.setParams({ 
            "customerID": customerID,
            "showCustomerDetails":true,
            "searchString":searchStr
        });
        evt.fire();
    },
    
    goToDistributorList : function(component, event, helper) {
        var evt = $A.get("e.Encompass:toggleSpinner");
        evt.fire();
        
        console.log("ComponentList Controller Starts" );
        var evt = component.get("e.GoBackToDistributorList");
        evt.setParams({ 
            "showEncompassComp":true
        });
        evt.fire();
        
    },
    
    populatedetail: function(component, event, helper) {

        var selected = event.getParam("selectedCustomer");
        var customerID =event.getParam("customerID");
        var searchStr = component.get("v.searchString");
        
        console.log("customerID:>>>"+customerID);
        
        var evt = component.get("e.GetCustomerDetails");
        evt.setParams({ 
            "customerID": customerID,
            "showCustomerDetails":true,
            "searchString":searchStr
        });
        evt.fire();
  	}

})