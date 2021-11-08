import { getAllForms, loadLoader } from "./common.js";

google.charts.load("current", {packages:["corechart"]});
      google.charts.setOnLoadCallback(drawChart);
      function drawChart(){        

        getAllForms().then(forms => {
            const formCount = {
                active: 0,
                archived: 0,
            }
            forms.forEach((form, index) => {
                if(form.is_disabled) formCount.archived++;
                else formCount.active++;

                
            if(index === forms.length -1){
                const data = google.visualization.arrayToDataTable([
                    ["Type", "Count"],
                    ["Active", formCount.active + 5],
                    ["Archived", formCount.archived]
                ])

                const options = {
                    title: 'Your Forms',
                    pieHole: 0.4,
                  };
          
                  const chart = new google.visualization.PieChart(document.getElementById('home__root'));
                  chart.draw(data, options);
            }
            });

        })

      }