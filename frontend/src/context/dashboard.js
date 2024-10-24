import { createContext, useContext, useState, useEffect } from "react";
// import { useLocation } from "react-router-dom";
import Cookies from "js-cookie";

let Dashboardcontext = createContext();

let DashboardProvider = ({ children }) => {
  const [userData, setUserData] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  // const [ageRange, setAgeRange] = useState([15, 25]);
  // const [gender, setGender] = useState("all");
  // const [startDate, setStartDate] = useState(null);
  // const [endDate, setEndDate] = useState(null);
  // const [selectedFeature, setSelectedFeature] = useState("A");
  const [ageRange, setAgeRange] = useState(() => {
    const cookieValue = Cookies.get("userFilters");
    return cookieValue ? JSON.parse(cookieValue).ageRange : "[15,25]";
  });
  const [gender, setGender] = useState(() => {
    const cookieValue = Cookies.get("userFilters");
    return cookieValue ? JSON.parse(cookieValue).gender : "all";
  });
  const [startDate, setStartDate] = useState(() => {
    const cookieValue = Cookies.get("userFilters");
    return cookieValue ? JSON.parse(cookieValue).startDate : null;
  });
  const [endDate, setEndDate] = useState(() => {
    const cookieValue = Cookies.get("userFilters");
    return cookieValue ? JSON.parse(cookieValue).endDate : null;
  });
  const [selectedFeature, setSelectedFeature] = useState(() => {
    const cookieValue = Cookies.get("userFilters");
    return cookieValue ? JSON.parse(cookieValue).selectedFeature : "A";
  });
  const [filters, setFilters] = useState({});
  // const location = useLocation();

  //   datestamp conver in human readable date
  const convertExcelDate = (serial) => {
    const excelEpoch = new Date(1900, 0, 1); // Excel starts from January 1, 1900
    const converted = new Date(
      excelEpoch.getTime() + (serial - 1) * 24 * 60 * 60 * 1000
    );
    return converted.toDateString(); // Return date in human-readable format
  };
  //
  const generateShareableLink = () => {
    const queryParams = new URLSearchParams(
      JSON.parse(Cookies.get("userFilters"))
    );
    const shareableUrl = `${window.location.origin}/dashboard?${queryParams}`;
    // alert(`Link copied to clipboard! ${shareableUrl}`);
    navigator.clipboard.writeText(shareableUrl).then(() => {
      alert("Link copied to clipboard!");
    });
  };
  // function that create or set startdate and end date
  const setminmaxdate = (data) => {
    let date = data.map((items) => {
      let exceldate = convertExcelDate(items.Day);
      let newdate = new Date(exceldate).getTime();
      return newdate;
    });
    // Remove duplicates
    const uniqueDates = [...new Set(date)];
    // Find minimum and maximum dates
    const minDate = new Date(Math.min(...uniqueDates));
    const maxDate = new Date(Math.max(...uniqueDates));
    setStartDate(minDate);
    setEndDate(maxDate);
  };

  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:3040/");
      const data = await response.json();
      setFilteredData(data);
      setData(data);
      if (!startDate && !endDate) {
        setminmaxdate(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    let filtered = data.filter((item) => {
      let age;

      item.Age.startsWith(">") || item.Age.startsWith("<")
        ? (age = parseInt(item.Age.substring(1)) + 1)
        : (age = parseInt(item.Age) + 1);

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
    setFilters({ ageRange, gender, startDate, endDate, selectedFeature });
  }, [ageRange, gender, startDate, endDate, data, selectedFeature]);

  // Save filters to cookies whenever they change
  useEffect(() => {
    const timer = setTimeout(() => {
      Cookies.set("userFilters", JSON.stringify(filters), { expires: 7 }); // Save for 7 days
    }, 2000);
    return () => {
      clearTimeout(timer);
    };
  }, [filters]);

  //
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Dashboardcontext.Provider
      value={{
        isAuthenticated,
        convertExcelDate,
        ageRange,
        filteredData,
        gender,
        startDate,
        endDate,
        selectedFeature,
        filters,
        setAgeRange,
        setFilteredData,
        setGender,
        setStartDate,
        setEndDate,
        setSelectedFeature,
        setUserData,
        generateShareableLink,
        setFilters,
        setIsAuthenticated,
      }}
    >
      {children}
    </Dashboardcontext.Provider>
  );
};
const useDashboardcontext = () => {
  return useContext(Dashboardcontext);
};
export { useDashboardcontext, DashboardProvider };
