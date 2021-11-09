public class CustomerDetailsComponentController {

	@auraEnabled
    public static CustomerWrapper getStoreDetails(string customerID, string distributor){
        CustomerWrapper customer = new CustomerWrapper();
        
        customer = getCustomer(distributor, customerId, true);

        return customer;
    }
    
    public static CustomerWrapper parseJSONResponse(string jsonStr){
        jsonStr = jsonStr.substring(jsonStr.indexOf('"Row":')+7);
        jsonStr = jsonStr.removeEnd('    }\r\n  }\r\n}');
        jsonStr = jsonStr.unescapeHtml4();
        CustomerWrapper customer = new CustomerWrapper();
        customer = (CustomerWrapper) JSON.deserialize(jsonStr,CustomerWrapper.class);   
        
        return customer;
    }
	

    public static CustomerWrapper getCustomer(string distributor, string customerId, boolean isFirstAttempt){
        
        CustomerWrapper customer = new CustomerWrapper();
        try{
            if(distributor != null || customerId != null){
                string url = EncAuth.getCustDetailStepAuth(distributor, customerId);  
                
                HttpRequest req = new HttpRequest();
                
                req.setMethod('GET');
				req.setEndpoint(url);

                Http http = new Http();

                HTTPResponse resp = http.send(req);
                
                Integer RetCode=resp.getStatusCode();
                
                if(RetCode==307){
                    Integer Count = 0;
                    while(RetCode==307 && Count < 25){
                        system.debug('Redirect Detected!');
                        url = resp.getHeader('Location');
                        req.setEndpoint(url);
                        resp = http.send(req);
                        RetCode = resp.getStatusCode();
                        Count++;
                    }
                }
                
                string jsonStr = resp.getBody();
                
                customer = parseJSONResponse(jsonStr);                    
            }
        }catch(exception ex){
            if(ex.getMessage() == 'Read timed out' && isFirstAttempt == true){
				customer = getCustomer(distributor, customerId, false);
            }
            
        }
        return customer;    
    }
}