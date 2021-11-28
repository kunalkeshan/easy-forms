const parseData = (data) => {
  return JSON.parse(JSON.stringify(data));
};

const convertDate = (datetime) => {
  let created_date = new Date(datetime);
  let months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  let year = created_date.getFullYear();
  let month = months[created_date.getMonth()];
  let date = created_date.getDate();

  let time = date + ", " + month + " " + year;
  return time;
};

const calculateDateDifference = (datetime) => {
  const given_date = new Date(datetime);
  const today_date = new Date();
  const diffTime = Math.abs(today_date - given_date);
  const diffMin = Math.floor(diffTime / (1000 * 60));
  const diffHrs = Math.floor(diffTime / (1000 * 60 * 60));
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  if (diffDays <= 1)
    if (diffMin < 60) return diffMin + "m";
    else return diffHrs + "h";
  else if (diffDays < 7) return diffDays + "d";
  else return Math.floor(diffDays / 7) + "w";
};

const renderError = (res) => {
  const page = {
    link: "404",
    title: "404 | Easy-Forms"
  }

  res.render("404", {page})
}

module.exports = {
  parseData,
  convertDate,
  calculateDateDifference,
  renderError
};
