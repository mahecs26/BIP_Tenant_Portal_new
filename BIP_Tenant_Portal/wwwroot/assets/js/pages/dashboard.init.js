var options5 = {
    series: [{
        data: [10, 20, 15, 40, 20, 50, 70, 60, 90, 70, 110]
    }], chart: {
        type: "bar", height: 50, sparkline: {
            enabled: !0
        }
    },
    plotOptions: {
        bar: {
            columnWidth: "50%"
        }
    },
    tooltip: {
        fixed: {
            enabled: !1
        },
        y: {
            title: {
                formatter: function (e) { return "" }
            }
        }
    },
    colors: ["#2a4fd7"]
},
    chart5 = new ApexCharts(document.querySelector("#sparkline-chart-1"), options5);
chart5.render();
var options = {
    series: [{
        name: "Series A", data: [10, 90, 30, 60, 50, 90, 25, 55, 30, 40]
    }],
    chart: { height: 50, type: "area", sparkline: { enabled: !0 }, toolbar: { show: !1 } }, dataLabels: { enabled: !1 }, stroke: {
        curve: "smooth", width: 2
    },
    fill: {
        type: "gradient", gradient: {
            shadeIntensity: 1, inverseColors: !1, opacityFrom: .45, opacityTo: .05, stops: [50, 100, 100, 100]
        }
    },
    colors: ["#2a4fd7", "transparent"]
},
    chart = new ApexCharts(document.querySelector("#sparkline-chart-2"), options); chart.render(); options5 = {
        series: [{
            data: [40, 20, 30, 40, 20, 60, 55, 70, 95, 65, 110]
        }],
        chart: { type: "bar", height: 50, sparkline: { enabled: !0 } }, plotOptions: { bar: { columnWidth: "50%" } }, tooltip: {
            fixed: { enabled: !1 }, y: { title: { formatter: function (e) { return "" } } }
        }, colors: ["#2a4fd7"]
    }; (chart5 = new ApexCharts(document.querySelector("#sparkline-chart-3"), options5)).render(); options = {
        series: [{ name: "Series A", data: [10, 90, 30, 60, 50, 90, 25, 55, 30, 40] }], chart: {
            height: 50, type: "area", sparkline: {
                enabled: !0
            }, toolbar: { show: !1 }
        }, dataLabels: { enabled: !1 }, stroke: { curve: "smooth", width: 2 }, fill: {
            type: "gradient", gradient: {
                shadeIntensity: 1, inverseColors: !1, opacityFrom: .45, opacityTo: .05, stops: [50, 100, 100, 100]
            }
        }, colors: ["#2a4fd7", "transparent"]
    }; (chart = new ApexCharts(document.querySelector("#sparkline-chart-4"), options)).render(); options = {
        series: [{ name: "Series A", data: [40, 40, 60, 30, 50, 40] }], chart: {
            height: 100, type: "area", sparkline: { enabled: !0 }, toolbar: {
                show: !1
            }
        }, dataLabels: { enabled: !1 }, stroke: { curve: "smooth", width: 2 }, fill: {
            type: "gradient", gradient: {
                shadeIntensity: 1, inverseColors: !1, opacityFrom: .45, opacityTo: .05, stops: [50, 100, 100, 100]
            }
        }, colors: ["#2a4fd7", "transparent"]
    };

options = {
    series: [{
        name: "Series A", data: [48, 55, 40, 60, 50, 55]
    }],
    chart: {
        height: 100, type: "area", sparkline: {
            enabled: !0
        }, toolbar: { show: !1 }
    },
    dataLabels: {
        enabled: !1
    }, stroke: {
        curve: "smooth", width: 2
    },
    fill: {
        type: "gradient", gradient: {
            shadeIntensity: 1, inverseColors: !1, opacityFrom: .45, opacityTo: .05, stops: [50, 100, 100, 100]
        }
    },
    colors: ["#35d1df", "transparent"]
};

options = {
    series: [{
        name: "Series A", data: [48, 35, 60, 45, 55, 45]
    }],
    chart: {
        height: 100,
        type: "area",
        sparkline: {
            enabled: !0
        },
        toolbar: {
            show: !1
        }
    }, dataLabels: {
        enabled: !1
    }, stroke: {
        curve: "smooth", width: 2
    }, fill: {
        type: "gradient", gradient: {
            shadeIntensity: 1,
            inverseColors: !1,
            opacityFrom: .45,
            opacityTo: .05,
            stops: [50, 100, 100, 100]
        }
    },
    colors: ["#fa3452", "transparent"]
};

options = {
    series: [{
        name: "Series A", data: [42, 55, 30, 60, 40, 57]
    }],
    chart: {
        height: 100, type: "area", sparkline: {
            enabled: !0
        }, toolbar: {
            show: !1
        }
    }, dataLabels: {
        enabled: !1
    },
    stroke: { curve: "smooth", width: 2 }, fill: {
        type: "gradient", gradient: {
            shadeIntensity: 1, inverseColors: !1, opacityFrom: .45, opacityTo: .05, stops: [50, 100, 100, 100]
        }
    },
    colors: ["#34c38f", "transparent"]
};

options = {
    series: [{
        name: "series1", data: [70, 60, 70, 65, 75, 70, 80]
    }],
    chart: {
        height: 320, type: "area", toolbar: {
            autoSelected: "pan", show: !1
        }
    },
    dataLabels: {
        enabled: !1
    },
    stroke: {
        curve: "smooth", width: 2
    },
    grid: {
        borderColor: "#555", yaxis: {
            lines: {
                show: !0
            }
        }, xaxis: { lines: { show: !0 } }
    },
    xaxis: {
        categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    }, colors: ["#2a4fd7", "transparent"]
};
(chart = new ApexCharts(document.querySelector("#area-charts-1"), options)).render();
options = {
    series: [{
        name: "series1", data: [50, 75, 60, 80, 55, 70, 60]
    }],
    chart: {
        height: 320, type: "area", toolbar: {
            autoSelected: "pan", show: !1
        }
    },
    dataLabels: {
        enabled: !1
    },
    stroke: {
        curve: "smooth", width: 2
    },
    grid: {
        borderColor: "#555", yaxis: {
            lines: { show: !0 }
        },
        xaxis: {
            lines: {
                show: !0
            }
        }
    },
    xaxis: {
        categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    },
    colors: ["#2a4fd7", "transparent"]
};
(chart = new ApexCharts(document.querySelector("#area-charts-2"), options)).render();
options = {
    series: [{
        name: "series1", data: [60, 45, 75, 60, 80, 75, 90]
    }],
    chart: {
        height: 320, type: "area", toolbar: {
            autoSelected: "pan", show: !1
        }
    }, dataLabels: {
        enabled: !1
    }, stroke: {
        curve: "smooth", width: 2
    }, grid: {
        borderColor: "#555", yaxis: {
            lines: { show: !0 }
        }, xaxis: {
            lines: {
                show: !0
            }
        }
    }, xaxis: {
        categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    }, colors: ["#2a4fd7", "transparent"]
};
(chart = new ApexCharts(document.querySelector("#area-charts-3"), options)).render();
options = {
    series: [{
        name: "series1", data: [70, 60, 70, 65, 75, 70, 80]
    }],
    chart: {
        height: 320, type: "area", toolbar: {
            autoSelected: "pan", show: !1
        }
    },
    dataLabels: {
        enabled: !1
    }, stroke: {
        curve: "smooth", width: 2
    }, grid: {
        borderColor: "#555", yaxis: {
            lines: {
                show: !0
            }
        }, xaxis: {
            lines: {
                show: !0
            }
        }
    }, xaxis: {
        categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    },
    colors: ["#2a4fd7", "transparent"]
};
(chart = new ApexCharts(document.querySelector("#area-charts-4"), options)).render(); options = {
    series: [{
        name: "series1", data: [50, 75, 60, 80, 55, 70, 60]
    }],
    chart: {
        height: 320, type: "area", toolbar: {
            autoSelected: "pan", show: !1
        }
    },
    dataLabels: {
        enabled: !1
    }, stroke: {
        curve: "smooth", width: 2
    }, grid: {
        borderColor: "#555", yaxis: {
            lines: {
                show: !0
            }
        }, xaxis: {
            lines: {
                show: !0
            }
        }
    },
    xaxis: { categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] }, colors: ["#2a4fd7", "transparent"]
};
(chart = new ApexCharts(document.querySelector("#area-charts-5"), options)).render();
options = {
    series: [{ name: "Headphone", data: [40, 60, 40, 80, 20, 40, 20, 60, 20, 40, 60, 40] }, {
        name: "Mobiles", data: [20, 40, 20, 20, 40, 60, 40, 20, 40, 20, 40, 20]
    }, {
        name: "Accessories", data: [20, 40, 20, 40, 20, 40, 20, 40, 20, 40, 20, 40]
    }, {
        name: "LED TV", data: [20, 40, 20, 40, 20, 40, 20, 40, 20, 40, 20, 40]
    }],
    chart: {
        type: "bar", height: 250, stacked: !0, stackType: "100%", toolbar: { autoSelected: "pan", show: !1 }
    },
    plotOptions: {
        bar: {
            horizontal: !1, columnWidth: "18%", endingShape: "rounded"
        }
    },
    dataLabels: {
        enabled: !1
    },
    xaxis: {
        categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    },
    fill: {
        opacity: 1
    },
    legend: {
        show: !1
    },
    responsive: [{
        breakpoint: 576, options: {
            plotOptions: {
                bar: {
                    columnWidth: "45%"
                }
            }, stroke: {
                width: 2
            }
        }
    }], colors: ["#ff556f", "#486fff", "#ffcf7e", "#e9eef2"]
};
(chart = new ApexCharts(document.querySelector("#mixed-charts-1"), options)).render();