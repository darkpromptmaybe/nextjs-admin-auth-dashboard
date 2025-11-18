import { Pool } from 'pg';
import { NavbarItem, createNavbarItemsTable, defaultNavbarItems } from './navbar';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

// Initialize navbar database
export async function initializeNavbarDatabase() {
  const client = await pool.connect();
  try {
    // Create table
    await client.query(createNavbarItemsTable);
    
    // Check if data already exists
    const existingItems = await client.query('SELECT COUNT(*) FROM navbar_items');
    
    if (parseInt(existingItems.rows[0].count) === 0) {
      // Insert default navbar items
      for (const item of defaultNavbarItems) {
        await client.query(
          'INSERT INTO navbar_items (name, href, "order", is_active, is_public, icon) VALUES ($1, $2, $3, $4, $5, $6)',
          [item.name, item.href, item.order, item.isActive, item.isPublic, item.icon]
        );
      }
      console.log('Default navbar items inserted');
    }
  } catch (error) {
    console.error('Error initializing navbar database:', error);
  } finally {
    client.release();
  }
}

// Get navbar items based on type (public or dashboard)
export async function getNavbarItems(isPublic: boolean): Promise<NavbarItem[]> {
  const client = await pool.connect();
  try {
    const query = `
      SELECT id, name, href, "order", is_active, is_public, icon, created_at, updated_at 
      FROM navbar_items 
      WHERE is_public = $1 AND is_active = true 
      ORDER BY "order" ASC
    `;
    const result = await client.query(query, [isPublic]);
    
    return result.rows.map(row => ({
      id: row.id,
      name: row.name,
      href: row.href,
      order: row.order,
      isActive: row.is_active,
      isPublic: row.is_public,
      icon: row.icon,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));
  } catch (error) {
    console.error('Error fetching navbar items:', error);
    return [];
  } finally {
    client.release();
  }
}

// Add new navbar item
export async function addNavbarItem(item: Omit<NavbarItem, 'id' | 'createdAt' | 'updatedAt'>) {
  const client = await pool.connect();
  try {
    const query = `
      INSERT INTO navbar_items (name, href, "order", is_active, is_public, icon) 
      VALUES ($1, $2, $3, $4, $5, $6) 
      RETURNING *
    `;
    const result = await client.query(query, [
      item.name, 
      item.href, 
      item.order, 
      item.isActive, 
      item.isPublic, 
      item.icon
    ]);
    return result.rows[0];
  } catch (error) {
    console.error('Error adding navbar item:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Update navbar item
export async function updateNavbarItem(id: number, item: Partial<NavbarItem>) {
  const client = await pool.connect();
  try {
    const setClause = [];
    const values = [];
    let paramIndex = 1;

    if (item.name !== undefined) {
      setClause.push(`name = $${paramIndex++}`);
      values.push(item.name);
    }
    if (item.href !== undefined) {
      setClause.push(`href = $${paramIndex++}`);
      values.push(item.href);
    }
    if (item.order !== undefined) {
      setClause.push(`"order" = $${paramIndex++}`);
      values.push(item.order);
    }
    if (item.isActive !== undefined) {
      setClause.push(`is_active = $${paramIndex++}`);
      values.push(item.isActive);
    }
    if (item.icon !== undefined) {
      setClause.push(`icon = $${paramIndex++}`);
      values.push(item.icon);
    }

    if (setClause.length === 0) {
      throw new Error('No fields to update');
    }

    setClause.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const query = `
      UPDATE navbar_items 
      SET ${setClause.join(', ')} 
      WHERE id = $${paramIndex} 
      RETURNING *
    `;

    const result = await client.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error('Error updating navbar item:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Delete navbar item
export async function deleteNavbarItem(id: number) {
  const client = await pool.connect();
  try {
    const query = 'DELETE FROM navbar_items WHERE id = $1 RETURNING *';
    const result = await client.query(query, [id]);
    return result.rows[0];
  } catch (error) {
    console.error('Error deleting navbar item:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Reorder navbar items
export async function reorderNavbarItems(items: { id: number; order: number }[]) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    for (const item of items) {
      await client.query(
        'UPDATE navbar_items SET "order" = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
        [item.order, item.id]
      );
    }
    
    await client.query('COMMIT');
    return true;
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error reordering navbar items:', error);
    throw error;
  } finally {
    client.release();
  }
}