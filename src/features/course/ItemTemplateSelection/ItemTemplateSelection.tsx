import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Search } from 'lucide-react';
import styles from './ItemTemplateSelection.module.css';
import {
  ItemTemplate,
  EffectType,
  SimpleEffectType,
  useItemTemplateData,
  filterItemTemplatesByEffect,
  filterItemTemplatesBySearch,
  getSimpleEffectType,
} from '@/services/ItemTemplateService';
import { rewardModalImage } from '@/assets/images';

interface ItemTemplateSelectionProps {
  courseId: string;
  onItemsSelected?: (selectedItems: string[]) => void;
  initialSelectedItems?: string[];
}

const ItemTemplateSelection: React.FC<ItemTemplateSelectionProps> = ({
  courseId,
  onItemsSelected,
  initialSelectedItems = [],
}) => {
  const { itemTemplates, loading, error } = useItemTemplateData();
  const [selectedItems, setSelectedItems] = useState<string[]>(initialSelectedItems);
  const [filter, setFilter] = useState<SimpleEffectType | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredItems, setFilteredItems] = useState<ItemTemplate[]>([]);

  useEffect(() => {
    // Apply filtering and searching
    let result = [...itemTemplates];

    // Apply effect type filter
    if (filter !== 'all') {
      result = filterItemTemplatesByEffect(result, filter);
    }

    // Apply search term
    if (searchTerm) {
      result = filterItemTemplatesBySearch(result, searchTerm);
    }

    setFilteredItems(result);
  }, [filter, searchTerm, itemTemplates]);

  const toggleItemSelection = (itemId: string) => {
    setSelectedItems((prev) => {
      if (prev.includes(itemId)) {
        return prev.filter((id) => id !== itemId);
      } else {
        return [...prev, itemId];
      }
    });
  };

  const handleSaveSelection = () => {
    if (onItemsSelected) {
      onItemsSelected(selectedItems);
    }
    console.log(courseId);
  };

  const getEffectStyleClass = (effect: EffectType) => {
    const simpleEffect = getSimpleEffectType(effect);
    switch (simpleEffect) {
      case SimpleEffectType.Gold:
        return styles.itemEffectGold;
      case SimpleEffectType.Exp:
        return styles.itemEffectExp;
      default:
        return '';
    }
  };

  if (loading) {
    return <div className={styles.loading}>Loading item templates...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Item Templates</h2>
        <span className={styles.itemsCount}>
          {selectedItems.length} of {itemTemplates.length} selected
        </span>
      </div>

      <div className={styles.searchContainer}>
        <Search size={16} className={styles.searchIcon} />
        <input
          type="text"
          placeholder="Search items..."
          className={styles.searchInput}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className={styles.filterContainer}>
        <button
          className={`${styles.filterButton} ${filter === 'all' ? styles.filterButtonActive : ''}`}
          onClick={() => setFilter('all')}
        >
          All
        </button>
        <button
          className={`${styles.filterButton} ${filter === SimpleEffectType.Gold ? styles.filterButtonActive : ''}`}
          onClick={() => setFilter(SimpleEffectType.Gold)}
        >
          Gold
        </button>
        <button
          className={`${styles.filterButton} ${filter === SimpleEffectType.Exp ? styles.filterButtonActive : ''}`}
          onClick={() => setFilter(SimpleEffectType.Exp)}
        >
          Experience
        </button>
      </div>

      {filteredItems.length > 0 ? (
        <div className={styles.itemsGrid}>
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className={`${styles.itemCard} ${selectedItems.includes(item.id) ? styles.selected : ''}`}
            >
              <div className={styles.checkboxContainer}>
                <input
                  type="checkbox"
                  className={styles.checkbox}
                  checked={selectedItems.includes(item.id)}
                  onChange={() => toggleItemSelection(item.id)}
                  id={`item-${item.id}`}
                />
              </div>

              <div className={styles.itemHeader}>
                <div className={styles.imageContainer}>
                  <Image
                    src={item.img}
                    alt={item.name}
                    width={50}
                    height={50}
                    className={styles.itemImage}
                  />
                </div>

                <div className={styles.itemInfo}>
                  <h3 className={styles.itemName}>{item.name}</h3>
                  <p className={`${styles.itemEffect} ${getEffectStyleClass(item.effect)}`}>
                    {item.effectDescription.replace('\n', ' ')}
                  </p>
                </div>
              </div>

              <p className={styles.itemDescription}>{item.description}</p>

              <div className={styles.itemFooter}>
                <div className={styles.goldCost}>
                  <span className={styles.goldIcon}>
                    <Image
                      src={rewardModalImage.rewardIconGems}
                      alt="Gem Icon"
                      width={16}
                      height={16}
                    />
                  </span>
                  {item.gold} Gold
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.noResults}>
          {itemTemplates.length === 0
            ? 'No item templates available.'
            : 'No items found matching your search criteria.'}
        </div>
      )}

      <button
        className={`${styles.saveButton} ${selectedItems.length === 0 ? styles.saveButtonDisabled : ''}`}
        onClick={handleSaveSelection}
        disabled={selectedItems.length === 0}
      >
        Save Selection
      </button>
    </div>
  );
};

export default ItemTemplateSelection;
