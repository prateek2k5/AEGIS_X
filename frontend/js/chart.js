/**
 * ==========================================================
 * File        : chart.js
 * Project     : AEGIS-X
 * Module      : Live CPU Chart
 *
 * Description :
 * Displays real-time CPU utilization.
 * ==========================================================
 */

const cpuHistory = [];

const labels = [];

const ctx = document
    .getElementById("cpuChart")
    .getContext("2d");

const cpuChart = new Chart(ctx, {

    type: "line",

    data: {

        labels: labels,

        datasets: [{
            label: "CPU Usage %",
            data: cpuHistory,
            borderColor: "#00d9ff",
            borderWidth: 2.5,
            pointBackgroundColor: "#00d9ff",
            pointBorderColor: "#00d9ff",
            pointRadius: 0,
            pointHoverRadius: 5,
            tension: 0.35,
            fill: false
        }]

    },

    options: {
        responsive: true,
        animation: {
            duration: 400
        },
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                enabled: true
            }
        },
        elements: {
            point: {
                radius: 3,
                hoverRadius: 5
            }
        },
        scales: {
            x: {
                display: false,
                grid: {
                    display: false
                }
            },

            y: {
                min: 0,
                max: 100,
                ticks: {
                    stepSize: 20
                },
                grid: {
                    color: "rgba(255,255,255,0.05)"
                }
            }
         }
        }
    });


export function updateChart(value){

    if(labels.length>30){

        labels.shift();

        cpuHistory.shift();

    }

    labels.push(labels.length + 1);

    cpuHistory.push(value);

    cpuChart.update();

}

