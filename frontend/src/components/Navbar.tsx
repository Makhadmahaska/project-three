type NavbarProps = {
  title?: string;
  subtitle?: string;
};

export default function Navbar({ title = "Student Portal", subtitle = "Overview" }: NavbarProps) {
  return (
    <div className="navbar">
      <div>
        <p className="navbar-kicker">Sundsgarden</p>
        <h2>{title}</h2>
      </div>
      <span className="navbar-badge">{subtitle}</span>
    </div>
  );
}
