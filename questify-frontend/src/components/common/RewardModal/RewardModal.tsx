import React, { useRef, useCallback, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import styles from './rewardModal.module.css';
import { rewardModalImage } from '@/assets/images';

interface Reward {
  type: 'xp' | 'gems' | 'item' | 'point';
  amount?: number;
  itemName?: string;
  icon: string;
}

interface AchievementPanel {
  id: string;
  description: string;
  rewards: Reward[];
}

interface RewardModalProps {
  progress: number;
  achievements: AchievementPanel[];
  onClose: () => void;
  closeOnOutsideClick?: boolean;
}

const RewardModal: React.FC<RewardModalProps> = ({
  progress,
  achievements,
  onClose,
  closeOnOutsideClick = true,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    },
    [onClose],
  );

  useEffect(() => {
    if (!closeOnOutsideClick) return;
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleClickOutside, closeOnOutsideClick]);

  const handleContinueClick = () => {
    router.back();
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'xp':
        return rewardModalImage.rewardIconXp;
      case 'gems':
        return rewardModalImage.rewardIconGems;
      default:
        return '';
    }
  };

  const calculateTotals = () => {
    let totalXP = 0;
    let totalGems = 0;
    let totalPoint = 0;

    achievements.forEach((achievement) => {
      achievement.rewards.forEach((reward) => {
        if (reward.type === 'xp') totalXP += reward.amount || 0;
        if (reward.type === 'gems') totalGems += reward.amount || 0;
        if (reward.type === 'point') totalPoint += reward.amount || 0;
      });
    });

    return { totalXP, totalPoint, totalGems };
  };

  const { totalXP, totalPoint } = calculateTotals();

  const backgroundWrapperStyle = {
    borderImage: `url(${rewardModalImage.victoryModalBorderBackground}) 250 0 100 0 fill round`,
  };

  const modalFooterStyle = {
    background: `url(${rewardModalImage.xpGemsParchment})`,
  };

  // const victoryHeaderStyle = {
  //   background: `rgba(0, 0, 0, 0) url(${rewardModalImage.victoryHero}) no-repeat`,
  //   backgroundPosition: 'center -88px',
  // };

  const achievementPanelStyle = {
    background: `rgba(0, 0, 0, 0) url(${rewardModalImage.victoryModalShelf}) no-repeat center 73px`,
  };

  const rewardPanelStyle = {
    background: `url(${rewardModalImage.rewardPlateWide}) no-repeat center`,
    backgroundSize: 'contain',
  };

  return (
    <div id="reward-modal" className={styles.modal}>
      <div className={styles.modalDialog}>
        <div ref={modalRef} className={styles.backgroundWrapper} style={backgroundWrapperStyle}>
          <div className={styles.modalContent}>
            <div className={styles.modalBody}>
              {achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className={styles.achievementPanel}
                  style={achievementPanelStyle}
                >
                  <div className={styles.achievementDescription}>{achievement.description}</div>
                  <div className={styles.achievementRewards}>
                    {achievement.rewards
                      .filter((reward) => reward.type === 'xp' || reward.type === 'gems')
                      .map((reward, index) => (
                        <div key={index} className={styles.rewardPanel} style={rewardPanelStyle}>
                          <div className={styles.rewardImageContainer}>
                            <Image
                              src={getIcon(reward.icon)}
                              alt={
                                reward.type === 'item'
                                  ? 'New Item'
                                  : `${reward.type.toUpperCase()} Gained`
                              }
                              width={45}
                              height={45}
                            />
                          </div>
                          <div className={styles.rewardText}>
                            {reward.type === 'item' ? reward.itemName : `+${reward.amount}`}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
            <div className={styles.modalFooter} style={modalFooterStyle}>
              <div className={`${styles.totalWrapper} ${styles.xpWrapper}`}>
                <div className={styles.totalCount}>{totalXP}</div>
                <div className={styles.totalLabel}>XP Gained</div>
                <div className={styles.xpBarOuter}>
                  <div className={styles.xpBarAlreadyAchieved} style={{ width: `${progress}%` }} />
                  <div className={styles.xpBarTotal} style={{ width: `${progress}%` }} />
                </div>
              </div>
              <div className={`${styles.totalWrapper} ${styles.gemWrapper}`}>
                {/* <div className={styles.totalCount}>{totalGems}</div>
                <div className={styles.totalLabel}>Gems Gained</div> */}
                <div className={styles.totalCount}>{totalPoint}</div>
                <div className={styles.totalLabel}>Point Achieved</div>
              </div>
              <div className={styles.buttonContainer}>
                <button className={styles.actionButton}>
                  <Image
                    src={rewardModalImage.viewLeaderboardButton}
                    alt="View Leaderboard"
                    width={201}
                    height={60}
                    draggable={false}
                  />
                </button>
                <button className={styles.actionButton} onClick={handleContinueClick}>
                  <Image
                    src={rewardModalImage.continueButton}
                    alt="Continue"
                    width={263}
                    height={60}
                    draggable={false}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RewardModal;
