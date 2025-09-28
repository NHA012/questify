import React, { useState, useEffect } from 'react';
import InventoryButton from './inventoryButton';
import InventoryModal from './inventoryModal';
import ActiveEffectNotification from './activeEffectNotification';
import {
  Inventory as InventoryType,
  Item,
  UserInventory,
  UserCourseInfo,
  convertToComponentFormat,
  getCompatibleInventory,
  fetchInventory,
  fetchUserCourse,
  buyItem,
  useItem as callItemUse,
  canAffordItem,
  getEffectDescription,
} from '@/services/inventoryService';

interface InventoryProps {
  courseId: string;
  userId: string;
}

const Inventory: React.FC<InventoryProps> = ({ courseId, userId }) => {
  const [isInventoryModalOpen, setIsInventoryModalOpen] = useState(false);
  const [inventory, setInventory] = useState<InventoryType | null>(null);
  const [userCourse, setUserCourse] = useState<UserCourseInfo | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [hasActiveEffect, setHasActiveEffect] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!courseId) return;

      setIsLoading(true);
      setError(null);

      try {
        // Fetch both inventory and user course data
        const [inventoryData, userCourseData] = await Promise.all([
          fetchInventory(courseId),
          fetchUserCourse(courseId),
        ]);

        if (inventoryData) {
          setInventory(inventoryData);
          setItems(convertToComponentFormat(inventoryData));
        } else {
          setError('Failed to fetch inventory data.');
        }

        if (userCourseData) {
          setUserCourse(userCourseData);
          setHasActiveEffect(!!userCourseData.nextLevelEffect);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Error fetching data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [courseId, userId]);

  const userInventoryCompat: UserInventory = inventory
    ? getCompatibleInventory(inventory)
    : { id: '', gold: 0 };

  const handleBuyItem = async (itemId: string) => {
    if (!inventory || !courseId) return;

    setIsLoading(true);
    setError(null);

    const itemToBuy = items.find((item) => item.id === itemId);

    if (!itemToBuy) {
      setError('Item not found');
      setIsLoading(false);
      return;
    }

    // Check if user has enough gold before making API call
    if (!canAffordItem(inventory, itemToBuy.gold)) {
      setError('Not enough gold to purchase this item');
      setIsLoading(false);
      return;
    }

    try {
      const result = await buyItem(courseId, itemId, 1);

      if (result.success && result.inventory) {
        setInventory(result.inventory);
        setItems(convertToComponentFormat(result.inventory));
      } else {
        setError(result.message);
      }
    } catch (err) {
      console.error('Error buying item:', err);
      setError('Failed to purchase item');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUseItem = async (itemId: string) => {
    if (!inventory || !courseId || hasActiveEffect) return;

    setIsLoading(true);
    setError(null);

    const itemToUse = items.find((item) => item.id === itemId);

    if (!itemToUse) {
      setError('Item not found');
      setIsLoading(false);
      return;
    }

    if (itemToUse.quantity <= 0) {
      setError('No items left to use');
      setIsLoading(false);
      return;
    }

    try {
      const result = await callItemUse(courseId, itemId, 1);

      if (result.success && result.inventory) {
        setInventory(result.inventory);
        setItems(convertToComponentFormat(result.inventory));
        setSuccessMessage(result.message || 'Item used successfully');

        // Refresh user course to get updated effect status
        const updatedUserCourse = await fetchUserCourse(courseId);
        if (updatedUserCourse) {
          setUserCourse(updatedUserCourse);
          setHasActiveEffect(!!updatedUserCourse.nextLevelEffect);
        }
      } else {
        setError(result.message);
      }
    } catch (err) {
      console.error('Error using item:', err);
      setError('Failed to use item');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <>
      {hasActiveEffect && userCourse?.nextLevelEffect && (
        <ActiveEffectNotification
          effectType={userCourse.nextLevelEffect}
          effectDescription={getEffectDescription(userCourse.nextLevelEffect)}
        />
      )}

      <InventoryButton onClick={() => setIsInventoryModalOpen(true)} />

      {isLoading && (
        <div
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: '#fff',
            padding: '20px',
            borderRadius: '4px',
            boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
            zIndex: 2000,
          }}
        >
          Loading...
        </div>
      )}

      {isInventoryModalOpen && inventory && (
        <InventoryModal
          items={items}
          userInventory={userInventoryCompat}
          onClose={() => setIsInventoryModalOpen(false)}
          onBuy={handleBuyItem}
          onUse={handleUseItem}
          hasActiveEffect={hasActiveEffect}
        />
      )}

      {error && (
        <div
          style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            background: '#f44336',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '4px',
            zIndex: 2000,
          }}
        >
          {error}
        </div>
      )}

      {successMessage && (
        <div
          style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            background: '#4CAF50',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '4px',
            zIndex: 2000,
          }}
        >
          {successMessage}
        </div>
      )}
    </>
  );
};

export default Inventory;
