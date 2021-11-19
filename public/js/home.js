import { loadLoader } from "./common.js";
import { getAllForms } from "./formFunctions.js";

google.charts.load("current", {packages:["corechart"]});
      google.charts.setOnLoadCallback(drawChart);
      function drawChart(){        

        getAllForms().then(forms => {
            const formCount = {
                active: 0,
                saved: 0,
                archived: 0,
            }
            forms.forEach((form, index) => {

                if(form.is_published == "true" && form.is_disabled == "false"){
                    formCount.active++;
                }
                if(form.is_published == "false" && form.is_disabled == "false"){
                    formCount.saved++;
                }
                if(form.is_published == "false" && form.is_disabled == "true"){
                    // formCount.archived++;
                }

                
            if(index === forms.length - 1){
                const data = google.visualization.arrayToDataTable([
                    ["Type", "Count"],
                    ["Active", formCount.active],
                    ["Saved", formCount.saved],
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