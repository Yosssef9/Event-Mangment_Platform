// Function to get ordinal for the day
const getOrdinal = (n) => {
  if (n > 3 && n < 21) return n + "th"; // 11th, 12th, 13th
  switch (n % 10) {
    case 1:
      return n + "st";
    case 2:
      return n + "nd";
    case 3:
      return n + "rd";
    default:
      return n + "th";
  }
};

// Main function to format ISO date
export const formatDate = (isoDate) => {
  if (!isoDate) return ""; // handle empty or undefined

  const date = new Date(isoDate);
  const day = date.getDate();
  const year = date.getFullYear();
  const month = date.toLocaleString("en-US", { month: "short" });

  return `${getOrdinal(day)} ${month} ${year}`;
};

// دالة لتنسيق التاريخ فقط
export const formatOnlyDate = (date) => {
  const d = new Date(date);
  return d.toLocaleDateString(); // يظهر مثلاً "30/11/2025"
};

// دالة لتنسيق الوقت فقط
export const formatOnlyTime = (date) => {
  const d = new Date(date);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  // يظهر مثلاً "14:30"
};
