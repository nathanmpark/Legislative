//***** GLOBAL JS ******

//---------
//PRE DOCUMENT-LOAD METHODS
getBills();

//DOCUMENT READY METHODS
$(document).ready(function() {
    getUpcomingBills();


    $('body').scrollspy({ target: '.navbar' });
    $('.chart-link').on('click', function(e){
        console.log("Stopping Click");
        e.preventDefault();

        var hash = this.hash;

        $('html, body').animate({
            scrollTop: $(hash).offset().top
        }, 800, function(){
            window.location.hash = hash;
        });
    });
    cover_hide();
    navbar_fade($);
});

//***** UX FUNCTIONS *****
function navbar_fade(object){
    // $(document).ready(function(){
    //     $('.navbar').hide();
    // });

    $(function() {
        $(window).scroll(function(){
            if ($(this).scrollTop() <= 2) {
                $('.navbar').fadeIn();
            } else {
                $('.navbar').fadeOut();
            };
        });
    });
}//#navbar_fade END

function cover_hide(){
    $('.cover').on('click', function(e){
        e.preventDefault();
        $('.cover').hide();
    });
}


//***** API CALL FUNCTIONS *****
function getBillUrl(bill_id) {
    return 'https://congress.api.sunlightfoundation.com/bills?bill_id=' + bill_id + '&apikey=838cd938cfb244a7a5728083f9191152';
};

function getCommitteeUrl(committee_id) {
    return 'https://congress.api.sunlightfoundation.com/committees?committee_id=' + committee_id + '&apikey=838cd938cfb244a7a5728083f9191152';
}

function getSessionUrl(congressional_session) {
    return 'https://congress.api.sunlightfoundation.com/bills?congress=' + congressional_session + '&apikey=838cd938cfb244a7a5728083f9191152';
}

function getUpcomingUrl(){
    return 'https://congress.api.sunlightfoundation.com/upcoming_bills?apikey=838cd938cfb244a7a5728083f9191152';
}

function getFloorUpdatesUrl(bill_id){
    return 'https://congress.api.sunlightfoundation.com/floor_updates?bill_ids=' + bill_id + '&apikey=838cd938cfb244a7a5728083f9191152'
}

function getUpcomingBills() {
    $.ajax({
        type: 'GET',
        url: getUpcomingUrl()
    }).done(function(response){
        var current_session = response.results[0].congress
        getSessionBills(current_session)
    }).fail(function(error){
        console.log(error)
    });
};

function getSessionBills(session){
    $.ajax({
        type: 'GET',
        url: getSessionUrl(session)
    }).done(function(response){
        if(response.results && response.results.length > 0){
            var committee_list = response.results[0].committee_ids
            setCommittee(response, committee_list);
        } else {
            console.log('Bill not found', getBillUrl(this));
        }
    }).fail(function(error){
        console.log(error)
    });
};

function getBills() {
    var bill_ids = [];

    $.ajax({
        type: 'GET',
        url: getUpcomingUrl()
    }).done(function(response) {
        var bills = response.results
        $.each(bills, function(){
            bill_ids.push(this.bill_id)
        });
        getFloorUpdates(bill_ids)
        // billCommittees is in the .done due to the asynchronous nature of Javascript
        getBillDetails(bill_ids)
    }).fail(function(error){
        console.log(error)
    })
};

function getFloorUpdates(bills) {
    $.each(bills, function(){
        $.ajax({
            type: 'get',
            url: getFloorUpdatesUrl(this)
        }).done(function(response){
            populateFloorUpdates(response)
        }).fail(function(error){
            console.log(error)
        });
    });
};

function populateFloorUpdates(api_response) {
    console.log("Populating Table");
    console.log(api_response);
    var tableContent = '';
    var bills = api_response.results;

    $.each(bills, function(){
        tableContent += '<tr>';
        tableContent += '<td>' + this.timestamp + '</td>';
        tableContent += '<td>' + this.bill_ids[0] + '</td>';
        tableContent += '<td>' + this.chamber + '</td>';
        tableContent += '<td>' + this.update + '</td>';
        tableContent += '</tr>';
    });

    $('#billList table tbody').html(tableContent);
};

function getBillDetails(bills) {
    $.each(bills, function(){
        $.ajax({
            type: 'get',
            url: getBillUrl(this)
        }).done(function(response){
            if(response.results && response.results.length > 0){
                var committee_list = response.results[0].committee_ids
                setCommittee(response, committee_list);
            } else {
                console.log('Bill not found', getBillUrl(this));
            }
        }).fail(function(error){
            console.log(error)
        })
    });
};

function setCommittee(bill_obj, committee_ids) {
    $.each(committee_ids, function(){
        var request = getCommitteeUrl(this)

        $.ajax({
            type: 'get',
            url: request
        }).done(function(response){
            var bill = {}
            var extractable_bill_obj = bill_obj.results[0];
            var committee_id = response.results[0].committee_id
            var committee_name = response.results[0].name

            bill['bill_id'] = extractable_bill_obj.bill_id;
            bill['committee_id'] = committee_id;
            bill['committee_name'] = committee_name;
            bill['congress'] = extractable_bill_obj.congress;
            bill['chamber'] = extractable_bill_obj.chamber;
            bill['url_congress'] = extractable_bill_obj.urls.congress;
            bill['url_govtrack'] = extractable_bill_obj.urls.govtrack;
            bill['url_opencongress'] = extractable_bill_obj.urls.opencongress;
            bill['intro_date'] = extractable_bill_obj.introduced_on;
            bill['last_action_date'] = extractable_bill_obj.last_action_at;
            bill['last_version_date'] = extractable_bill_obj.last_version_on;
            bill['history'] = extractable_bill_obj.history;

            addBill(bill);
        }).fail(function(error){
            console.log(error)
        });
    });
}

function addBill(bill) {
    $.ajax({
        type: 'POST',
        data: bill,
        url: '/bills/add_bill',
        dataType: 'JSON'
    }).done(function(response){
        console.log(response)
    }).fail(function(error){
        console.log(error)
    })
};



//*** TEST FUNCTION TO SEED DB ***

// function seed_session(){
//     var simple_url = "https://congress.api.sunlightfoundation.com/bills?congress=114&per_page=50&apikey=838cd938cfb244a7a5728083f9191152";

//     var base_url = "https://congress.api.sunlightfoundation.com/bills?congress=114&per_page=50&page=";
//     var api_key = "&apikey=838cd938cfb244a7a5728083f9191152"

//     console.log('simple url launch:');
//     //Get total bills
//     $.ajax({
//         type: 'GET',
//         url: simple_url,
//         dataType: 'JSON'
//     }).done(function(response){
//         var total_calls = getTotalBills(response);

//         var base_url = "https://congress.api.sunlightfoundation.com/bills?congress=114&per_page=50&page=";
//         var api_key = "&apikey=838cd938cfb244a7a5728083f9191152"

//         for(var i = 1; i <= total_calls; i++) {
//             var full_url = base_url + i.toString() + api_key;
//             $.ajax({
//                 type: 'GET',
//                 url: full_url,
//                 dataType: 'JSON'
//             }).done(function(response){
//                 loopBillPage(response.results);
//             });
//         };


//     });
// };

// function getTotalBills(response){
// //Gets the total bills from an object and returns the number of api calls needed to acquire all bills
//     var bills = response.count;
//     return Math.floor(bills/50) + 1;
// };

// function loopBillPage(bill_array){
// //Loops through each json object of 50 bills
//     for (var i = 0; i < bill_array.length; i++){
//         add_oneonethree_bill(bill_array[i]);
//     };
// };


// function add_oneonethree_bill(bill_obj){
// // Hit '/seed_bills' Post route and add bill to database
//     console.log("Sending Request");
//     $.ajax({
//         type: 'POST',
//         url: '/bills/seed_bills',
//         data: bill_obj
//     }).done(function(response){
//         console.log(response);
//     })
// }

// //Get total bills
// //Divide total by 50
// //Use a counter to iterate through each page
// //Iterate through each page and save items to dbs




