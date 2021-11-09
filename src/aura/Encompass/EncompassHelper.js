({
	sortBy: function(component, field) {
       /* var sortAsc = component.get("v.sortAsc");
        var sortField = component.get("v.sortField");
        var records = component.get("v.distributorList");
        
        console.log('sortAsc:>>'+sortAsc);
        console.log('sortField:>>'+sortField);
        console.log('records:>>'+records);
        
        sortAsc = field == sortField? !sortAsc: true;
        records.sort(function(a,b){
            var t1 = a[field] == b[field],
                t2 = a[field] > b[field];
            return t1? 0: (sortAsc?-1:1)*(t2?-1:1);
        });
        component.set("v.sortAsc", sortAsc);
        component.set("v.sortField", field);
        component.set("v.distributorList", records);*/
    }
})