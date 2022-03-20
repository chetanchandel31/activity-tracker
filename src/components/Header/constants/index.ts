export const navItems = [
  {
    name: "Activity Manager",
    pathName: "/activity-manager",
  },
  {
    name: "Date Manager",
    pathName: `/date-manager`,
  },
  {
    name: "Charts",
    pathName: "/charts",
  },
] as const;

export type NavItem = typeof navItems[number];

const paths = navItems.map((el) => el.pathName);

export type Path = typeof paths[number];
