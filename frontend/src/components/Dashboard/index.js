import { useNavigate } from "react-router-dom";
import "../../styles/dashboard.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Bar, Line } from "react-chartjs-2";
import zoomPlugin from "chartjs-plugin-zoom";
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
import { useDashboardcontext } from "../../context/dashboard";
import { useLocation } from "react-router-dom";
import Cookies from "js-cookie";

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
  Filler,
  zoomPlugin
);
const Dashboard = () => {
  const {
    convertExcelDate,
    ageRange,
    filteredData,
    gender,
    startDate,
    endDate,
    selectedFeature,
    setAgeRange,
    setGender,
    setStartDate,
    setEndDate,
    setSelectedFeature,
    generateShareableLink,
  } = useDashboardcontext();

  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  if (queryParams.size > 0) {
    console.log("in quaery params");
    const filt = {
      ageRange: queryParams.get("ageRange"),
      gender: queryParams.get("gender"),
      startDate: queryParams.get("startDate"),
      endDate: queryParams.get("endDate"),
      selectedFeature: queryParams.get("selectedFeature"),
    };
    Cookies.set("userFilters", JSON.stringify(filt), { expires: 7 });
  }
  // Handle bar chart click
  const handleBarClick = (elements) => {
    if (elements.length > 0) {
      const clickedFeature = barChartData.labels[elements[0].index];
      setSelectedFeature(clickedFeature);
    }
  };

  // Bar chart data: representing features (A, B, C) with time spent
  const barChartData = {
    labels: ["A", "B", "C", "D", "E", "F"], // Replace with actual feature names
    datasets: [
      {
        label: `Time Spent ${
          gender === "all" ? " Total : Male, Female" : gender
        }`,
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
        label: `Time Trend of ${selectedFeature}  ${
          gender === "all" ? `${" Total : Male, Female"}` : `  ${gender} `
        }`,
        data: filteredData.map((item) => item[selectedFeature] || 0),
        borderColor: "rgba(75, 192, 192, 1)",
        fill: false,
      },
    ],
  };
  return (
    <div className="main">
      <div className="dashboard">
        <div className="top-bar">
          <h1>Data Visualizer</h1>
          <div className="top-bar-right">
            <button
              onClick={() => {
                generateShareableLink();
              }}
            >
              Share Data
            </button>
            <button
              onClick={() => {
                localStorage.removeItem("userToken:");
                localStorage.removeItem("userData:");
                navigate("/sign-in");
              }}
            >
              Log-Out
            </button>
          </div>
        </div>
        <div className="charts">
          {/* Bar Chart */}
          <div className="chart1">
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
            <div className="chart2">
              <h2>Time Trend: {selectedFeature}</h2>
              <Line
                data={lineChartData}
                options={{
                  scales: {
                    x: { beginAtZero: true },
                    y: { beginAtZero: true },
                  },
                  plugins: {
                    zoom: {
                      pan: {
                        enabled: true,
                        mode: "xy", // Pan on both axes
                      },
                      zoom: {
                        wheel: {
                          enabled: true, // Enable wheel zooming
                        },
                        pinch: {
                          enabled: true, // Enable pinch zooming for touch devices
                        },
                        mode: "xy", // Zoom on both axes
                      },
                    },
                  },
                }}
              />
            </div>
          )}
        </div>

        <div className="filter">
          {/* Age and Gender Filters */}
          <div className="a-g-filter">
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
          {/* Date Range Picker */}
          <div className="datepicker">
            <label>SELECT DATE:</label>
            <div className="datepicker-input">
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
