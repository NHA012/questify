import React, { useRef, useEffect, useCallback, useState } from 'react';
import styles from './inventoryModal.module.css';
import { inventoryModalImage } from '@/assets/images';
import { Item, UserInventory } from './inventoryTypes';
import { NavTab, ContentTab, DetailView } from './inventoryComponents';

interface InventoryModalProps {
  items: Item[];
  userInventory: UserInventory;
  onClose: () => void;
  onBuy: (itemId: string) => void;
  onUse: (itemId: string) => void;
  hasActiveEffect: boolean;
}

const InventoryModal: React.FC<InventoryModalProps> = ({
  items,
  userInventory,
  onClose,
  onBuy,
  onUse,
  hasActiveEffect,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedItem, setSelectedItem] = useState<Item | null>(
    items.find((item) => item.quantity > 0) || null,
  );

  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    },
    [onClose],
  );

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleClickOutside]);

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    setSelectedItem(null);
  };

  const handleItemSelect = (item: Item) => {
    setSelectedItem(item);
  };

  useEffect(() => {
    // If there's a selected item, find its updated version in the items array
    if (selectedItem) {
      const updatedItem = items.find((item) => item.id === selectedItem.id);
      if (updatedItem && updatedItem !== selectedItem) {
        setSelectedItem(updatedItem);
      }
    }
  }, [items, selectedItem]);

  const uniqueEffects = Array.from(new Set(items.map((item) => item.effect)));
  const categories = ['all', ...uniqueEffects];

  return (
    <div id="inventory-modal" className={styles.modal}>
      <div className={styles.modalDialog}>
        <div
          ref={modalRef}
          className={styles.modalContent}
          style={{ backgroundImage: `url(${inventoryModalImage.inventoryBgImage})` }}
        >
          <h1 className={styles.bigFont}>Items</h1>

          <div id="gems-count-container" className={styles.gemsCountContainer}>
            <span className={styles.bigFont} id="gems-count">
              {userInventory.gold}
            </span>
          </div>

          <div id="close-modal" className={styles.closeModal} onClick={onClose}>
            <span className={`${styles.glyphicon} ${styles.glyphiconRemove}`}></span>
          </div>

          <NavTab
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={handleCategoryChange}
          />

          <ContentTab
            items={items}
            activeCategory={activeCategory}
            selectedItem={selectedItem}
            onItemSelect={handleItemSelect}
            onBuy={onBuy}
            onUse={onUse}
            hasActiveEffect={hasActiveEffect}
          />

          {selectedItem && (
            <DetailView
              selectedItem={selectedItem}
              onBuy={onBuy}
              onUse={onUse}
              hasActiveEffect={hasActiveEffect}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default InventoryModal;
