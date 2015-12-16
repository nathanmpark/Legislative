//***** GLOBAL JS ******

//---------
//PRE DOCUMENT-LOAD METHODS
getBills();

//DOCUMENT READY METHODS
$(document).ready(function() {
    getUpcomingBills();

});

//***** FUNCTIONS *****
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

function getUpcomingBills() {
    $.ajax({
        type: 'GET',
        url: getUpcomingUrl()
    }).done(function(response){
        console.log(response)
    }).fail(function(error){
        console.log(error)
    });
};

function getSessionBills(session){
    $.ajax({
        type: 'GET',
        url: getSessionUrl(session)
    }).done(function(response){
        console.log(response)
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
        // billCommittees is in the .done due to the asynchronous nature of Javascript
        getBillDetails(bill_ids)
    }).fail(function(error){
        console.log(error)
    })
};

function getBillDetails(bills) {
    $.each(bills, function(){
        $.ajax({
            type: 'get',
            url: getBillUrl(this)
        }).done(function(response){
            console.log(response)
            if(response.results && response.results.length > 0){
                var committee_list = response.results[0].committee_ids
                setCommittee(response, committee_list);
            } else {
                console.log('Bill not found', request);
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









