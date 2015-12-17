$(document).ready(function(){
    console.log("Seeding Database");
    console.log("Running /seed_session()");
    seed_session();
})


function seed_session(){
    var simple_url = "https://congress.api.sunlightfoundation.com/bills?congress=114&per_page=50&apikey=838cd938cfb244a7a5728083f9191152";

    var base_url = "https://congress.api.sunlightfoundation.com/bills?congress=114&per_page=50&page=";
    var api_key = "&apikey=838cd938cfb244a7a5728083f9191152"

    console.log('simple url launch:');
    //Get total bills
    $.ajax({
        type: 'GET',
        url: simple_url,
        dataType: 'JSON'
    }).done(function(response){
        var total_calls = getTotalBills(response);

        var base_url = "https://congress.api.sunlightfoundation.com/bills?congress=114&per_page=50&page=";
        var api_key = "&apikey=838cd938cfb244a7a5728083f9191152"

        for(var i = 1; i <= total_calls; i++) {
            var full_url = base_url + i.toString() + api_key;
            $.ajax({
                type: 'GET',
                url: full_url,
                dataType: 'JSON'
            }).done(function(response){
                loopBillPage(response.results);
            });
        };


    });
};

function getTotalBills(response){
//Gets the total bills from an object and returns the number of api calls needed to acquire all bills
    var bills = response.count;
    return Math.floor(bills/50) + 1;
};

function loopBillPage(bill_array){
//Loops through each json object of 50 bills
    for (var i = 0; i < bill_array.length; i++){
        add_oneonethree_bill(bill_array[i]);
    };
};


function add_oneonethree_bill(bill_obj){
// Hit '/seed_bills' Post route and add bill to database
    console.log("Sending Request");
    $.ajax({
        type: 'POST',
        url: '/bills/seed_bills',
        data: bill_obj
    }).done(function(response){
        console.log(response);
    })
}

//Get total bills
//Divide total by 50
//Use a counter to iterate through each page
//Iterate through each page and save items to dbs

