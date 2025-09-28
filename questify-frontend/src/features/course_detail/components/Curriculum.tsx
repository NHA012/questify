import React, { useState } from 'react';
import styles from './Curriculum.module.css';

interface StatItemProps {
  icon?: string;
  type?: string;
  text: string;
}

interface LevelProps {
  title: string;
  duration: string;
  isPreview?: boolean;
  type?: string;
}

interface SectionProps {
  title: string;
  stats: Array<{ type?: string; icon?: string; text: string }>;
  levels?: Array<{
    id: string;
    title: string;
    duration: string;
    isPreview?: boolean;
    type?: string;
  }>;
  expanded?: boolean;
  onToggle?: () => void;
}

interface CurriculumSectionProps {
  title: string;
  stats: Array<{ type?: string; icon?: string; text: string }>;
  sections: Array<{
    id: string;
    title: string;
    stats: Array<{ type?: string; icon?: string; text: string }>;
    levels?: Array<{
      id: string;
      title: string;
      duration: string;
      isPreview?: boolean;
      type?: string;
    }>;
  }>;
}

// Components
export const StatItem: React.FC<StatItemProps> = ({ icon, type, text }) => {
  // Generate icon based on type if not provided
  const iconHtml = icon || getIconByType(type);

  return (
    <div className={styles.stat}>
      {iconHtml && <div dangerouslySetInnerHTML={{ __html: iconHtml }} />}
      <div className={styles.statText}>{text}</div>
    </div>
  );
};

export const Level: React.FC<LevelProps> = ({ title, duration, isPreview, type }) => {
  // Get appropriate icon based on level type
  const levelIcon = getLevelIcon(type);

  return (
    <div className={styles.level}>
      <div className={styles.levelInfo}>
        <div dangerouslySetInnerHTML={{ __html: levelIcon }} />
        <div className={styles.levelTitle}>
          {title}
          {isPreview && <span className={styles.previewTag}>Preview</span>}
        </div>
      </div>
      <div className={styles.levelDuration}>{duration}</div>
    </div>
  );
};

export const Section: React.FC<SectionProps> = ({ title, stats, levels, expanded, onToggle }) => {
  const sectionClass = expanded ? styles.sectionExpanded : styles.section;
  const arrowIcon = expanded
    ? '<svg id="arrow-up" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" class="arrow-up" style="width: 30px; height: 20px; padding: 0 4.167px"> <path d="M15.8307 12.917L9.9974 7.08366L4.16406 12.917" stroke="#00ADB5" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> </svg>'
    : '<svg id="arrow-down" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" class="arrow-down" style="width: 30px; height: 20px; padding: 0 4.167px"> <path d="M15.8307 7.08301L9.9974 12.9163L4.16406 7.08301" stroke="#6E7485" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> </svg>';

  return (
    <div className={sectionClass}>
      <div className={styles.sectionHeader} onClick={onToggle}>
        <div className={styles.sectionTitle}>
          <div dangerouslySetInnerHTML={{ __html: arrowIcon }} />
          <div className={`${styles.titleText} ${expanded ? styles.titleTextExpanded : ''}`}>
            {title}
          </div>
        </div>
        <div className={styles.sectionStats}>
          {stats.map((stat, index) => (
            <StatItem key={index} icon={stat.icon} type={stat.type} text={stat.text} />
          ))}
        </div>
      </div>
      {expanded && levels && (
        <div className={styles.sectionContent}>
          {levels.map((level) => (
            <Level
              key={level.id}
              title={level.title}
              duration={level.duration}
              isPreview={level.isPreview}
              type={level.type}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const CurriculumSection: React.FC<CurriculumSectionProps> = ({ title, stats, sections }) => {
  return (
    <div className={styles.curriculum}>
      <div className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
        <div className={styles.stats}>
          {stats.map((stat, index) => (
            <StatItem key={index} icon={stat.icon} type={stat.type} text={stat.text} />
          ))}
        </div>
      </div>
      <div className={styles.content}>
        {sections.map((section) => (
          <SectionWithState key={section.id} {...section} />
        ))}
      </div>
    </div>
  );
};

// Helper component to manage expanded state for each section
const SectionWithState: React.FC<Omit<SectionProps, 'expanded' | 'onToggle'>> = (props) => {
  const [expanded, setExpanded] = useState(false);

  return <Section {...props} expanded={expanded} onToggle={() => setExpanded((prev) => !prev)} />;
};

// Helper functions to generate icons based on types
function getIconByType(type?: string): string {
  switch (type) {
    case 'sections':
      return '<svg id="I6865:31465;2442:71225" layer-name="FolderNotchOpen" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" class="icon folder-icon" style="width: 20px; height: 20px; color: #00ADB5"> <path d="M2.5 16.25V5C2.5 4.83424 2.56585 4.67527 2.68306 4.55806C2.80027 4.44085 2.95924 4.375 3.125 4.375H7.29167C7.4269 4.375 7.55848 4.41886 7.66667 4.5L9.83333 6.125C9.94152 6.20614 10.0731 6.25 10.2083 6.25H15.625C15.7908 6.25 15.9497 6.31585 16.0669 6.43306C16.1842 6.55027 16.25 6.70924 16.25 6.875V8.75" stroke="#00ADB5" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M2.5 16.25L4.84285 10.3929C4.88924 10.2769 4.96932 10.1775 5.07275 10.1075C5.17619 10.0374 5.29823 10 5.42315 10H9.18576C9.30916 10 9.42979 9.96348 9.53245 9.89503L11.0925 8.85497C11.1952 8.78652 11.3158 8.75 11.4392 8.75H17.8829C17.9819 8.75 18.0795 8.77353 18.1677 8.81866C18.2558 8.86379 18.332 8.92922 18.3899 9.00956C18.4478 9.0899 18.4858 9.18284 18.5007 9.28074C18.5156 9.37864 18.5071 9.47869 18.4758 9.57264L16.25 16.25H2.5Z" stroke="#00ADB5" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"></path> </svg>';
    case 'levels':
      return '<svg id="I6865:31466;2442:71219" layer-name="PlayCircle" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" class="icon play-icon" style="width: 20px; height: 20px; color: #564FFD"> <path d="M10 17.5C14.1421 17.5 17.5 14.1421 17.5 10C17.5 5.85786 14.1421 2.5 10 2.5C5.85786 2.5 2.5 5.85786 2.5 10C2.5 14.1421 5.85786 17.5 10 17.5Z" stroke="#564FFD" stroke-width="1.3" stroke-miterlimit="10"></path> <path d="M12.5 10L8.75 7.5V12.5L12.5 10Z" stroke="#564FFD" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"></path> </svg>';
    case 'duration':
      return '<svg id="I6865:31467;2442:71208" layer-name="Clock" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" class="icon clock-icon" style="width: 20px; height: 20px; color: #82FDF3"> <path d="M10 17.5C14.1421 17.5 17.5 14.1421 17.5 10C17.5 5.85786 14.1421 2.5 10 2.5C5.85786 2.5 2.5 5.85786 2.5 10C2.5 14.1421 5.85786 17.5 10 17.5Z" stroke="#82FDF3" stroke-width="1.3" stroke-miterlimit="10"></path> <path d="M10 5.625V10H14.375" stroke="#82FDF3" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"></path> </svg>';
    default:
      return '';
  }
}

function getLevelIcon(type?: string): string {
  switch (type) {
    case 'video':
      return '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13.5952 7.57363L4.59667 2.07434C4.52088 2.02802 4.43411 2.00273 4.3453 2.00106C4.25649 1.9994 4.16884 2.02143 4.09136 2.06488C4.01389 2.10833 3.94939 2.17163 3.90449 2.24828C3.8596 2.32493 3.83594 2.41215 3.83594 2.50098V13.4996C3.83594 13.5884 3.8596 13.6756 3.90449 13.7523C3.94939 13.8289 4.01389 13.8922 4.09136 13.9357C4.16884 13.9791 4.25649 14.0011 4.3453 13.9995C4.43411 13.9978 4.52088 13.9725 4.59667 13.9262L13.5952 8.4269C13.6683 8.38224 13.7287 8.31955 13.7706 8.24484C13.8125 8.17014 13.8345 8.08592 13.8345 8.00027C13.8345 7.91461 13.8125 7.8304 13.7706 7.75569C13.7287 7.68098 13.6683 7.61829 13.5952 7.57363Z" fill="#1D2026"></path></svg>';
    case 'text':
      return '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13 2H3C2.44772 2 2 2.44772 2 3V13C2 13.5523 2.44772 14 3 14H13C13.5523 14 14 13.5523 14 13V3C14 2.44772 13.5523 2 13 2Z" stroke="#1D2026" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M4.5 5.5H11.5" stroke="#1D2026" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M4.5 8H11.5" stroke="#1D2026" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M4.5 10.5H8.5" stroke="#1D2026" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    case 'quiz':
      return '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14Z" stroke="#1D2026" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M8 5V8.5" stroke="#1D2026" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M8 11.5C8.41421 11.5 8.75 11.1642 8.75 10.75C8.75 10.3358 8.41421 10 8 10C7.58579 10 7.25 10.3358 7.25 10.75C7.25 11.1642 7.58579 11.5 8 11.5Z" fill="#1D2026"/></svg>';
    default:
      return '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13.5952 7.57363L4.59667 2.07434C4.52088 2.02802 4.43411 2.00273 4.3453 2.00106C4.25649 1.9994 4.16884 2.02143 4.09136 2.06488C4.01389 2.10833 3.94939 2.17163 3.90449 2.24828C3.8596 2.32493 3.83594 2.41215 3.83594 2.50098V13.4996C3.83594 13.5884 3.8596 13.6756 3.90449 13.7523C3.94939 13.8289 4.01389 13.8922 4.09136 13.9357C4.16884 13.9791 4.25649 14.0011 4.3453 13.9995C4.43411 13.9978 4.52088 13.9725 4.59667 13.9262L13.5952 8.4269C13.6683 8.38224 13.7287 8.31955 13.7706 8.24484C13.8125 8.17014 13.8345 8.08592 13.8345 8.00027C13.8345 7.91461 13.8125 7.8304 13.7706 7.75569C13.7287 7.68098 13.6683 7.61829 13.5952 7.57363Z" fill="#1D2026"></path></svg>';
  }
}

// Define the CurriculumData type for external data
export interface CurriculumData {
  title: string;
  stats: Array<{
    type?: string;
    icon?: string;
    text: string;
  }>;
  sections: Array<{
    id: string;
    title: string;
    stats: Array<{
      type?: string;
      icon?: string;
      text: string;
    }>;
    levels?: Array<{
      id: string;
      title: string;
      duration: string;
      isPreview?: boolean;
      type?: string;
    }>;
  }>;
}

// Main component export
interface CurriculumProps {
  curriculumData: CurriculumData;
}

const Curriculum: React.FC<CurriculumProps> = ({ curriculumData }) => {
  return (
    <CurriculumSection
      title={curriculumData.title}
      stats={curriculumData.stats}
      sections={curriculumData.sections}
    />
  );
};

export default Curriculum;
