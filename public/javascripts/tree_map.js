$(document).ready(function(){

});

function getTreeMapData(){
	$.ajax({
		type: 'GET',
		url: '/bills/'
	})
}




var data = {
        'Committee 1': {
            'Bill Name or Number 1': {
                // "URL": '1',
                "Description": '1',
                // 'IDforBill': '89.0',
            },
            'Bill Name or Number 2': {
                // "URL": '1',
                "Description": '1',
                // 'IDforBill': '64.0',
            },
            'Bill Name or Number 3': {
                // "URL": '1',
                "Description": '1',
                // 'IDforBill': '102.0',
            },
            'Bill Name or Number 4': {
                // "URL": '1',
                "Description": '1',
                // 'IDforBill': '35.0',
            },
            'Bill Name or Number 5': {
                // "URL": '1',
                "Description": '1',
                // 'IDforBill': '91.9',
            },

        },
        'Committee 2': {
            'Bill Name or Number 1': {
                // "URL": '1',
                "Description": '1',
                // 'IDforBill': '44.3'
            },
            'Bill Name or Number 1': {
                // "URL": '1',
                "Description": '1',
                // 'IDforBill': '48.9'
            },
        },

    },
    points = [],
    committeeP,
    committeeVal,
    committeeI = 0,
    indvBillsP,
    indvBillsI,
    causeP,
    causeI,
    committee,
    indvBills,
    cause,
    causeName = {
        // "url": "<a href='#'>Click for bill details'</a>",
        'Description': 'This is the text from the value of Description under causeName '
        // 'IDforBill': 'Bill id'


    };

for (committee in data) {
    if (data.hasOwnProperty(committee)) {
        committeeVal = 0;
        committeeP = {
            id: 'id_' + committeeI,
            name: committee,
            color: Highcharts.getOptions().colors[committeeI]
        };
        indvBillsI = 0;
        for (indvBills in data[committee]) {
            if (data[committee].hasOwnProperty(indvBills)) {
                indvBillsP = {
                    id: committeeP.id + '_' + indvBillsI,
                    name: indvBills,
                    parent: committeeP.id
                };
                points.push(indvBillsP);
                causeI = 0;
                for (cause in data[committee][indvBills]) {
                    if (data[committee][indvBills].hasOwnProperty(cause)) {
                        causeP = {
                            id: indvBillsP.id + '_' + causeI,
                            name: causeName[cause],
                            parent: indvBillsP.id,
                            value: Math.round(+data[committee][indvBills][cause])
                        };
                        committeeVal += causeP.value;
                        points.push(causeP);
                        causeI = causeI + 1;
                    }
                }
                indvBillsI = indvBillsI + 1;
            }
        }
        committeeP.value = Math.round(committeeVal / indvBillsI);
        points.push(committeeP);
        committeeI = committeeI + 1;
    }
}
$('#bill-by-committee').highcharts({
    series: [{
        type: 'treemap',
        layoutAlgorithm: 'squarified',
        allowDrillToNode: true,
        dataLabels: {
            enabled: false
        },
        levelIsConstant: false,
        levels: [{
            level: 1,
            layoutAlgorithm: 'stripes',
            color: 'red',
            dataLabels: {
                enabled: true
            },
            borderWidth: 3
        },
        {
            level: 2,
            layoutAlgorithm: 'squarified',
            color: 'blue',
            dataLabels: {
                enabled: false
            },
        }],
        data: points
    }],
    title: {
        text: 'Bills by Committee (Per Session)'
    }
});

        // $(".bill-link").on('click', function(){
        //   console.log('The click is working!')
        // })