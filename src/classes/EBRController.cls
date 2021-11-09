public with sharing class EBRController {

    @auraEnabled
    public static string getJson(token, string command, string query, string distributor) {
        return getJson(token, command, query, distributor, true);
    }

    public static string getJson(string token, string command, string query, string distributor, boolean isFirstAttempt) {
        string result = '{}';
        string url = 'https://api.encompass8.com/api';

        url += '?APIToken=' + token;
        url += '&EncompassID=' + distributor;
        url += '&APICommand=' + command;

        if (query != '') {
            url += '&' + query;
        }

        try {
            HttpRequest request = new HttpRequest();
                
            request.setMethod('GET');
            request.setEndpoint(url);

            Http http = new Http();
            HTTPResponse response = http.send(request);
                
            Integer status = response.getStatusCode();
                
            if (status == 307) {
                Integer count = 0;
                
                while (status == 307 && count <= 10) {
                    url = response.getHeader('Location');

                    request.setEndpoint(url);

                    response = http.send(request);
                    status = response.getStatusCode();

                    count += 1;
                }
            }
                
            result = response.getBody();
        } catch (exception ex) {
            if (ex.getMessage() == 'Read timed out' && isFirstAttempt == true) {
                result = getJson(token, command, query, distributor, false);
            }
        }

        return result;
    }

    @auraEnabled
    public static string postJson(string token, string command, string query, string distributor, string data) {
        return postJson(token, command, query, distributor, data, true);
    }

    public static string postJson(string token, string command, string query, string distributor, string data, boolean isFirstAttempt) {
        string result = '{}';
        string url = 'https://api.encompass8.com/api';

        url += '?APIToken=' + token;
        url += '&EncompassID=' + distributor;
        url += '&APICommand=' + command;

        if (query != '') {
            url += '&' + query;
        }

        try {
            HttpRequest request = new HttpRequest();
                
            request.setMethod('POST');
            request.setHeader('content-type', 'application/json');
            // request.setHeader('Accept', 'text/html');
            request.setEndpoint(url);
            request.setBody(data);

            Http http = new Http();
            HTTPResponse response = http.send(request);
                
            Integer status = response.getStatusCode();
                
            if (status == 307) {
                Integer count = 0;
                
                while (status == 307 && count <= 10) {
                    url = response.getHeader('Location');

                    request.setEndpoint(url);

                    response = http.send(request);
                    status = response.getStatusCode();

                    count += 1;
                }
            }
                
            // result = response.getBody();
        } catch (exception ex) {
            if (ex.getMessage() == 'Read timed out' && isFirstAttempt == true) {
                result = postJson(token, command, query, distributor, data, false);
            }
        }

        return result;
    }
}
