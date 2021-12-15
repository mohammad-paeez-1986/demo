import React from "react";
import { Bar } from "react-chartjs-2";

const data = {
    labels: ["1", "2", "3", "4", "5", "6"],
    datasets: [
        {
            label: "# of Red Votes",
            data: [1, 29, 13, 15, 21, 13],
            backgroundColor: "rgb(155, 99, 132)",
            stack: "Stack 0",
        },
        {
            label: "# of Blue Votes",
            data: [22, 13, 20, 51, 12, 41],
            backgroundColor: "rgb(154, 162, 235)",
            stack: "Stack 0",
        },
        {
            label: "# of Green Votes",
            data: [32, 30, 43, 55, 22, 38],
            backgroundColor: "rgb(75, 92, 192)",
            stack: "Stack 1",
        },
    ],
};

const options = {
    scales: {
        yAxes: [
            {
                ticks: {
                    beginAtZero: true,
                },
            },
        ],
    },
};

const Chart1 = () => (
    <>
        <Bar data={data} options={options} />
    </>
);

export default Chart1;
