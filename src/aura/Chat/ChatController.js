({
	getChatMessages : function(component, event, helper) {
		var vfOrigin = "https://encompass-dev-ed--c.na40.visual.force.com";
        window.addEventListener("message", function(event) {
            if(event.origin !== vfOrigin) {
                // Not the expected origin: Reject the message!
                return;
            }
            // Handle the message
            var action = component.get("v.wsMessages");
            action.push(event.data);
            console.log("action:>>"+action);
            //alert("action length:>>"+action.length);

            //alert(action[action.length-2]);
            
            //component.set("v.recentMessage", action[action.length-2]);
            component.set("v.wsMessages", action);
        }, false);
	},
    
     sendToVF : function(component, event, helper) {
        var message = component.get("v.messageToSend");
        var wsMessage = component.get("v.wsMessages");
        wsMessage.push(message);
        component.set("v.wsMessages",wsMessage);
        
        var vfOrigin = "https://encompass-dev-ed--c.na40.visual.force.com";
        var vfWindow = component.find("vfFrame").getElement().contentWindow;
        vfWindow.postMessage(message, vfOrigin);
        component.set("v.messageToSend",'');
    },
    
    goToCustomerDetails : function(component, event, helper){
        var wsMsg = component.get("v.wsMessages");
        var recentMessage = wsMsg[wsMsg.length-2];

        var evt = component.get("e.GoBackToStoreDetails");
        evt.setParams({
            "recentMsg":recentMessage
        });
        evt.fire();

        var evt = $A.get("e.Encompass:toggleSpinner");
        evt.fire();
    }
})