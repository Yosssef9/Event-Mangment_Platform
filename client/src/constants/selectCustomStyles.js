export const selectCustomStyles = {
  container: (provided) => ({
    ...provided,
    width: "100%", // make container full width
    minWidth: 0, // allow shrinking inside flex
  }),
  control: (provided) => ({
    ...provided,
    borderColor: "#D1D5DB",
    borderRadius: "0.5rem",
    padding: "0.25rem",
    boxShadow: "none",
    "&:hover": { borderColor: "#EC4899" },
  }),
  multiValue: (provided) => ({
    ...provided,
    backgroundColor: "#FCE7F3", // pink-50
    borderRadius: "0.25rem",
  }),
  multiValueLabel: (provided) => ({
    ...provided,
    color: "#DB2777", // pink-600
  }),
};
