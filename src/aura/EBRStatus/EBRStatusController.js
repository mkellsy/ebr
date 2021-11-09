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

            if (data) {
                data.CustomerName = data.CustomerName.replace(/&#39;/gi, "'").replace(/&amp;/gi, "&");

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

            document.getElementById("status-layout").style.display = "block";
            document.getElementById("sales-rolling").style.display = "none";
            document.getElementById("sales-ytd").style.display = "none";
        });
    },

    getData: function(component, event, helper) {
        document.getElementById("loading-spinner").style.display = "block";

        _ebr.getJson("[APIToken]", component, "EBRGetTasks", "Parameters=" + encodeURIComponent("F:Filter1~V:" + component.get("v.customerId") + "~O:E"), "Pioneer", function (data) {
            if (!Array.isArray(data)) {
                data = [data];
            }

            component.set("v.taskData", data);
            document.getElementById("task-list").style.display = "block";

            if (document.getElementById("sales-report").style.display == "block") {
                document.getElementById("status-layout").style.display = "block";
                document.getElementById("sales-rolling").style.display = "none";
                document.getElementById("sales-ytd").style.display = "none";

                document.getElementById("loading-spinner").style.display = "none";
            }
        });

        _ebr.getJson("[APIToken]", component, "EBRSales", "Parameters=" + encodeURIComponent("F:Filter5~V:" + component.get("v.customerId") + "~O:E"), "Pioneer", function (data) {
            if (!Array.isArray(data)) {
                data = [data];
            }

            if (Array.isArray(data)) {
                for (var i = 0; i < data.length; i++) {
                    var last = data[i].CaseEquivs.length - 1;

                    data[i].LastYear = data[i].CaseEquivs[last - 1];
                    data[i].ThisYear = data[i].CaseEquivs[last];

                    delete data[i].CaseEquivs;

                    if (data[i].CaseEquivsPercentageDifference && data[i].CaseEquivsPercentageDifference.startsWith("(")) {
                        data[i].up = false;
                    } else {
                        data[i].up = true;
                    }

                    if (data[i].CaseEquivsPercentageDifference) {
                        data[i].CaseEquivsPercentageDifference = parseFloat(data[i].CaseEquivsPercentageDifference.replace("(", "").replace(")", "").replace("%", ""));
                    } else {
                        data[i].CaseEquivsPercentageDifference = 0;
                    }
                }
            }

            component.set("v.salesData", data);
            document.getElementById("sales-report").style.display = "block";

            if (document.getElementById("task-list").style.display == "block") {
                document.getElementById("status-layout").style.display = "block";
                document.getElementById("sales-rolling").style.display = "none";
                document.getElementById("sales-ytd").style.display = "none";

                document.getElementById("loading-spinner").style.display = "none";
            }
        });
    },

    rolling: function(component, event, helper) {
        document.getElementById("loading-spinner").style.display = "block";

        _ebr.getJson("[APIToken]", component, "EBRSalesRolling12Month", "Parameters=" + encodeURIComponent("F:Filter5~V:" + component.get("v.customerId") + "~O:E"), "Pioneer", function (data) {
            if (!Array.isArray(data)) {
                data = [data];
            }

            if (Array.isArray(data)) {
                for (var i = 0; i < data.length; i++) {
                    var last = data[i].CaseEquivs.length - 1;

                    data[i].LastYear = data[i].CaseEquivs[last - 1];
                    data[i].ThisYear = data[i].CaseEquivs[last];

                    delete data[i].CaseEquivs;

                    if (data[i].CaseEquivsPercentageDifference && data[i].CaseEquivsPercentageDifference.startsWith("(")) {
                        data[i].up = false;
                    } else {
                        data[i].up = true;
                    }

                    if (data[i].CaseEquivsPercentageDifference) {
                        data[i].CaseEquivsPercentageDifference = parseFloat(data[i].CaseEquivsPercentageDifference.replace("(", "").replace(")", "").replace("%", ""));
                    } else {
                        data[i].CaseEquivsPercentageDifference = 0;
                    }
                }
            }

            component.set("v.salesDataRolling", data);

            document.getElementById("status-layout").style.display = "none";
            document.getElementById("sales-rolling").style.display = "block";
            document.getElementById("sales-ytd").style.display = "none";

            document.getElementById("loading-spinner").style.display = "none";
        });
    },

    ytd: function(component, event, helper) {
        document.getElementById("loading-spinner").style.display = "block";

        _ebr.getJson("[APIToken]", component, "EBRSalesYTD", "Parameters=" + encodeURIComponent("F:Filter5~V:" + component.get("v.customerId") + "~O:E"), "Pioneer", function (data) {
            if (!Array.isArray(data)) {
                data = [data];
            }

            if (Array.isArray(data)) {
                for (var i = 0; i < data.length; i++) {
                    var last = data[i].CaseEquivs.length - 1;

                    data[i].LastYear = data[i].CaseEquivs[last - 1];
                    data[i].ThisYear = data[i].CaseEquivs[last];

                    delete data[i].CaseEquivs;

                    if (data[i].CaseEquivsPercentageDifference && data[i].CaseEquivsPercentageDifference.startsWith("(")) {
                        data[i].up = false;
                    } else {
                        data[i].up = true;
                    }

                    if (data[i].CaseEquivsPercentageDifference) {
                        data[i].CaseEquivsPercentageDifference = parseFloat(data[i].CaseEquivsPercentageDifference.replace("(", "").replace(")", "").replace("%", ""));
                    } else {
                        data[i].CaseEquivsPercentageDifference = 0;
                    }
                }
            }

            component.set("v.salesDataYtd", data);

            document.getElementById("status-layout").style.display = "none";
            document.getElementById("sales-rolling").style.display = "none";
            document.getElementById("sales-ytd").style.display = "block";

            document.getElementById("loading-spinner").style.display = "none";
        });
    }
})