import { prisma } from './prisma';
import type { NavbarItem } from '@prisma/client';

// Initialize navbar database with default items
export async function initializeNavbarDatabase() {
  try {
    // Check if navbar items exist
    const existingCount = await prisma.navbarItem.count();
    
    if (existingCount === 0) {
      // Insert default navbar items
      const defaultItems = [
        // Public navbar items
        { name: 'Home', href: '/', order: 1, isActive: true, isPublic: true },
        { name: 'About Us', href: '#about', order: 2, isActive: true, isPublic: true },
        { name: 'Contact Us', href: '#contact', order: 3, isActive: true, isPublic: true },
        
        // Dashboard navbar items
        { name: 'Overview', href: '/home', order: 1, isActive: true, isPublic: false, icon: 'FaHome', section: 'main' },
        { name: 'Dashboard', href: '/dashboard', order: 2, isActive: true, isPublic: false, icon: 'FaTachometerAlt', section: 'main' },
        { name: 'User Management', href: '/users', order: 3, isActive: true, isPublic: false, icon: 'FaUsers', section: 'main' },
        { name: 'Reports', href: '/reports', order: 4, isActive: true, isPublic: false, icon: 'FaChartBar', section: 'analytics' },
        { name: 'Analytics', href: '/analytics', order: 5, isActive: true, isPublic: false, icon: 'FaChartLine', section: 'analytics' },
        { name: 'Navbar Management', href: '/navbar-management', order: 6, isActive: true, isPublic: false, icon: 'FaBars', section: 'admin' },
        { name: 'System Settings', href: '/settings', order: 7, isActive: true, isPublic: false, icon: 'FaCog', section: 'admin' },
        { name: 'Logs', href: '/logs', order: 8, isActive: true, isPublic: false, icon: 'FaFileAlt', section: 'admin' },
      ];

      await prisma.navbarItem.createMany({
        data: defaultItems,
      });

      console.log('✅ Default navbar items initialized');
    }
  } catch (error) {
    console.error('❌ Error initializing navbar database:', error);
    throw error;
  }
}

// Get navbar items
export async function getNavbarItems(isPublic: boolean): Promise<NavbarItem[]> {
  try {
    const items = await prisma.navbarItem.findMany({
      where: {
        isPublic,
        isActive: true,
      },
      orderBy: {
        order: 'asc',
      },
    });

    return items;
  } catch (error) {
    console.error('Error fetching navbar items:', error);
    throw error;
  }
}

// Add new navbar item
export async function addNavbarItem(data: {
  name: string;
  href: string;
  order: number;
  isActive: boolean;
  isPublic: boolean;
  icon?: string;
  section?: string;
}): Promise<NavbarItem> {
  try {
    const newItem = await prisma.navbarItem.create({
      data,
    });

    return newItem;
  } catch (error) {
    console.error('Error adding navbar item:', error);
    throw error;
  }
}

// Update navbar item
export async function updateNavbarItem(
  id: number,
  data: Partial<Omit<NavbarItem, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<NavbarItem> {
  try {
    const updatedItem = await prisma.navbarItem.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });

    return updatedItem;
  } catch (error) {
    console.error('Error updating navbar item:', error);
    throw error;
  }
}

// Delete navbar item
export async function deleteNavbarItem(id: number): Promise<NavbarItem> {
  try {
    const deletedItem = await prisma.navbarItem.delete({
      where: { id },
    });

    return deletedItem;
  } catch (error) {
    console.error('Error deleting navbar item:', error);
    throw error;
  }
}

// Reorder navbar items
export async function reorderNavbarItems(items: { id: number; order: number }[]): Promise<void> {
  try {
    await prisma.$transaction(
      items.map((item) =>
        prisma.navbarItem.update({
          where: { id: item.id },
          data: { order: item.order, updatedAt: new Date() },
        })
      )
    );
  } catch (error) {
    console.error('Error reordering navbar items:', error);
    throw error;
  }
}