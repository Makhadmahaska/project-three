
type YearFilterProps = {
  setYear: (year: number) => void;
};

export default function YearFilter({ setYear }: YearFilterProps) {
  return (
    <div className="filters">
      <button onClick={() => setYear(1)}>Year 1</button>
      <button onClick={() => setYear(2)}>Year 2</button>
      <button onClick={() => setYear(3)}>Year 3</button>
      <button onClick={() => setYear(0)}>All</button>
    </div>
  );
}
