import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Home, FolderOpen, User, Phone } from "lucide-react";
import { cn } from "@/lib/utils";

const BottomNavBar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    {
      icon: Home,
      label: "Home",
      href: "/",
      isActive: false,
    },
    {
      icon: FolderOpen,
      label: "Projects",
      href: "#gallery",
      isActive: false,
    },
    {
      icon: User,
      label: "About",
      href: "#about",
      isActive: false,
    },
    {
      icon: Phone,
      label: "Contact",
      href: "#contact",
      isActive: false,
    },
  ];

  const handleNavClick = (href: string) => {
    if (href === "/") {
      // Navigate to home and scroll to top
      navigate("/");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (href.startsWith("#")) {
      // Scroll to section for hash links
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 md:hidden">
      <div className="flex justify-around items-center py-2 px-4">
        {navItems.map((item) => {
          const Icon = item.icon;

          if (item.href.startsWith("#") || item.href === "/") {
            return (
              <button
                key={item.label}
                onClick={() => handleNavClick(item.href)}
                className={cn(
                  "flex flex-col items-center justify-center py-2 px-3 rounded-lg transition-colors",
                  item.isActive
                    ? "text-primary bg-primary/10"
                    : "text-gray-600 hover:text-primary hover:bg-gray-50",
                )}
              >
                <Icon className="h-5 w-5 mb-1" />
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            );
          }

          return (
            <Link
              key={item.label}
              to={item.href}
              className={cn(
                "flex flex-col items-center justify-center py-2 px-3 rounded-lg transition-colors",
                item.isActive
                  ? "text-primary bg-primary/10"
                  : "text-gray-600 hover:text-primary hover:bg-gray-50",
              )}
            >
              <Icon className="h-5 w-5 mb-1" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavBar;
