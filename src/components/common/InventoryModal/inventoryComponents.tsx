import React from 'react';
import Image from 'next/image';
import styles from './inventoryModal.module.css';
import { Item } from './inventoryTypes';
import { inventoryModalImage, rewardModalImage } from '@/assets/images';

// NavTab component
interface NavTabProps {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

const categoryIconMap = {
  all: inventoryModalImage.itemTypeAccessoriesImage,
  exp: inventoryModalImage.itemTypeAccessoriesImage,
  time: inventoryModalImage.itemTypeAccessoriesImage,
  gold: inventoryModalImage.itemTypeAccessoriesImage,
};

export const NavTab: React.FC<NavTabProps> = ({ categories, activeCategory, onCategoryChange }) => {
  return (
    <ul className={styles.navPills}>
      {categories.map((category) => (
        <li
          key={category}
          className={activeCategory === category ? styles.activeTab : ''}
          id={`${category.toLowerCase()}-tab`}
        >
          <a
            className={styles.oneLine}
            href={`#item-category-${category.toLowerCase()}`}
            onClick={(e) => {
              e.preventDefault();
              onCategoryChange(category);
            }}
            style={{
              backgroundImage:
                activeCategory === category
                  ? `url(${inventoryModalImage.selectedTypeTab})`
                  : `url(${inventoryModalImage.typeTab})`,
            }}
          >
            <Image
              className={styles.tabIcon}
              src={categoryIconMap[category.toLowerCase()]}
              alt={category}
              draggable={false}
              width={48}
              height={48}
            />
            <span className={styles.bigFont}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
};

// ContentTab component
interface ContentTabProps {
  items: Item[];
  activeCategory: string;
  selectedItem: Item | null;
  onItemSelect: (item: Item) => void;
  onBuy: (itemId: string) => void;
  onUse: (itemId: string) => void;
  hasActiveEffect: boolean;
}

export const ContentTab: React.FC<ContentTabProps> = ({
  items,
  activeCategory,
  selectedItem,
  onItemSelect,
  onBuy,
  onUse,
  hasActiveEffect,
}) => {
  const filteredItems =
    activeCategory === 'all' ? items : items.filter((item) => item.effect === activeCategory);

  return (
    <div className={styles.tabContent}>
      <div className={styles.tabPane} id={`item-category-${activeCategory}`}>
        <div className={styles.nano}>
          <div className={styles.nanoContent}>
            <div className={styles.itemsContainer}>
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className={`${styles.item} ${item.quantity <= 0 ? styles.grayedItem : ''}`}
                  onClick={() => onItemSelect(item)}
                  data-item-id={item.id}
                  style={{
                    backgroundImage:
                      selectedItem?.id === item.id
                        ? `url(${inventoryModalImage.selectedItemBox})`
                        : `url(${inventoryModalImage.itemBox})`,
                  }}
                >
                  <div className={styles.itemBody}>
                    <div className={styles.itemName}>
                      <strong className={styles.bigFont}>{item.name}</strong>
                    </div>
                    <Image
                      className={styles.itemImg}
                      src={item.img}
                      alt={item.name}
                      draggable={false}
                      width={60}
                      height={60}
                    />
                    <span className={styles.bigFont} style={{ color: '#483C32' }}>
                      Quantity: {item.quantity}
                    </span>
                  </div>
                  <div className={styles.itemFooter}>
                    <div className={styles.priceContainer}>
                      <span className={styles.price}>
                        <Image
                          src={rewardModalImage.rewardIconGems}
                          alt="Gem Icon"
                          draggable={false}
                          width={18}
                          height={18}
                        />
                        <span className={styles.bigFont} style={{ color: '#01405b' }}>
                          {item.gold}
                        </span>
                      </span>
                    </div>
                    <button
                      className={`${styles.btn} ${styles.buyButton}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onBuy(item.id);
                      }}
                    >
                      BUY
                    </button>
                    <button
                      className={`${styles.btn} ${styles.useButton} ${
                        item.quantity <= 0 || hasActiveEffect ? styles.disabled : ''
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (item.quantity > 0 && !hasActiveEffect) onUse(item.id);
                      }}
                      disabled={item.quantity <= 0 || hasActiveEffect}
                      title={
                        hasActiveEffect
                          ? 'You already have an active effect'
                          : item.quantity <= 0
                            ? 'No items available'
                            : 'Use item'
                      }
                    >
                      USE
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className={styles.clearfix}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

// DetailView component
interface DetailViewProps {
  selectedItem: Item | null;
  onBuy: (itemId: string) => void;
  onUse: (itemId: string) => void;
  hasActiveEffect: boolean;
}

export const DetailView: React.FC<DetailViewProps> = ({
  selectedItem,
  onBuy,
  onUse,
  hasActiveEffect,
}) => {
  if (!selectedItem) return null;

  return (
    <div id="item-details-view" className={styles.itemDetailsView}>
      <div id="item-title" className={styles.itemTitle}>
        <h2 className={`${styles.oneLine} ${styles.bigFont}`} dir="auto">
          {selectedItem.name}
        </h2>
      </div>

      <div id="item-details-body" className={styles.itemDetailsBody}>
        <div className={styles.detailNano}>
          <div className={styles.detailNanoContent}>
            <div id="item-container" className={styles.itemDetailContainer}>
              <Image
                className={styles.itemDetailImg}
                src={selectedItem.img}
                alt={selectedItem.name}
                draggable={false}
                width={150}
                height={150}
              />
              <Image
                className={styles.itemDetailShadow}
                src={selectedItem.img}
                alt={selectedItem.name}
                draggable={false}
                width={150}
                height={150}
              />
            </div>

            <Image
              className={styles.detailHr}
              src={inventoryModalImage.hrImage}
              draggable={false}
              alt="Hr"
              width={299}
              height={10}
            />

            <div className={`${styles.detailStatRow} ${styles.bigFont}`}>
              {selectedItem.effectDescription ? (
                selectedItem.effectDescription.split('\n').length > 1 ? (
                  <>
                    <div className={styles.detailStatLabel}>
                      {selectedItem.effectDescription.split('\n')[0]}
                    </div>
                    <div className={styles.detailStat}>
                      {selectedItem.effectDescription.split('\n')[1]}
                    </div>
                  </>
                ) : (
                  <div className={styles.detailStat}>{selectedItem.effectDescription}</div>
                )
              ) : (
                <div className={styles.detailStat}>No effect description available</div>
              )}
            </div>

            <Image
              className={styles.detailHr}
              src={inventoryModalImage.hrImage}
              draggable={false}
              alt="Hr"
              width={299}
              height={10}
            />

            <div className={styles.detailItemDescription} dir="auto">
              {selectedItem.description}
            </div>
          </div>
        </div>
      </div>

      <div className={styles.detailFooter}>
        <button
          className={`${styles.detailBtn} ${styles.detailBuyButton}`}
          onClick={(e) => {
            e.stopPropagation();
            onBuy(selectedItem.id);
          }}
        >
          BUY ({selectedItem.gold}
          <Image
            src={rewardModalImage.rewardIconGems}
            alt="Gem Icon"
            draggable={false}
            width={20}
            height={20}
            className={styles.detailBtnIcon}
          />
          )
        </button>

        <button
          className={`${styles.detailBtn} ${styles.detailUseButton} ${
            selectedItem.quantity <= 0 || hasActiveEffect ? styles.disabled : ''
          }`}
          onClick={(e) => {
            e.stopPropagation();
            if (selectedItem.quantity > 0 && !hasActiveEffect) onUse(selectedItem.id);
          }}
          disabled={selectedItem.quantity <= 0 || hasActiveEffect}
          title={
            hasActiveEffect
              ? 'You already have an active effect'
              : selectedItem.quantity <= 0
                ? 'No items available'
                : 'Use item'
          }
        >
          USE
        </button>
      </div>
    </div>
  );
};
