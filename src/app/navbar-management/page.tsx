'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FaPlus, FaEdit, FaTrash, FaArrowUp, FaArrowDown, FaSave } from 'react-icons/fa';

interface NavbarItem {
  id: number;
  name: string;
  href: string;
  order: number;
  isActive: boolean;
  isPublic: boolean;
  icon?: string;
  section?: string; // New field for grouping items
}

interface NavbarSection {
  id: string;
  name: string;
  order: number;
  isActive: boolean;
}

export default function NavbarManagementPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [publicItems, setPublicItems] = useState<NavbarItem[]>([]);
  const [dashboardItems, setDashboardItems] = useState<NavbarItem[]>([]);
  const [sections, setSections] = useState<NavbarSection[]>([
    { id: 'main', name: 'Main Navigation', order: 1, isActive: true },
    { id: 'management', name: 'Management', order: 2, isActive: true },
    { id: 'system', name: 'System', order: 3, isActive: true },
  ]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<NavbarItem | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showSectionForm, setShowSectionForm] = useState(false);
  const [newItem, setNewItem] = useState({
    name: '',
    href: '',
    isPublic: false,
    icon: '',
    section: 'main'
  });
  const [newSection, setNewSection] = useState({
    id: '',
    name: '',
    description: '',
    order: 1
  });
  const [activeTab, setActiveTab] = useState<'items' | 'sections'>('items');

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/login');
      return;
    }
    fetchNavbarItems();
  }, [session, status, router]);

  const fetchNavbarItems = async () => {
    try {
      const [publicResponse, dashboardResponse] = await Promise.all([
        fetch('/api/navbar?type=public'),
        fetch('/api/navbar?type=dashboard')
      ]);

      if (publicResponse.ok) {
        const publicData = await publicResponse.json();
        setPublicItems(publicData);
      }

      if (dashboardResponse.ok) {
        const dashboardData = await dashboardResponse.json();
        setDashboardItems(dashboardData);
      }
    } catch (error) {
      console.error('Error fetching navbar items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async () => {
    try {
      const response = await fetch('/api/navbar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newItem,
          order: newItem.isPublic ? publicItems.length + 1 : dashboardItems.length + 1
        })
      });

      if (response.ok) {
        await fetchNavbarItems();
        setShowAddForm(false);
        setNewItem({ name: '', href: '', isPublic: false, icon: '' });
      }
    } catch (error) {
      console.error('Error adding navbar item:', error);
    }
  };

  const handleUpdateItem = async (item: NavbarItem) => {
    try {
      const response = await fetch('/api/navbar', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item)
      });

      if (response.ok) {
        await fetchNavbarItems();
        setEditingItem(null);
      }
    } catch (error) {
      console.error('Error updating navbar item:', error);
    }
  };

  const handleDeleteItem = async (id: number) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      const response = await fetch(`/api/navbar?id=${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        await fetchNavbarItems();
      }
    } catch (error) {
      console.error('Error deleting navbar item:', error);
    }
  };

  const handleAddSection = async () => {
    if (!newSection.name.trim()) return;

    const sectionId = newSection.name.toLowerCase().replace(/\s+/g, '-');
    const section: NavbarSection = {
      id: sectionId,
      name: newSection.name,
      description: newSection.description || undefined,
      order: sections.length + 1
    };

    setSections([...sections, section]);
    setNewSection({ id: '', name: '', description: '', order: 1 });
  };

  const handleDeleteSection = async (sectionId: string) => {
    if (sectionId === 'main') return; // Don't allow deleting main section

    // Move items from deleted section to main
    const updatedItems = dashboardItems.map(item => 
      item.section === sectionId ? { ...item, section: 'main' } : item
    );
    
    // Update sections list
    setSections(sections.filter(s => s.id !== sectionId));
    
    // TODO: Update database with moved items
  };

  const handleReorder = async (items: NavbarItem[], fromIndex: number, toIndex: number) => {
    const reorderedItems = [...items];
    const [removed] = reorderedItems.splice(fromIndex, 1);
    reorderedItems.splice(toIndex, 0, removed);

    const reorderData = reorderedItems.map((item, index) => ({
      id: item.id,
      order: index + 1
    }));

    try {
      const response = await fetch('/api/navbar/reorder', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: reorderData })
      });

      if (response.ok) {
        await fetchNavbarItems();
      }
    } catch (error) {
      console.error('Error reordering items:', error);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const renderItemList = (items: NavbarItem[], isPublic: boolean) => {
    // Group items by section if not public
    const groupedItems = isPublic 
      ? { 'default': items }
      : items.reduce((groups, item) => {
          const section = item.section || 'main';
          if (!groups[section]) groups[section] = [];
          groups[section].push(item);
          return groups;
        }, {} as Record<string, NavbarItem[]>);

    return (
      <div className="space-y-6">
        {Object.entries(groupedItems).map(([sectionId, sectionItems]) => {
          const section = sections.find(s => s.id === sectionId);
          const sectionName = section?.name || (sectionId === 'default' ? 'Navigation Items' : sectionId);
          
          return (
            <div key={sectionId} className="border border-gray-200 rounded-lg p-4">
              {!isPublic && (
                <div className="mb-4 pb-3 border-b border-gray-100">
                  <h3 className="font-medium text-gray-900">{sectionName}</h3>
                  <p className="text-sm text-gray-500">{sectionItems.length} items</p>
                </div>
              )}
              <div className="space-y-4">
                {sectionItems.map((item, index) => (
                  <div key={item.id} className="bg-gray-50 p-4 rounded-lg border">
                    {editingItem?.id === item.id ? (
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={editingItem.name}
                          onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                          className="w-full px-3 py-2 border rounded-md"
                          placeholder="Name"
                        />
                        <input
                          type="text"
                          value={editingItem.href}
                          onChange={(e) => setEditingItem({ ...editingItem, href: e.target.value })}
                          className="w-full px-3 py-2 border rounded-md"
                          placeholder="URL/Href"
                        />
                        <input
                          type="text"
                          value={editingItem.icon || ''}
                          onChange={(e) => setEditingItem({ ...editingItem, icon: e.target.value })}
                          className="w-full px-3 py-2 border rounded-md"
                          placeholder="Icon (optional)"
                        />
                        {!isPublic && (
                          <select
                            value={editingItem.section || 'main'}
                            onChange={(e) => setEditingItem({ ...editingItem, section: e.target.value })}
                            className="w-full px-3 py-2 border rounded-md"
                          >
                            {sections.map(section => (
                              <option key={section.id} value={section.id}>{section.name}</option>
                            ))}
                          </select>
                        )}
                        <div className="flex items-center space-x-2">
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={editingItem.isActive}
                              onChange={(e) => setEditingItem({ ...editingItem, isActive: e.target.checked })}
                              className="mr-2"
                            />
                            Active
                          </label>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleUpdateItem(editingItem)}
                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm flex items-center"
                          >
                            <FaSave className="mr-1" /> Save
                          </button>
                          <button
                            onClick={() => setEditingItem(null)}
                            className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">{item.name}</h4>
                          <p className="text-sm text-gray-600">{item.href}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className={`px-2 py-1 text-xs rounded ${item.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                              {item.isActive ? 'Active' : 'Inactive'}
                            </span>
                            <span className="text-xs text-gray-500">Order: {item.order}</span>
                            {item.icon && <span className="text-xs text-gray-500">Icon: {item.icon}</span>}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => index > 0 && handleReorder(sectionItems, index, index - 1)}
                            disabled={index === 0}
                            className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                          >
                            <FaArrowUp />
                          </button>
                          <button
                            onClick={() => index < sectionItems.length - 1 && handleReorder(sectionItems, index, index + 1)}
                            disabled={index === sectionItems.length - 1}
                            className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                          >
                            <FaArrowDown />
                          </button>
                          <button
                            onClick={() => setEditingItem(item)}
                            className="p-1 text-blue-600 hover:text-blue-800"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDeleteItem(item.id)}
                            className="p-1 text-red-600 hover:text-red-800"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Navbar Management</h1>
          <p className="text-gray-600">Manage navigation items for public and dashboard areas</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Public Navbar Items */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Public Navigation</h2>
              <button
                onClick={() => {
                  setNewItem({ ...newItem, isPublic: true });
                  setShowAddForm(true);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
              >
                <FaPlus className="mr-2" /> Add Item
              </button>
            </div>
            {renderItemList(publicItems, true)}
          </div>

          {/* Dashboard Navbar Items with Tabs */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Dashboard Navigation</h2>
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setActiveTab('items');
                  }}
                  className={`px-3 py-1 rounded-md text-sm ${
                    activeTab === 'items' 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Items
                </button>
                <button
                  onClick={() => {
                    setActiveTab('sections');
                  }}
                  className={`px-3 py-1 rounded-md text-sm ${
                    activeTab === 'sections' 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Sections
                </button>
                <button
                  onClick={() => {
                    setNewItem({ ...newItem, isPublic: false });
                    setShowAddForm(true);
                  }}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md flex items-center"
                >
                  <FaPlus className="mr-2" /> Add Item
                </button>
              </div>
            </div>
            
            {activeTab === 'items' && renderItemList(dashboardItems, false)}
            
            {activeTab === 'sections' && (
              <div className="space-y-6">
                {/* Add Section Form */}
                <div className="bg-gray-50 p-4 rounded-lg border">
                  <h3 className="font-medium mb-3">Add New Section</h3>
                  <div className="grid gap-3">
                    <input
                      type="text"
                      value={newSection.name}
                      onChange={(e) => setNewSection({ ...newSection, name: e.target.value })}
                      className="px-3 py-2 border rounded-md"
                      placeholder="Section Name"
                    />
                    <input
                      type="text"
                      value={newSection.description}
                      onChange={(e) => setNewSection({ ...newSection, description: e.target.value })}
                      className="px-3 py-2 border rounded-md"
                      placeholder="Description (optional)"
                    />
                    <button
                      onClick={handleAddSection}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm flex items-center justify-center"
                    >
                      <FaPlus className="mr-2" /> Add Section
                    </button>
                  </div>
                </div>
                
                {/* Sections List */}
                <div className="space-y-3">
                  <h3 className="font-medium">Existing Sections</h3>
                  {sections.map(section => (
                    <div key={section.id} className="bg-gray-50 p-4 rounded-lg border flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{section.name}</h4>
                        {section.description && (
                          <p className="text-sm text-gray-600">{section.description}</p>
                        )}
                        <p className="text-xs text-gray-500 mt-1">
                          Items: {dashboardItems.filter(item => item.section === section.id).length}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleDeleteSection(section.id)}
                          className="p-2 text-red-600 hover:text-red-800"
                          disabled={section.id === 'main'} // Don't allow deleting main section
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Add Item Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold mb-4">
                Add {newItem.isPublic ? 'Public' : 'Dashboard'} Navigation Item
              </h3>
              <div className="space-y-4">
                <input
                  type="text"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Name"
                />
                <input
                  type="text"
                  value={newItem.href}
                  onChange={(e) => setNewItem({ ...newItem, href: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="URL/Href"
                />
                <input
                  type="text"
                  value={newItem.icon}
                  onChange={(e) => setNewItem({ ...newItem, icon: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Icon (optional)"
                />
                {!newItem.isPublic && (
                  <select
                    value={newItem.section || 'main'}
                    onChange={(e) => setNewItem({ ...newItem, section: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    {sections.map(section => (
                      <option key={section.id} value={section.id}>{section.name}</option>
                    ))}
                  </select>
                )}
                <div className="flex space-x-2">
                  <button
                    onClick={handleAddItem}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex-1"
                  >
                    Add Item
                  </button>
                  <button
                    onClick={() => {
                      setShowAddForm(false);
                      setNewItem({ name: '', href: '', isPublic: false, icon: '', section: 'main' });
                    }}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md flex-1"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}