({
    handleEvent : function(component, event, helper) {
        console.log("handleEvent:>>");
        component.set("v.sessionId",event.getParam("sessionId"));
		component.set("v.distributor",event.getParam("distributor")); 
        component.set("v.showEncompassComp",event.getParam("showEncompassComp"));
    },
    handleEvent1 : function(component, event, helper) {
        console.log("handleEvent1:>>");
        console.log("sessionId:>>"+event.getParam("sessionId"));
        console.log("customerID:>>"+event.getParam("customerID"));
        console.log("showCustomerDetails:>>"+event.getParam("showCustomerDetails"));
        console.log("searchString:>>"+event.getParam("searchString"));
        
        component.set("v.sessionId",event.getParam("sessionId"));
        component.set("v.customerID",event.getParam("customerID"));   
        component.set("v.showCustomerDetails",event.getParam("showCustomerDetails")); 
        component.set("v.searchString",event.getParam("searchString")); 
    },
    
    handleEvent2 : function(component, event, helper) {
        console.log("handleEvent2:>>");
        var evt = $A.get("e.Encompass:toggleSpinner");
        evt.fire();
        component.set("v.showCustomerDetails",event.getParam("showCustomerDetails"));
    },
    
    handleEvent3 : function(component, event, helper) {
        console.log("handleEvent3:>>");
        component.set("v.searchString",""); 
        component.set("v.showEncompassComp",event.getParam("showEncompassComp"));
    },
    
    GoToChatDetails : function(component, event, helper) {
        console.log("GoToChatDetails:>>");
        console.log('showEncompassComp:>>'+component.set("v.showEncompassComp"));
        console.log('showCustomerDetails:>>'+component.set("v.showCustomerDetails"));
        console.log('showChatDetails:>>'+component.set("v.showChatDetails"));
        
        component.set("v.customer",event.getParam("customer"));
        //component.set("v.showEncompassComp",false);
        //component.set("v.showCustomerDetails",false);
        component.set("v.showChatDetails",true);
    },
    
    GoBackToStoreDetails :function(component, event, helper) {
    	component.set("v.recentMsg",event.getParam("recentMsg"));
        component.set("v.activeTabId","chatTab");
        component.set("v.showCustomerDetails",true);
        component.set("v.showChatDetails",false);
	},
    
    toggleSpinner : function(component, event, helper){
        console.log('Toggle 1');
        var toggleText = component.find("spinner");
        $A.util.toggleClass(toggleText,'toggle');
        console.log('Toggle 2');
    }
})