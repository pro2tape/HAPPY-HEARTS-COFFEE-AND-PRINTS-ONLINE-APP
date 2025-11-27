
import React, { useState, useRef } from 'react';
import { MenuData, MenuItem } from '../types';
import { saveMenuData, resetMenuData } from '../utils/menuStorage';
import { CloseIcon, TrashIcon } from './Icons';

interface MenuManagerProps {
  isOpen: boolean;
  onClose: () => void;
  currentMenuData: MenuData;
}

const MenuManager: React.FC<MenuManagerProps> = ({ isOpen, onClose, currentMenuData }) => {
  const [activeTab, setActiveTab] = useState<'list' | 'add'>('list');
  
  // Form State
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState(Object.keys(currentMenuData)[0] || 'New Category');
  const [isNewCategoryInput, setIsNewCategoryInput] = useState(false);
  const [newCategoryInput, setNewCategoryInput] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newImage, setNewImage] = useState<string | undefined>(undefined);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
            // Resize image to max 400x400 to save space
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const maxWidth = 400;
            const maxHeight = 400;
            let width = img.width;
            let height = img.height;

            if (width > height) {
                if (width > maxWidth) {
                    height *= maxWidth / width;
                    width = maxWidth;
                }
            } else {
                if (height > maxHeight) {
                    width *= maxHeight / height;
                    height = maxHeight;
                }
            }
            canvas.width = width;
            canvas.height = height;
            ctx?.drawImage(img, 0, 0, width, height);
            const dataUrl = canvas.toDataURL('image/jpeg', 0.7); // Compress
            setNewImage(dataUrl);
        };
        if (event.target?.result) {
            img.src = event.target.result as string;
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newPrice) return;

    const categoryToAdd = isNewCategoryInput ? newCategoryInput : newCategory;
    if (!categoryToAdd) return;

    const newItem: MenuItem = {
      id: Date.now(), // simple ID generation
      name: newName,
      category: categoryToAdd,
      price: parseFloat(newPrice),
      description: newDescription,
      image: newImage
    };

    const updatedMenu = { ...currentMenuData };
    if (!updatedMenu[categoryToAdd]) {
      updatedMenu[categoryToAdd] = [];
    }
    updatedMenu[categoryToAdd].push(newItem);

    saveMenuData(updatedMenu);
    
    // Reset form
    setNewName('');
    setNewPrice('');
    setNewDescription('');
    setNewImage(undefined);
    setNewCategoryInput('');
    setIsNewCategoryInput(false);
    alert('Item added successfully!');
    setActiveTab('list');
  };

  const handleDeleteItem = (category: string, itemId: number) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
        const updatedMenu = { ...currentMenuData };
        updatedMenu[category] = updatedMenu[category].filter(item => item.id !== itemId);
        
        // Remove category if empty
        if (updatedMenu[category].length === 0) {
            delete updatedMenu[category];
        }
        saveMenuData(updatedMenu);
    }
  };
  
  const handleResetToDefault = () => {
      if(window.confirm("Are you sure? This will delete all custom items and images and revert to the original menu.")) {
          resetMenuData();
          alert("Menu reset to default.");
      }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-4 border-b bg-gray-50 rounded-t-xl">
          <h2 className="text-2xl font-bold text-gray-800">Menu Manager</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            <CloseIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="flex border-b">
            <button 
                className={`flex-1 py-3 font-semibold ${activeTab === 'list' ? 'bg-white border-b-2 border-orange-500 text-orange-600' : 'bg-gray-100 text-gray-600'}`}
                onClick={() => setActiveTab('list')}
            >
                Current Menu
            </button>
            <button 
                className={`flex-1 py-3 font-semibold ${activeTab === 'add' ? 'bg-white border-b-2 border-orange-500 text-orange-600' : 'bg-gray-100 text-gray-600'}`}
                onClick={() => setActiveTab('add')}
            >
                Add New Item
            </button>
        </div>

        <div className="p-6 overflow-y-auto flex-grow bg-gray-50">
            {activeTab === 'list' && (
                <div className="space-y-6">
                    <div className="flex justify-end mb-4">
                        <button onClick={handleResetToDefault} className="text-xs text-red-500 hover:underline">Revert to Default Menu</button>
                    </div>
                    {Object.entries(currentMenuData).map(([category, items]) => {
                        const categoryItems = items as MenuItem[];
                        return (
                        <div key={category} className="bg-white p-4 rounded-lg shadow-sm">
                            <h3 className="text-xl font-bold text-gray-800 mb-3 border-b pb-2">{category}</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {categoryItems.map(item => (
                                    <div key={item.id} className="flex items-start gap-3 border p-3 rounded-md hover:bg-gray-50 transition">
                                        {item.image ? (
                                            <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-md" />
                                        ) : (
                                            <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center text-xs text-gray-500">No Img</div>
                                        )}
                                        <div className="flex-grow">
                                            <p className="font-bold">{item.name}</p>
                                            <p className="text-xs text-gray-500 line-clamp-2">{item.description}</p>
                                            <p className="text-sm font-semibold text-amber-700">₱{item.price}</p>
                                        </div>
                                        <button onClick={() => handleDeleteItem(category, item.id)} className="text-red-500 hover:text-red-700 p-1">
                                            <TrashIcon className="w-5 h-5" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                        );
                    })}
                    {Object.keys(currentMenuData).length === 0 && (
                        <p className="text-center text-gray-500">No items in menu.</p>
                    )}
                </div>
            )}

            {activeTab === 'add' && (
                <div className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow-md">
                    <form onSubmit={handleAddItem} className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Item Name</label>
                            <input 
                                type="text" 
                                value={newName} 
                                onChange={e => setNewName(e.target.value)} 
                                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                                required
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Category</label>
                            <div className="flex gap-2 mb-2">
                                <select 
                                    value={isNewCategoryInput ? '' : newCategory} 
                                    onChange={e => {
                                        setNewCategory(e.target.value);
                                        setIsNewCategoryInput(false);
                                    }}
                                    className="w-full border rounded-lg p-2 bg-white"
                                    disabled={isNewCategoryInput}
                                >
                                    {Object.keys(currentMenuData).map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                                <button 
                                    type="button" 
                                    onClick={() => setIsNewCategoryInput(!isNewCategoryInput)}
                                    className="text-sm text-blue-600 hover:underline whitespace-nowrap"
                                >
                                    {isNewCategoryInput ? 'Select Existing' : 'Create New'}
                                </button>
                            </div>
                            {isNewCategoryInput && (
                                <input 
                                    type="text" 
                                    placeholder="Enter new category name"
                                    value={newCategoryInput}
                                    onChange={e => setNewCategoryInput(e.target.value)}
                                    className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                                    required
                                />
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Price (₱)</label>
                                <input 
                                    type="number" 
                                    value={newPrice} 
                                    onChange={e => setNewPrice(e.target.value)} 
                                    className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                                    min="0"
                                    step="0.01"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
                            <textarea 
                                value={newDescription} 
                                onChange={e => setNewDescription(e.target.value)} 
                                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-orange-500 focus:outline-none h-20"
                            ></textarea>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Image</label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                                {newImage ? (
                                    <div className="relative inline-block">
                                        <img src={newImage} alt="Preview" className="h-40 object-contain rounded-md" />
                                        <button 
                                            type="button"
                                            onClick={() => { setNewImage(undefined); if(fileInputRef.current) fileInputRef.current.value = ''; }}
                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600"
                                        >
                                            <CloseIcon className="w-4 h-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <div onClick={() => fileInputRef.current?.click()} className="cursor-pointer py-8 text-gray-500 hover:text-gray-700">
                                        <p>Click to upload image</p>
                                        <p className="text-xs text-gray-400 mt-1">Recommended: Square, under 1MB</p>
                                    </div>
                                )}
                                <input 
                                    type="file" 
                                    ref={fileInputRef} 
                                    onChange={handleImageUpload} 
                                    accept="image/*" 
                                    className="hidden" 
                                />
                            </div>
                        </div>

                        <div className="pt-4">
                            <button 
                                type="submit" 
                                className="w-full bg-orange-500 text-white font-bold py-3 rounded-lg hover:bg-orange-600 transition-colors shadow-lg"
                            >
                                Add Item to Menu
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default MenuManager;
