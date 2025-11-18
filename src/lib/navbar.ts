// Database schema for dynamic navbar content
export interface NavbarItem {
  id: number;
  name: string;
  href: string;
  order: number;
  isActive: boolean;
  isPublic: boolean; // true for public navbar, false for dashboard
  icon?: string;
  section?: string; // section identifier for dashboard items
  createdAt: Date;
  updatedAt: Date;
}

export interface NavbarSection {
  id: string;
  name: string;
  description?: string;
  order: number;
}

// SQL for creating the navbar_items table
export const createNavbarItemsTable = `
  CREATE TABLE IF NOT EXISTS navbar_items (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    href VARCHAR(255) NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    is_public BOOLEAN DEFAULT false,
    icon VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`;

// Default navbar items to insert
export const defaultNavbarItems = [
  // Public navbar items
  { name: 'Home', href: '/', order: 1, isActive: true, isPublic: true },
  { name: 'About Us', href: '#about', order: 2, isActive: true, isPublic: true },
  { name: 'Contact Us', href: '#contact', order: 3, isActive: true, isPublic: true },
  
  // Dashboard navbar items
  { name: 'Overview', href: '/home', order: 1, isActive: true, isPublic: false, icon: 'FaHome' },
  { name: 'User Management', href: '/users', order: 2, isActive: true, isPublic: false, icon: 'FaUsers' },
  { name: 'Reports', href: '/reports', order: 3, isActive: true, isPublic: false, icon: 'FaChartBar' },
  { name: 'Analytics', href: '/analytics', order: 4, isActive: true, isPublic: false, icon: 'FaChartLine' },
  { name: 'Navbar Management', href: '/navbar-management', order: 5, isActive: true, isPublic: false, icon: 'FaBars' },
  { name: 'System Settings', href: '/settings', order: 6, isActive: true, isPublic: false, icon: 'FaCog' },
  { name: 'Logs', href: '/logs', order: 7, isActive: true, isPublic: false, icon: 'FaFileAlt' },
];