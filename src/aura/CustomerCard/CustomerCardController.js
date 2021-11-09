({
    select : function(component, event, helper) {
        var customerCard = component.find("customerCard");
        $A.util.addClass(customerCard,'highlight');
        
        var customerID = event.target.getAttribute("data-recId");
        var customer = component.get("v.cust");
        var selectEvent = $A.get("e.Encompass:selectCustomer");
        selectEvent.setParams({ "selectedCustomer": customer,"customerID":customerID });
        selectEvent.fire();
    }
})