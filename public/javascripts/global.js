getBills();

$(document).ready(function() {
    populateTable();
});

function populateTable() {
    var tableContent = '';

    $.ajax({
        type: 'GET',
        url: 'https://congress.api.sunlightfoundation.com/upcoming_bills?apikey=838cd938cfb244a7a5728083f9191152'
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
        url: 'https://congress.api.sunlightfoundation.com/upcoming_bills?apikey=838cd938cfb244a7a5728083f9191152'
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
            setCommitteeKeywords(response, committee_list);
        })
    });
};

function getUrl(bill_id) {
    return 'https://congress.api.sunlightfoundation.com/bills?bill_id=' + bill_id + '&apikey=838cd938cfb244a7a5728083f9191152'
};

function getCommitteeUrl(committee_id) {
    return 'https://congress.api.sunlightfoundation.com/committees?committee_id=' + committee_id + '&apikey=838cd938cfb244a7a5728083f9191152'
}

function setCommitteeKeywords(bill_obj, committee_ids) {

    console.log("**** BILL OBJECT *****");
    console.log(bill_obj);

    $.each(committee_ids, function(){
        var request = getCommitteeUrl(this)

        $.ajax({
            type: 'get',
            url: request
        }).done(function(response){
            var bill = {}
            var extractable_bill_obj = bill_obj.results[0];

            //response
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

            console.log(bill);
            addBill(bill)
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









