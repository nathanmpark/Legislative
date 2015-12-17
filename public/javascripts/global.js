//***** GLOBAL JS ******

//---------
//PRE DOCUMENT-LOAD METHODS
getBills();

//DOCUMENT READY METHODS
$(document).ready(function() {

});





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

function getBills() {
    $.ajax({
        type: 'GET',
        url: getUpcomingUrl()
    }).done(function(response) {
        var bills = response.results
        // these functions are in the .done due to the asynchronous nature of Javascript
        getFloorUpdates(bills)
        // getBillDetails is taking an array of bill ids to hit the /bills api
        getBillDetails(bills)
    }).fail(function(error){
        console.log(error)
    })
};

function getFloorUpdates(bills) {
    $.each(bills, function(){
        $.ajax({
            type: 'get',
            url: getFloorUpdatesUrl(this.bill_id)
        }).done(function(response){
            populateFloorUpdates(response)
        }).fail(function(error){
            console.log(error)
        });
    });
};

function populateFloorUpdates(api_response) {
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
    $.each(bills, function(i){
        $.ajax({
            type: 'GET',
            url: getBillUrl(this.bill_id)
        }).done(function(response){
            if(response.results && response.results.length > 0){
                setCommittee(response, bills[i]);
            } else {
                console.log('Bill not found', getBillUrl(this));
            }
        }).fail(function(error){
            console.log(error)
        })
    });
};

function setCommittee(detailed_bill_obj, upcoming_bill_obj) {
    var committee_ids = detailed_bill_obj.results[0].committee_ids
    $.each(committee_ids, function(){
        $.ajax({
            type: 'get',
            url: getCommitteeUrl(this)
        }).done(function(response){
            var bill = {}
            var bill_obj = detailed_bill_obj.results[0];
            var committee_id = response.results[0].committee_id
            var committee_name = response.results[0].name

            // debugger
            bill['bill_id'] = bill_obj.bill_id;
            bill['official_title'] = bill_obj.official_title;
            bill['short_title'] = bill_obj.short_title;
            bill['committee_id'] = committee_id;
            bill['committee_name'] = committee_name;
            bill['congress'] = bill_obj.congress;
            bill['description'] = upcoming_bill_obj['description'];
            bill['chamber'] = bill_obj.chamber;
            bill['url_congress'] = bill_obj.urls.congress;
            bill['url_govtrack'] = bill_obj.urls.govtrack;
            bill['url_opencongress'] = bill_obj.urls.opencongress;
            bill['intro_date'] = bill_obj.introduced_on;
            bill['last_action_date'] = bill_obj.last_action_at;
            bill['last_version_date'] = bill_obj.last_version_on;
            bill['active'] = bill_obj.history.active;
            bill['active_at'] = bill_obj.history.active_at;
            bill['awaiting_signature'] = bill_obj.history.awaiting_signature;
            bill['enacted'] = bill_obj.history.enacted;
            bill['senate_passage_result'] = bill_obj.history.senate_passage_result;
            bill['senate_passage_result_at'] = bill_obj.history.senate_passage_result_at;
            bill['vetoed'] = bill_obj.history.vetoed;

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

