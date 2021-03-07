import history from "../history";

export const pushHistory = (route, href) => {
  let location = {
    pathname: route,
    search: href,
  };
  history.push(location, {});
};

export const replaceHistory = (route, href) => {
  let location = {
    pathname: route,
    search: href,
  };
  history.replace(location, {});
};

export const startOfMonth = () => {
  const date = new Date();
  let month = date.getMonth();
  if (month > 0) {
    month -= 1;
  } else {
    month = 11;
  }
  return new Date(date.getFullYear(), month, 1);
};

export const compareCreationDate = (a, b) => {
  if (a.debutDate < b.debutDate) {
    return -1;
  }
  if (a.debutDate > b.debutDate) {
    return 1;
  }
  return 0;
};

export const compare = (a, b, value) => {
  if (a[value] < b[value]) {
    return 1;
  }
  if (a[value] > b[value]) {
    return -1;
  }
  return 0;
};

export const customDateFormat = function (date, formatString) {
  var YYYY,
    YY,
    MMMM,
    MMM,
    MM,
    M,
    DDDD,
    DDD,
    DD,
    D,
    hhhh,
    hhh,
    hh,
    h,
    mm,
    m,
    ss,
    s,
    ampm,
    AMPM,
    dMod,
    th;
  YY = ((YYYY = date.getFullYear()) + "").slice(-2);
  MM = (M = date.getMonth() + 1) < 10 ? "0" + M : M;
  MMM = (MMMM = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ][M - 1]).substring(0, 3);
  DD = (D = date.getDate()) < 10 ? "0" + D : D;
  DDD = (DDDD = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ][date.getDay()]).substring(0, 3);
  th =
    D >= 10 && D <= 20
      ? "th"
      : (dMod = D % 10) == 1
      ? "st"
      : dMod == 2
      ? "nd"
      : dMod == 3
      ? "rd"
      : "th";
  formatString = formatString
    .replace("#YYYY#", YYYY)
    .replace("#YY#", YY)
    .replace("#MMMM#", MMMM)
    .replace("#MMM#", MMM)
    .replace("#MM#", MM)
    .replace("#M#", M)
    .replace("#DDDD#", DDDD)
    .replace("#DDD#", DDD)
    .replace("#DD#", DD)
    .replace("#D#", D)
    .replace("#th#", th);
  h = hhh = date.getHours();
  if (h == 0) h = 24;
  if (h > 12) h -= 12;
  hh = h < 10 ? "0" + h : h;
  hhhh = hhh < 10 ? "0" + hhh : hhh;
  AMPM = (ampm = hhh < 12 ? "am" : "pm").toUpperCase();
  mm = (m = date.getMinutes()) < 10 ? "0" + m : m;
  ss = (s = date.getSeconds()) < 10 ? "0" + s : s;
  return formatString
    .replace("#hhhh#", hhhh)
    .replace("#hhh#", hhh)
    .replace("#hh#", hh)
    .replace("#h#", h)
    .replace("#mm#", mm)
    .replace("#m#", m)
    .replace("#ss#", ss)
    .replace("#s#", s)
    .replace("#ampm#", ampm)
    .replace("#AMPM#", AMPM);
};
