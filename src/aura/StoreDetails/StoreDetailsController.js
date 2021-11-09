({
	getCustomerDetails : function(component, event, helper) {
		
        console.log("getCustomerDetails Start:>>>");
        var evt = $A.get("e.Encompass:toggleSpinner");
        evt.fire();
        var action  = component.get("c.getStoreDetails");
        action.setParams({
                "sessionId":component.get("v.sessionId"),
            	"customerID":component.get("v.customerID"),
            	"distributor" : component.get("v.distributor")
        });
        
        action.setCallback(this, function(a) {            
            var customer = a.getReturnValue();
            
            console.log('customer:>>>>'+customer);
            console.log('customer Customer:>>>>'+customer.Customer);
            
            component.set("v.customer",customer);
            
            if(customer.Salesperson == 'None' || customer.Salesperson == null){
                var cmpTarget = component.find('chatTabId');
                $A.util.addClass(cmpTarget, 'hide');    
            }
            var evt = $A.get("e.Encompass:toggleSpinner");
        	evt.fire();
            
        });
        $A.enqueueAction(action);

        /*var vfOrigin = "https://encompass-dev-ed--c.na40.visual.force.com";
        window.addEventListener("message", function(event) {
            if(event.origin !== vfOrigin) {
                // Not the expected origin: Reject the message!
                return;
            }
            // Handle the message
            var action = component.get("v.wsMessages");
            action.push(event.data);
            console.log("action:>>"+action);
            
            component.set("v.wsMessages", action);
        }, false);*/
	},
    
    goToChatComponent : function(component, event, helper) {
        
		console.log("goToChatTab Start:>>>");
        //component.set("v.selectedTabId","chatTab");
        var evt = $A.get("e.Encompass:toggleSpinner");
        evt.fire();
        var evt = component.get("e.GoToChatDetails");
        evt.setParams({ 
            "customer":component.get("v.customer")
        });
        evt.fire();
        console.log("goToChatTab End:>>>");
    },
    
    goToCustomerList : function(component, event, helper) {
        
        console.log("goToCustomerList Start:>>>");
        var evt = $A.get("e.Encompass:toggleSpinner");
        evt.fire();
        var evt = component.get("e.GoBackToCustomerList");
        //var evt = $A.get("e.Encompass:GoBackToCustomerList");
        evt.setParams({ 
            "showCustomerDetails":false
        });
        evt.fire();
        console.log("goToCustomerList End:>>>");
    }
    /*,
    
    sendMessage : function(component, event, helper) {
        var msg = {
            name: "General",
            value: component.get("v.messageToSend")
        };
        component.find("WebSocketApp").message(msg);
    },
    
    handleMessage: function(component, message, helper) {
        var payload = message.payload;
        var name = payload.name;
        if (name === "General") {
            var value = payload.value;
            component.set("v.messageReceived", value);
        }
        else if (name === "Foo") {
            // A different response
        }
    },
    
    handleError : function(component, event, helper) {
        
    }*/

    /*sendToVF : function(component, event, helper) {
        var message = component.get("v.messageToSend");
        var wsMessage = component.get("v.wsMessages");
        wsMessage.push(message);
        component.set("v.wsMessages",wsMessage);
        
        var vfOrigin = "https://encompass-dev-ed--c.na40.visual.force.com";
        var vfWindow = component.find("vfFrame").getElement().contentWindow;
        vfWindow.postMessage(message, vfOrigin);
        component.set("v.messageToSend",'');
    }*/
    })