// Bill_list data array for filling in info box
var billListData = [];

// DOM Ready =============================================================
$(document).ready(function() {

    // Populate the user table on initial page load
    populateTable();

    // Title link click
    $('#billList table tbody').on('click', 'td a.linkshowbill', showBillInfo);

    // Add Bill button click
    $('#btnAddBill').on('click', addBill);

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
    }).done(function( response ) {

        var bills = response.results

        // For each item in our array of data, add a table row and cells to the content string
        $.each(bills, function(){
            tableContent += '<tr>';
            tableContent += '<td><a href="#" class="linkshowbill" rel="' + this.bill_id + '">' + this.bill_id + '</a></td>';
            tableContent += '<td>' + (this.context || this.description) + '</td>';
            tableContent += '<td><a href="#" class="linkapibill" rel="' + this.bill_id + '">show</a></td>';
            tableContent += '</tr>';
        });

        // Inject the whole content string into our existing HTML table
        $('#billList table tbody').html(tableContent);
    });
};

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

// Add User
function addBill(event) {
    event.preventDefault();

    // Super basic validation - increase errorCount variable if any fields are blank
    var errorCount = 0;
    $('#addBill input').each(function(index, val) {
        if($(this).val() === '') { errorCount++; }
    });

    // Check and make sure errorCount's still at zero
    if(errorCount === 0) {

        // If it is, compile all user info into one object
        var newBill = {
            'title': $('#addBill fieldset input#inputBillTitle').val(),
            'description': $('#addBill fieldset input#inputBillDescription').val(),
            'bill_id': $('#addBill fieldset input#inputBillId').val(),
        }

        // Use AJAX to post the object to our adduser service
        $.ajax({
            type: 'POST',
            data: newBill,
            url: '/bills/add_bill',
            dataType: 'JSON'
        }).done(function( response ) {

            // Check for successful (blank) response
            if (response.msg === '') {

                // Clear the form inputs
                $('#addBill fieldset input').val('');

                // Update the table
                populateTable();

            }
            else {

                // If something goes wrong, alert the error message that our service returned
                alert('Error: ' + response.msg);

            }
        });
    }
    else {
        // If errorCount is more than 0, error out
        alert('Please fill in all fields');
        return false;
    }
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






