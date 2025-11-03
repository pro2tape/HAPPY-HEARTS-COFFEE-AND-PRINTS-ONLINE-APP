
import React, { useState } from 'react';
import { getMenuRecommendations } from '../services/geminiService';
import { MenuItem, RecommendedItem } from '../types';
import { ChatIcon, CloseIcon } from './Icons';

interface GeminiAssistantProps {
  menuItems: MenuItem[];
  onAddToCart: (item: MenuItem, quantity: number, selectedSize?: { name: string; price: number }) => void;
}

const GeminiAssistant: React.FC<GeminiAssistantProps> = ({ menuItems, onAddToCart }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<RecommendedItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleGetRecommendations = async () => {
    if (!userInput.trim()) return;
    setIsLoading(true);
    setError(null);
    setRecommendations([]);
    try {
      const result = await getMenuRecommendations(userInput, menuItems);
      setRecommendations(result);
    } catch (err) {
      setError('Sorry, I couldn\'t get recommendations right now.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const findMenuItem = (id: number) => menuItems.find(item => item.id === id);

  const handleAddToCartFromRec = (item: MenuItem) => {
    const defaultSize = item.sizes ? item.sizes[0] : undefined;
    onAddToCart(item, 1, defaultSize);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-purple-600 text-white p-4 rounded-full shadow-lg hover:bg-purple-700 transition-transform transform hover:scale-110 z-30"
        aria-label="Open AI Assistant"
      >
        <ChatIcon className="h-8 w-8" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md flex flex-col" style={{ height: '70vh' }}>
            <div className="flex justify-between items-center p-4 border-b bg-purple-500 text-white rounded-t-xl">
              <h3 className="text-xl font-bold">Menu Assistant</h3>
              <button onClick={() => setIsOpen(false)} className="hover:opacity-75">
                <CloseIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="p-4 flex-grow overflow-y-auto">
              <p className="text-gray-600 mb-4 p-3 bg-purple-50 rounded-lg">Tell me what you're in the mood for! e.g., "Something sweet and cold" or "A filling lunch".</p>
              
              {isLoading && (
                 <div className="flex justify-center items-center h-24">
                   <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
                 </div>
              )}
              {error && <p className="text-red-500 text-center">{error}</p>}

              {recommendations.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-semibold">Here are my suggestions:</h4>
                  {recommendations.map(rec => {
                    const item = findMenuItem(rec.id);
                    if (!item) return null;
                    return (
                      <div key={item.id} className="border p-3 rounded-lg bg-white shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="flex-grow">
                                <p className="font-bold text-lg">{item.name}</p>
                                <p className="text-sm text-gray-600 italic">"{rec.reason}"</p>
                            </div>
                        </div>
                        <div className="flex justify-end mt-2">
                           <button onClick={() => handleAddToCartFromRec(item)} className="bg-orange-500 text-white text-sm font-bold py-1 px-3 rounded-full hover:bg-orange-600 transition-colors">Add to Cart</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="p-4 border-t">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleGetRecommendations()}
                  placeholder="e.g., a strong coffee..."
                  className="flex-grow border rounded-lg p-2 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  disabled={isLoading}
                />
                <button
                  onClick={handleGetRecommendations}
                  disabled={isLoading}
                  className="bg-purple-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-purple-700 disabled:bg-purple-300 transition-colors"
                >
                  {isLoading ? '...' : 'Ask'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GeminiAssistant;