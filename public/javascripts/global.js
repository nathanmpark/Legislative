// Bill_list data array for filling in info box
var billListData = [];

// DOM Ready =============================================================
$(document).ready(function() {

    // Populate the user table on initial page load
    populateTable();

    // Title link click
    $('#billList table tbody').on('click', 'td a.linkshowbill', showBillInfo);

    // Show Bill link click
    $('#billList table tbody').on('click', 'td a.linkapibill', showBill);

});

// Functions =============================================================

// Fill table with data
function populateTable() {

    // Empty content string
    var tableContent = '';

    // jQuery AJAX call for API JSON
    $.ajax({
        type: 'GET',
        url: 'http://congress.api.sunlightfoundation.com/upcoming_bills?apikey=838cd938cfb244a7a5728083f9191152'
    }).done(function(response) {

        var bills = response.results

        // For each item in our array of data, add a table row and cells to the content string
        $.each(bills, function(){
            tableContent += '<tr>';
            tableContent += '<td><a href="#" class="linkshowbill" rel="' + this.bill_id + '">' + this.bill_id + '</a></td>';
            tableContent += '<td>' + (this.context || this.description) + '</td>';
            tableContent += '<td><a href="#" class="linkapibill" rel="' + this.bill_id + '">show</a></td>';
            tableContent += '</tr>';

            // write db insert statement for each bill
            // db.upcoming_bills.insert(this)
        });

        // Inject the whole content string into our existing HTML table
        $('#billList table tbody').html(tableContent);

        var bill_ids = []

        $.each(bills, function(){
            bill_ids.push(this.bill_id)
        });

        billKeywords(bill_ids)
    });
};

function billKeywords(upcoming_bills) {

    committee_ids = []

    $.each(upcoming_bills, function(){
        var request = getUrl(this) 

        $.ajax({
            type: 'get',
            url: request
        }).done(function(response){

            var committee_list = response.results[0].committee_ids

            for (var i = 0; i < committee_list.length; i++) {
                committee_ids.push(committee_list[i])
            }
            console.log(committee_ids)

            return committee_ids
        })
    });
    console.log(committee_ids)
};

function getUrl(bill_id) {
    return 'http://congress.api.sunlightfoundation.com/bills?bill_id=' + bill_id + '&apikey=838cd938cfb244a7a5728083f9191152'
};

function getCommitteeUrl(committee_id) {
    return 'congress.api.sunlightfoundation.com/committees?committee_id=' + committee_id + '&apikey=838cd938cfb244a7a5728083f9191152'
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






