export interface NavLink {
  label: string;
  link: string;
}

export interface NavItem {
  displayName: string;
  disabled?: boolean;
  iconName?: string;
  route?: string;
  children?: NavItem[];
}
