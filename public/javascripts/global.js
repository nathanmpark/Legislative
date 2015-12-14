// DOM Ready =============================================================
$(document).ready(function() {

    populateTable();

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

    var bill_ids = [];

    $.ajax({
        type: 'GET',
        url: 'http://congress.api.sunlightfoundation.com/upcoming_bills?apikey=838cd938cfb244a7a5728083f9191152'
    }).done(function(response) {

        var bills = response.results

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
            var committee_list = response.results[0].committee_ids
            var bill_id = response.results[0].bill_id
            var bill = {}
            bill['bill_id'] = bill_id
            addBill(bill);

            setCommitteeKeywords(bill_id, committee_list);
        })
    });
};

function getUrl(bill_id) {
    return 'http://congress.api.sunlightfoundation.com/bills?bill_id=' + bill_id + '&apikey=838cd938cfb244a7a5728083f9191152'
};

function getCommitteeUrl(committee_id) {
    return 'http://congress.api.sunlightfoundation.com/committees?committee_id=' + committee_id + '&apikey=838cd938cfb244a7a5728083f9191152'
}

function setCommitteeKeywords(bill_id, committee_ids) {
    $.each(committee_ids, function(){
        var request = getCommitteeUrl(this) 

        $.ajax({
            type: 'get',
            url: request
        }).done(function(response){
            var bill_info = {}
            bill_info['bill_id'] = bill_id

            var committee_id = response.results[0].committee_id
            var committee_name = response.results[0].name
            bill_info['committee_id'] = committee_id
            bill_info['committee_name'] = committee_name

            console.log(bill_info)

            addCommittee(bill_info)
        })
    });
}

function addBill(bill) {

    $.ajax({
        type: 'POST',
        data: bill,
        url: '/bills/add_bill',
        dataType: 'JSON'
    });
};

function addCommittee(bill_info) {

    $.ajax({
        type: 'POST',
        data: bill_info,
        url: '/bills/add_committee',
        dataType: 'JSON'
    }).done(function(response){
        // console.log('YOU MADE ITTTT')
    })
};







