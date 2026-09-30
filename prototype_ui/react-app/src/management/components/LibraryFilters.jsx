const filters = [
  { value: "all", label: "All" },
  { value: "activity", label: "Activities" },
  { value: "challenge", label: "Challenges" },
];

export default function LibraryFilters({
  value,
  onChange,
}) {
  return (
    <div
      className="library-filters"
      aria-label="Library filters"
    >
      {filters.map((filter) => (
        <button
          key={filter.value}
          type="button"
          className={`library-filter ${
            value === filter.value ? "active" : ""
          }`}
          onClick={() => onChange(filter.value)}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}