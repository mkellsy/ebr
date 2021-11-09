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
        });
    },

    getData: function(component, event, helper) {
        _ebr.getJson("[APIToken]", component, "EBRMarketAnalysis", "CustomerID=" + component.get("v.customerId") + "&SupplierID=7&Month=" + (new Date().getMonth() + 1) + "&Longitude=" + component.get("v.longitude") + "&Latitude=" + component.get("v.latitude"), "Pioneer", function (data) {
            if (Array.isArray(data.SuggestedDistributionData)) {
                data = data.SuggestedDistributionData;
            } else {
                data = [data.SuggestedDistributionData];
            }

            if (Array.isArray(data)) {
                for (let i = 0; i < data.length; i++) {
                    data[i].TotalCases = Math.round(data[i].TotalCases * 100) / 100;
                    data[i].AvgCasesPerBuyerPerMonth = Math.round(data[i].AvgCasesPerBuyerPerMonth * 100) / 100;
                    data[i].MarketShare = Math.round(data[i].MarketShare * 100);
                }
            }

            component.set("v.marketData", data);

            document.getElementById("market-report").style.display = "block";
            document.getElementById("report-layout").style.display = "block";
            document.getElementById("loading-spinner").style.display = "none";
        });
    },

    newOrder: function(component, event, helper) {
        document.getElementById("loading-spinner").style.display = "block";
        document.getElementById("report-layout").style.display = "none";
        document.getElementById("order-layout").style.display = "none";

        const productId = event.target.id;

        _ebr.getJson("[APIToken]", component, "EBRGetProduct", "Parameters=F:Filter1~V:" + productId + "~O:E", "Pioneer", function (data) {
            if (Array.isArray(data)) {
                data = data[0];
            }

            data.ProductName = data.ProductName.replace(/&#39;/gi, "'").replace(/&amp;/gi, "&");
            data.MobileLink = data.MobileLink.replace(/\{\{CustomerID\}\}/gi, component.get("v.customerId")).replace(/\{\{TaskID\}\}/gi, "").replace(/\{\{ProductID\}\}/gi, productId);

            component.set("v.productData", data);
            component.find("numUnits").set("v.value", "");
            component.find("detail").set("v.value", "");

            document.getElementById("report-layout").style.display = "none";
            document.getElementById("order-layout").style.display = "block";
            document.getElementById("loading-spinner").style.display = "none";
        });
    },

    sendOrder: function(component, event, helper) {
        document.getElementById("loading-spinner").style.display = "block";
        document.getElementById("report-layout").style.display = "none";
        document.getElementById("order-layout").style.display = "none";

        const productData = component.get("v.productData");

        const task = {
            CustomerID: component.get("v.customerId"),
            TaskTitle: "New Order from Brewery Rep",
            TaskDetail: "Product: " + productData.ProductID + " " + productData.ProductName + ", Quantity: " + component.find("numUnits").get("v.value") + "\n<a href='" + productData.MobileLink + "'>Go To Invoice</a>\n\n" + component.find("detail").get("v.value")
        };

        _ebr.getJson("[APIToken]", component, "EBRGetSalesman", "Filter1=" + task.CustomerID, "Pioneer", function (data) {
            task.AssignToUserID = parseInt((Array.isArray(data) ? data[0].SalesmanUserID : data.SalesmanUserID));

            if (task.AssignToUserID && !isNaN(task.AssignToUserID) && task.AssignToUserID > 0) {
                _ebr.postJson("[APIToken]", component, "EBRNewTask", "", "Pioneer", task, function (data) {

                    /*
                    if (data.Status != "Success") {
                        if (data.StatusDescription && data.StatusDescription != "") {
                            alert(data.StatusDescription);
                        } else {
                            alert("Unable to send order.");
                        }
                    }
                    */

                    component.find("numUnits").set("v.value", "");
                    component.set("v.productData", {});

                    document.getElementById("report-layout").style.display = "block";
                    document.getElementById("order-layout").style.display = "none";
                    document.getElementById("loading-spinner").style.display = "none";
                });
            }
        });
    },

    cancelOrder: function(component, event, helper) {
        component.find("numUnits").set("v.value", "");
        component.set("v.productData", {});

        document.getElementById("report-layout").style.display = "block";
        document.getElementById("order-layout").style.display = "none";
    }
})
