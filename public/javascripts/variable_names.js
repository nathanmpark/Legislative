points = [],
regionP,
regionVal,
regionI = 0,
countryP,
countryI,
causeP,
causeI,
region,
country,
cause,


// PREVIOUSLY DELETED CODE

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
