$(function () {
   var data = {
           'Committee 1': {
               'Bill Name or Number': {
                   'url': '33',
               },
               'Bill Name or Number': {
                   'url': '12',
               },
           },
           'Committee 2': {
               'Bill Name or Number': {
                   'url': 'url',
               },
               'Bill Name or Number': {
                   'url': 'url',
               },
           },
           'Committee 3': {
               'Bill Name or Number': {
                   'url': '45',
               },
               'Bill Name or Number': {
                   'url': '98',
               },
               'Bill Name or Number': {
                   'url': '72',
               },
               'Bill Name or Number': {
                   'url': '98',
               },
           },
           'Committee 4': {
               'Bill Name or Number': {
                   'url': 'url',
               },
               'Bill Name or Number': {
                   'url': 'url',
               },
               'Bill Name or Number': {
                   'url': 'url',
               }
           },
           'Committee 6': {
               'Bill Name or Number': {
                   'url': '73',
               },
               'South Sudan': {
                   'url': '94',
               },
               'Sudan': {
                   'url': '323',
               },
           },
       },
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
       causeName = {
           'url': 'Iterate through bills to show description',
         
       };

   for (region in data) {
       if (data.hasOwnProperty(region)) {
           regionVal = 0;
           regionP = {
               id: 'id_' + regionI,
               name: region,
               color: Highcharts.getOptions().colors[regionI]
           };
           countryI = 0;
           for (country in data[region]) {
               if (data[region].hasOwnProperty(country)) {
                   countryP = {
                       id: regionP.id + '_' + countryI,
                       name: country,
                       parent: regionP.id
                   };
                   points.push(countryP);
                   causeI = 0;
                   for (cause in data[region][country]) {
                       if (data[region][country].hasOwnProperty(cause)) {
                           causeP = {
                               id: countryP.id + '_' + causeI,
                               name: causeName[cause],
                               parent: countryP.id,
                               value: Math.round(+data[region][country][cause])
                           };
                           regionVal += causeP.value;
                           points.push(causeP);
                           causeI = causeI + 1;
                       }
                   }
                   countryI = countryI + 1;
               }
           }
           regionP.value = Math.round(regionVal / countryI);
           points.push(regionP);
           regionI = regionI + 1;
       }
   }
   $('#container').highcharts({
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
               
                   dataLabels: {
                   enabled: true
               },
               borderWidth: 3
           }],
           data: points
       }],
       subtitle: {
           text: 'Click points to drill down. Source: <a href="http://apps.who.int/gho/data/node.main.12?lang=en">OpenCongress</a>.'
       },

       title: {
           text: 'Bills by Congressional Committee'
       }
   });
});