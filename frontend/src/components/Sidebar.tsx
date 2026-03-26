type SidebarItem = {
  label: string;
  active?: boolean;
  onClick?: () => void;
};

type SidebarProps = {
  items: SidebarItem[];
};

export default function Sidebar({ items }: SidebarProps) {
  return (
    <aside className="side-pages">
      <h3>Pages</h3>
      {items.map((item) => (
        <button
          key={item.label}
          type="button"
          onClick={item.onClick}
          className={item.active ? "active" : ""}
        >
          {item.label}
        </button>
      ))}
    </aside>
  );
}
