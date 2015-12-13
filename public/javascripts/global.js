// Bill_ids data array for filling in info box
var bill_ids = [];
var committee_ids = [];

// DOM Ready =============================================================
$(document).ready(function() {

    populateTable();

    $('#billList table tbody').on('click', 'td a.linkshowbill', showBillInfo);

    $('#billList table tbody').on('click', 'td a.linkapibill', showBill);

    getBills();

});

// Functions =============================================================
function populateTable() {

    var tableContent = '';

    $.ajax({
        type: 'GET',
        url: 'http://congress.api.sunlightfoundation.com/upcoming_bills?apikey=838cd938cfb244a7a5728083f9191152'
    }).done(function(response) {

        var bills = response.results

        $.each(bills, function(){
            tableContent += '<tr>';
            tableContent += '<td><a href="#" class="linkshowbill" rel="' + this.bill_id + '">' + this.bill_id + '</a></td>';
            tableContent += '<td>' + (this.context || this.description) + '</td>';
            tableContent += '<td><a href="#" class="linkapibill" rel="' + this.bill_id + '">show</a></td>';
            tableContent += '</tr>';
        });

        $('#billList table tbody').html(tableContent);
    });
};

function getBills() {

    $.ajax({
        type: 'GET',
        url: 'http://congress.api.sunlightfoundation.com/upcoming_bills?apikey=838cd938cfb244a7a5728083f9191152'
    }).done(function(response) {

        var bills = response.results

        // console.log(bills)

        $.each(bills, function(){
            bill_ids.push(this.bill_id)
        });

        billKeywords(bill_ids)
    });
};

function billKeywords(upcoming_bills) {

    $.each(upcoming_bills, function(){
        var request = getUrl(this) 

        $.ajax({
            type: 'get',
            url: request
        }).done(function(response){
            // write full details
            var committee_list = response.results[0].committee_ids
            var data = getCommitteeName(committee_list)
            setCommitteeKeywords(data);
        })
    });
};


function getUrl(bill_id) {
    return 'http://congress.api.sunlightfoundation.com/bills?bill_id=' + bill_id + '&apikey=838cd938cfb244a7a5728083f9191152'
};

function getCommitteeUrl(committee_id) {
    return 'http://congress.api.sunlightfoundation.com/committees?committee_id=' + committee_id + '&apikey=838cd938cfb244a7a5728083f9191152'
}

function getCommitteeName(committee_list){
    for (var i = 0; i < committee_list.length; i++) {
        committee_ids.push(committee_list[i])
    }
    return committee_ids
}

function setCommitteeKeywords(committee_ids) {
    $.each(committee_ids, function(){
        var request = getCommitteeUrl(this) 

        $.ajax({
            type: 'get',
            url: request
        }).done(function(response){
            console.log(response.results[0].name)
        })
    });
}

// Show Bill Info
function showBillInfo(event) {

    // Prevent Link from Firing
    event.preventDefault();

    // Retrieve bill from link rel attribute
    var thisBillName = $(this).attr('rel');

    // Get Index of object based on id value
    var arrayPosition = billListData.map(function(arrayItem) { return arrayItem.title; }).indexOf(thisBillName);

    // Get our Bill Object
    var thisBillObject = billListData[arrayPosition];

    //Populate Info Box
    $('#billInfoTitle').text(thisBillObject.title);
    $('#billInfoDescription').text(thisBillObject.description);
    $('#billInfoId').text(thisBillObject.bill_id);

};

// Get Api
function showBill(event) {

    event.preventDefault();

    $.ajax({
        type: 'GET',
        url: 'http://congress.api.sunlightfoundation.com/upcoming_bills?apikey=838cd938cfb244a7a5728083f9191152'
    }).done(function( response ) {
        // debugger
        for (var i = 0; i < response.results.length; i ++){
            $('#api').append(response.results[i].bill_id + ' | ');
        }
        for (var i = 0; i < response.results.length; i ++){
            console.log(response.results[i])
            $('#json').append(response.results[i]);
        }
    });
};






