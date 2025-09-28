import React from 'react';
import { useRouter } from 'next/router';
import styles from './LeaderboardModal.module.css';
import { inventoryModalImage } from '@/assets/images';
import { AttemptData, LeaderboardEntry } from '@/services/progressService';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { LevelContent } from '@datn242/questify-common';

// NavTab component
interface NavTabProps {
  tabs: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const NavTab: React.FC<NavTabProps> = ({ tabs, activeTab, onTabChange }) => {
  return (
    <ul className={styles.navPills}>
      {tabs.map((tab) => (
        <li
          key={tab}
          className={activeTab === tab ? styles.activeTab : ''}
          id={`${tab.toLowerCase()}-tab`}
        >
          <a
            className={styles.oneLine}
            href={`#${tab.toLowerCase()}-tab-content`}
            onClick={(e) => {
              e.preventDefault();
              onTabChange(tab);
            }}
            style={{
              backgroundImage:
                activeTab === tab
                  ? `url(${inventoryModalImage.selectedTypeTab})`
                  : `url(${inventoryModalImage.typeTab})`,
            }}
          >
            <span className={styles.bigFont}>
              {tab === 'leaderboard' ? 'Leaderboard' : 'Your Score'}
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
};

// ContentTab component for Leaderboard
interface ContentTabProps {
  leaderboardEntries: LeaderboardEntry[];
  userAttempts: AttemptData[];
  activeTab: string;
  formatDate: (date?: string) => string;
  formatDateTime: (date?: string | Date) => string;
  isInstructor?: boolean;
  contentType?: string;
  levelId?: string;
}

export const ContentTab: React.FC<ContentTabProps> = ({
  leaderboardEntries,
  userAttempts,
  activeTab,
  formatDateTime,
  isInstructor = false,
  contentType,
  levelId,
}) => {
  const { userData: currentUser } = useCurrentUser();
  const router = useRouter();

  const handleViewSubmission = async (studentId: string, levelId: string) => {
    try {
      const codeProblemResponse = await fetch(`/api/code-problem/level/${levelId}`);

      if (!codeProblemResponse.ok) {
        throw new Error(`Failed to fetch code problem: ${codeProblemResponse.statusText}`);
      }

      const codeProblemData = await codeProblemResponse.json();

      router.push(`/instructor/problems/${codeProblemData.id}/student/${studentId}`);
    } catch (err) {
      console.error('Error fetching code problem:', err);
    }
  };

  const isCodeProblem = contentType === LevelContent.CodeProblem;

  // For instructor view, always show leaderboard
  if (isInstructor) {
    return (
      <div className={styles.tabContent}>
        <div className={styles.tabPane} id="leaderboard-tab-content">
          <div className={styles.nano}>
            <div className={styles.nanoContent}>
              {/* Apply code problem class to adjust column widths when necessary */}
              <div
                className={`${styles.leaderboardContent} ${isCodeProblem ? styles.withActions : ''}`}
              >
                <div
                  className={`${styles.leaderboardHeader} ${isCodeProblem ? styles.withActions : ''}`}
                >
                  <div className={styles.rankHeader}>Rank</div>
                  <div className={styles.playerHeader}>Player</div>
                  <div className={styles.scoreHeader}>Score</div>
                  <div className={styles.dateHeader}>Completion Time</div>
                  {isCodeProblem && <div className={styles.actionsHeader}>Actions</div>}
                </div>
                <div className={styles.leaderboardRows}>
                  {leaderboardEntries.map((entry) => (
                    <div
                      key={entry.studentId}
                      className={`${styles.leaderboardRow} ${isCodeProblem ? styles.withActions : ''}`}
                    >
                      <div className={styles.rankCell}>
                        <span className={styles.rankNumber}>{entry.rank}</span>
                      </div>
                      <div className={styles.playerCell}>
                        {entry.studentName || 'Unknown Player'}
                      </div>
                      <div className={styles.scoreCell}>{entry.points}</div>
                      <div className={styles.dateCell}>{entry.completionTime || 'N/A'}</div>
                      {isCodeProblem && (
                        <div className={styles.actionsCell}>
                          <button
                            className={styles.viewButton}
                            onClick={() => handleViewSubmission(entry.studentId, levelId)}
                          >
                            View
                          </button>
                        </div>
                      )}
                    </div>
                  ))}

                  {leaderboardEntries.length === 0 && (
                    <div className={styles.noData}>No scores available for this level yet.</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return <div className={styles.noData}>User data not available.</div>;
  }

  const userEntry = leaderboardEntries.find((entry) => entry.studentId === currentUser.id);

  return (
    <div className={styles.tabContent}>
      <div className={styles.tabPane} id={`${activeTab.toLowerCase()}-tab-content`}>
        <div className={styles.nano}>
          <div className={styles.nanoContent}>
            {activeTab === 'leaderboard' ? (
              <div className={styles.leaderboardContent}>
                <div className={styles.leaderboardHeader}>
                  <div className={styles.rankHeader}>Rank</div>
                  <div className={styles.playerHeader}>Player</div>
                  <div className={styles.scoreHeader}>Score</div>
                  <div className={styles.dateHeader}>Completion Time</div>
                </div>
                <div className={styles.leaderboardRows}>
                  {leaderboardEntries.map((entry) => (
                    <div
                      key={entry.studentId}
                      className={`${styles.leaderboardRow} ${entry.studentId === currentUser.id ? styles.currentUserRow : ''}`}
                    >
                      <div className={styles.rankCell}>
                        <span className={styles.rankNumber}>{entry.rank}</span>
                      </div>
                      <div className={styles.playerCell}>
                        {entry.studentName || 'Unknown Player'}
                      </div>
                      <div className={styles.scoreCell}>{entry.points}</div>
                      <div className={styles.dateCell}>{entry.completionTime || 'N/A'}</div>
                    </div>
                  ))}

                  {leaderboardEntries.length === 0 && (
                    <div className={styles.noData}>No scores available for this level yet.</div>
                  )}
                </div>
              </div>
            ) : (
              <div className={styles.yourScoreContent}>
                {userEntry ? (
                  <>
                    <div className={styles.scoreTabHeader}>
                      <div className={styles.scoreTitle}>Your Performance</div>
                      <div className={styles.scoreRank}>
                        Rank: <span className={styles.rankHighlight}>{userEntry.rank}</span>
                      </div>
                    </div>

                    <div className={styles.userScoreContainer}>
                      <div className={styles.userScoreBox}>
                        <div className={styles.scoreValue}>{userEntry.points}</div>
                        <div className={styles.scoreLabel}>Points</div>
                      </div>
                    </div>

                    <div className={styles.rankingInfo}>
                      <h3 className={styles.rankingTitle}>Your Ranking</h3>
                      <div className={styles.rankingBox}>
                        <div className={styles.rankPosition}>
                          <span className={styles.positionNumber}>{userEntry.rank}</span>
                          <span className={styles.positionText}>
                            {userEntry.rank === 1
                              ? '1st'
                              : userEntry.rank === 2
                                ? '2nd'
                                : userEntry.rank === 3
                                  ? '3rd'
                                  : `${userEntry.rank}th`}{' '}
                            place
                          </span>
                        </div>
                        <div className={styles.outOfTotal}>
                          out of {leaderboardEntries.length} players
                        </div>
                      </div>
                    </div>

                    {/* Attempt History */}
                    <div className={styles.attemptHistorySection}>
                      <h3 className={styles.attemptHistoryTitle}>Attempt History</h3>

                      {userAttempts.length > 0 ? (
                        <div className={styles.attemptHistoryTable}>
                          <div className={styles.attemptHeader}>
                            <div className={styles.attemptNumberHeader}>#</div>
                            <div className={styles.attemptDateHeader}>Date & Time</div>
                            <div className={styles.attemptScoreHeader}>Score</div>
                          </div>

                          <div className={styles.attemptRows}>
                            {userAttempts.map((attempt, index) => (
                              <div
                                key={attempt.id}
                                className={`${styles.attemptRow} ${attempt.point === userEntry.points ? styles.bestAttemptRow : ''}`}
                              >
                                <div className={styles.attemptNumberCell}>
                                  {userAttempts.length - index}
                                </div>
                                <div className={styles.attemptDateCell}>
                                  {formatDateTime(attempt.createdAt)}
                                </div>
                                <div className={styles.attemptScoreCell}>
                                  {attempt.point || 0}
                                  {attempt.point === userEntry.points && (
                                    <span className={styles.bestAttemptBadge}>Best</span>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className={styles.noAttempts}>
                          No attempts recorded for this level.
                        </div>
                      )}
                    </div>

                    <div className={styles.motivationMessage}>
                      {userEntry.rank === 1
                        ? "Congratulations! You're at the top of the leaderboard!"
                        : userEntry.rank <= 3
                          ? "Great job! You're in the top 3 players. Keep it up!"
                          : userEntry.rank <= 10
                            ? "Nice work! You're in the top 10. Can you climb higher?"
                            : 'Keep practicing to improve your rank!'}
                    </div>
                  </>
                ) : (
                  <div className={styles.noData}>
                    You have not completed this level yet. Complete the level to see your score and
                    ranking.
                  </div>
                )}
              </div>
            )}
            <div className={styles.clearfix}></div>
          </div>
        </div>
      </div>
    </div>
  );
};
