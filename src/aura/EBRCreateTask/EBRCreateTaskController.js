({
	load: function(component, event, helper) {
		const account = component.get("v.account");

        document.getElementById("loading-spinner").style.display = "block";

        _ebr.getJson("[APIToken]", component, "EBRGetCustomer", "Parameters=F:Filter1~V:" + encodeURIComponent(account.Name + account.BillingCity + account.BillingState) + "~O:LIKE", "Pioneer", function (data) {
            if (Array.isArray(data)) {
                for (let i = 0; i < data.length; i++) {
                    if (data[i].CustomerName.replace(/&#39;/gi, "'").replace(/&amp;/gi, "&") + data[i].City + data[i].State === account.Name + account.BillingCity + account.BillingState) {
                        data = data[i];
                        break;
                    }
                }

                if (Array.isArray(data)) {
                    data = null;
                }
            }

            data.CustomerName = data.CustomerName.replace(/&#39;/gi, "'").replace(/&amp;/gi, "&");

            if (data) {
                component.set("v.customerId", data.CustomerID);
                component.set("v.customerName", data.CustomerName);
                component.set("v.customerPhone", data.CustomerPhone);

                component.set("v.address", data.Address);
                component.set("v.city", data.City);
                component.set("v.dtate", data.State);
                component.set("v.postalCode", data.PostalCode);

                component.set("v.longitude", data.Longitude);
                component.set("v.latitude", data.Latitude);

                component.set("v.salesmanName", data.SalesmanName);
                component.set("v.salesmanPhone", data.SalesmanPhone);
            }

            document.getElementById("loading-spinner").style.display = "none";
            document.getElementById("new-task-form").style.display = "block";
            document.getElementById("success-message").style.display = "none";
        });
	},

    submit: function(component, event, helper) {
    	const task = {
            CustomerID: component.get("v.customerId"),
            TaskTitle: component.find("title").get("v.value"),
            TaskDetail: component.find("detail").get("v.value")
        };

        task.CustomerID = parseInt(task.CustomerID);
        task.TaskDetail = (task.TaskDetail ? task.TaskDetail : "");

        if (task.TaskTitle && !isNaN(task.CustomerID)) {
            _ebr.getJson("[APIToken]", component, "EBRGetSalesman", "Filter1=" + task.CustomerID, "Pioneer", function (data) {
                document.getElementById("loading-spinner").style.display = "block";
                document.getElementById("new-task-form").style.display = "none";
                document.getElementById("success-message").style.display = "none";

                task.AssignToUserID = parseInt((Array.isArray(data) ? data[0].SalesmanUserID : data.SalesmanUserID));

                if (task.AssignToUserID && !isNaN(task.AssignToUserID) && task.AssignToUserID > 0) {
                    _ebr.postJson("[APIToken]", component, "EBRNewTask", "", "Pioneer", task, function (data) {
                        document.getElementById("loading-spinner").style.display = "none";
                        document.getElementById("new-task-form").style.display = "none";
                        document.getElementById("success-message").style.display = "block";

                        /*
                        if (data.Status != "Success") {
                            if (data.StatusDescription && data.StatusDescription != "") {
                                alert(data.StatusDescription);
                            } else {
                                alert("Unable to save task.");
                            }
                        }
                        */

                    });
                }
            });
        } else if (isNaN(data.CustomerID)) {
        	alert("Customer doesn't exist at distributor.")
        } else {
        	alert("Please enter a Title.");
        }
    }
})