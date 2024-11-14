import { MenuItemHeaderProps } from "@/components/menu/menu-item-card/types";

export function MenuItemHeader({
  name,
  price,
  description,
}: MenuItemHeaderProps) {
  return (
    <div className="flex-1">
      <div className="flex justify-between items-start">
        <h3 className="font-semibold text-xl tracking-tight">{name}</h3>
        <span className="font-bold text-lg text-primary">{price}</span>
      </div>
      <p className="text-sm text-default-500 leading-relaxed">{description}</p>
    </div>
  );
}
