({
	getDistributorsList : function(component, event, helper) {
		var action  = component.get("c.getDistributors");
		action.setCallback(this, function(a) {            
			console.log('Here is the json: '+action.getReturnValue())
			var distributorList = a.getReturnValue();
            console.log('distributorList:>>'+distributorList);
			if(distributorList.length>0){
				component.set("v.showDistributors",true);
			}else{
				component.set("v.showDistributors",false);    
			}
			component.set("v.distributorCount",distributorList.length);
			component.set("v.distributorList",distributorList);
			component.set("v.allDistributors",distributorList);
                
			var evt = $A.get("e.Encompass:toggleSpinner");
				evt.fire();
            });
            $A.enqueueAction(action);
    },
    
    searchDistributors : function(component, event, helper) {
        var searchStr = component.find("textsearch").get("v.value");
        console.log('searchStr>>'+searchStr);
        
        var allDistributors = component.get("v.allDistributors");
        var filteredDistributors = [];
        
        for (var i = 0; i < allDistributors.length ; i++) {
            if (allDistributors[i].Name.toLowerCase().includes(searchStr.toLowerCase()) || allDistributors[i].City.toLowerCase().includes(searchStr.toLowerCase()) ||allDistributors[i].State.toLowerCase().includes(searchStr.toLowerCase())) {
                filteredDistributors.push(allDistributors[i]);
            }
        }
        component.set("v.distributorCount",filteredDistributors.length);
        component.set("v.distributorList",filteredDistributors);
    },
    
    getCustomers : function(component, event, helper) {
        var distributor = event.target.getAttribute("data-recId");
        
        var evt = component.get("e.GetCustomerList");
        evt.setParams({ 
            "distributor": distributor,
            "showEncompassComp":false
        });
        evt.fire();
    }
    /*sortByName: function(component, event, helper) {
        helper.sortBy(component, "Name");
    }*/
})