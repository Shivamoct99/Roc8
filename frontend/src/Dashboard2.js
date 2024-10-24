import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { Bar, Line } from "react-chartjs-2";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
// import Slider from "react-slider";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  TimeScale,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
// import zoomPlugin from "chartjs-plugin-zoom";
// import Dashboard from "./components/Dashboard";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  Filler
  //   zoomPlugin
);

function Dashboard() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [ageRange, setAgeRange] = useState([15, 25]);
  const [gender, setGender] = useState("all");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedFeature, setSelectedFeature] = useState(null);

  // Function to load and parse Excel file
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(firstSheet);
      setData(jsonData);
      setFilteredData(jsonData); // Initial filtered data
    };
    console.log("data :", data);
    console.log("filtereddata :", filteredData);
    reader.readAsArrayBuffer(file);
  };
  //   datestamp conver in human readable date
  const convertExcelDate = (serial) => {
    const excelEpoch = new Date(1900, 0, 1); // Excel starts from January 1, 1900
    const converted = new Date(
      excelEpoch.getTime() + (serial - 1) * 24 * 60 * 60 * 1000
    );
    return converted.toDateString(); // Return date in human-readable format
  };

  // Filter data based on age, gender, and date range
  useEffect(() => {
    let filtered = data.filter((item) => {
      let age;
      {
        item.Age.startsWith(">") || item.Age.startsWith("<")
          ? (age = parseInt(item.Age.substring(1)) + 1)
          : (age = parseInt(item.Age) + 1);
      }

      const isGenderMatch = gender === "all" || item.Gender === gender;
      const isAgeMatch =
        ageRange[0] === 15 && ageRange[1] === 25
          ? age >= 15 && age <= 25
          : age > 25;

      const itemDate = convertExcelDate(item.Day);

      let datadate = new Date(itemDate).getTime();
      let Startdate = new Date(startDate).getTime();
      let Enddate = new Date(endDate).getTime();

      const isDateMatch =
        (!Startdate || datadate >= Startdate) &&
        (!Enddate || datadate <= Enddate);

      return isGenderMatch && isAgeMatch && isDateMatch;
    });

    setFilteredData(filtered);
  }, [ageRange, gender, startDate, endDate, data]);

  // Bar chart data: representing features (A, B, C) with time spent
  const barChartData = {
    labels: ["A", "B", "C", "D", "E", "F"], // Replace with actual feature names
    datasets: [
      {
        label: "Time Spent",
        data: ["A", "B", "C", "D", "E", "F"].map((feature) =>
          filteredData.reduce((sum, item) => sum + (item[feature] || 0), 0)
        ),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  };

  // Line chart data: time trend for the selected feature
  const lineChartData = {
    labels: filteredData.map((item) => convertExcelDate(item.Day)),
    datasets: [
      {
        label: `Time Trend of ${selectedFeature}`,
        data: filteredData.map((item) => item[selectedFeature] || 0),
        borderColor: "rgba(75, 192, 192, 1)",
        fill: false,
      },
    ],
  };

  // Handle bar chart click
  const handleBarClick = (elements) => {
    if (elements.length > 0) {
      const clickedFeature = barChartData.labels[elements[0].index];
      setSelectedFeature(clickedFeature);
    }
  };

  return (
    // <div>hii dashboard</div>
    <div className="App" style={{ padding: "50px" }}>
      <h1>Data Analytics</h1>

      {/* File input */}
      <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />

      {/* Date Range Picker */}
      <div>
        <DatePicker
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          selectsStart
          startDate={startDate}
          endDate={endDate}
          placeholderText="Start Date"
        />
        <DatePicker
          selected={endDate}
          onChange={(date) => setEndDate(date)}
          selectsEnd
          startDate={startDate}
          endDate={endDate}
          placeholderText="End Date"
        />
      </div>

      {/* Age and Gender Filters */}
      <div>
        <label>Age Range:</label>
        <select
          value={ageRange[0]}
          onChange={(e) =>
            setAgeRange([
              parseInt(e.target.value),
              e.target.value === "15" ? 25 : 100,
            ])
          }
        >
          <option value="15">15-25</option>
          <option value="25">25</option>
        </select>

        <label>Gender:</label>
        <select value={gender} onChange={(e) => setGender(e.target.value)}>
          <option value="all">All</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
      </div>

      {/* Bar Chart */}
      <div>
        <h2>Time Spent on Features</h2>
        <Bar
          data={barChartData}
          options={{
            onClick: (e, elements) => handleBarClick(elements),
          }}
        />
      </div>

      {/* Line Chart */}
      {selectedFeature && (
        <div>
          <h2>Time Trend: {selectedFeature}</h2>
          <Line
            data={lineChartData}
            // options={
            //   {
            //     //   scales: {
            //     //     x: {
            //     //       type: "time",
            //     //       time: {
            //     //         unit: "day",
            //     //       },
            //     //     },
            //     //   },
            //     //   plugins: {
            //     //     zoom: {
            //     //       pan: {
            //     //         enabled: true,
            //     //         mode: "x",
            //     //       },
            //     //       zoom: {
            //     //         enabled: true,
            //     //         mode: "x",
            //     //       },
            //     //     },
            //     //   },
            //   }
            // }
          />
        </div>
      )}
    </div>
  );
}

export default Dashboard;
