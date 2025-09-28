import React from 'react';
import Image from 'next/image';
import styles from './inventoryButton.module.css';
import { inventoryModalImage } from '@/assets/images';

interface InventoryButtonProps {
  onClick: () => void;
}

const InventoryButton: React.FC<InventoryButtonProps> = ({ onClick }) => {
  return (
    <div className={styles.buttonContainer}>
      <button className={styles.inventoryButton} onClick={onClick}>
        <Image
          src={inventoryModalImage.inventoryButtonImage}
          alt="Inventory"
          width={100}
          height={100}
          className={styles.buttonImage}
          draggable={false}
        />
      </button>
    </div>
  );
};

export default InventoryButton;
