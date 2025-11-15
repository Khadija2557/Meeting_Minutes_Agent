import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useNavigate } from "react-router-dom";

interface MenuItem {
  label: string;
  path: string;
}

interface HamburgerMenuProps {
  items: MenuItem[];
}

export function HamburgerMenu({ items }: HamburgerMenuProps) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="hover:glow-cyan">
          <Menu className="w-6 h-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 border-glow-purple">
        <div className="flex flex-col gap-4 mt-8">
          {items.map((item) => (
            <Button
              key={item.path}
              variant="ghost"
              className="justify-start text-lg hover:bg-primary/10 hover:glow-blue"
              onClick={() => handleNavigation(item.path)}
            >
              {item.label}
            </Button>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
