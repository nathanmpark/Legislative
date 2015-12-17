getTreeMapData();
var points = []

$(document).ready(function(){
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
	            layoutAlgorithm: 'squarified',
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
});

function getTreeMapData(){
	$.ajax({
		type: 'GET',
		url: '/bills/bill_list'
	}).done(function(response){
		getCommitteeCounts(response)
	}).fail(function(error){
		console.log(error)
	});
};

function getCommitteeCounts(tree_data){
	$.ajax({
		type: 'GET',
		url: '/bills/tree_data'
	}).done(function(response){
		var chart_data = populateTreeMap(tree_data, response)
		organizeData(chart_data)
	}).fail(function(error){
		console.log(error)
	});
};

function populateTreeMap(tree_data, committee_counts) {
	var chart_data = {}
	for (var i = 0; i < tree_data.length; i++){
		var treeMapData = {}
		var innerData = {}
		var committee_name = tree_data[i].committees.committee_name
		var title = tree_data[i].short_title ? tree_data[i].short_title : tree_data[i].official_title
		treeMapData[title] = innerData
		innerData['url'] = committee_counts[committee_name].toString();
		chart_data[committee_name] = treeMapData
	}
	// console.log(chart_data)
	// organizeData(chart_data)
	return chart_data
};

function organizeData(chartData){
    var committeeP
    var committeeVal
    var committeeI = 0
    var indvBillsP
    var indvBillsI
    var causeP
    var causeI
    var committee
    var indvBills
    var cause
    var causeName = {
        // "url": "<a href='#'>Click for bill details'</a>",
        'url': 'This is the text from the value of Description under causeName '
        // 'IDforBill': 'Bill id'
    }

	for (committee in chartData) {
	    if (chartData.hasOwnProperty(committee)) {
	        committeeVal = 0;
	        committeeP = {
	            id: 'id_' + committeeI,
	            name: committee,
	            color: Highcharts.getOptions().colors[committeeI]
	        };
	        indvBillsI = 0;
	        for (indvBills in chartData[committee]) {
	            if (chartData[committee].hasOwnProperty(indvBills)) {
	                indvBillsP = {
	                    id: committeeP.id + '_' + indvBillsI,
	                    name: indvBills,
	                    parent: committeeP.id
	                };
	                points.push(indvBillsP);
	                causeI = 0;
	                for (cause in chartData[committee][indvBills]) {
	                    if (chartData[committee][indvBills].hasOwnProperty(cause)) {
	                        causeP = {
	                            id: indvBillsP.id + '_' + causeI,
	                            name: causeName[cause],
	                            parent: indvBillsP.id,
	                            value: Math.round(+chartData[committee][indvBills][cause])
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
};
