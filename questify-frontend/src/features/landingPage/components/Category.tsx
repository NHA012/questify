import React from 'react';
import styles from './Category.module.css';
import Image from 'next/image';
import { landingPageImage } from '@/assets/images';

interface CategoryProps {
  backgroundColor: string;
  icon: string;
  name: string;
  courseCount: number;
}

const CategoryCard: React.FC<CategoryProps> = ({ backgroundColor, icon, name, courseCount }) => {
  return (
    <div className={styles.categoryCard} style={{ backgroundColor }}>
      <div className={styles.iconWrapper}>
        <Image src={icon} alt={name} width={40} height={40} />
      </div>
      <div className={styles.categoryContent}>
        <h3 className={styles.categoryName}>{name}</h3>
        <p className={styles.courseCount}>{courseCount.toLocaleString()} Courses</p>
      </div>
    </div>
  );
};

const Category: React.FC = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Browse top category</h1>

      <div className={styles.categoryGrid}>
        <CategoryCard
          backgroundColor="#EBEBFF"
          icon={landingPageImage.labelIcon}
          name="Label"
          courseCount={63476}
        />
        <CategoryCard
          backgroundColor="#E1F7E3"
          icon={landingPageImage.businessIcon}
          name="Business"
          courseCount={52822}
        />
        <CategoryCard
          backgroundColor="#FFF2E5"
          icon={landingPageImage.financeAndAccountingIcon}
          name="Finance & Accounting"
          courseCount={33841}
        />
        <CategoryCard
          backgroundColor="#FFF0F0"
          icon={landingPageImage.itAndSoftwareIcon}
          name="IT & Software"
          courseCount={22649}
        />
        <CategoryCard
          backgroundColor="#FFF2E5"
          icon={landingPageImage.personalDevelopmentIcon}
          name="Personal Development"
          courseCount={20126}
        />
        <CategoryCard
          backgroundColor="#F5F7FA"
          icon={landingPageImage.officeProductivityIcon}
          name="Office Productivity"
          courseCount={13932}
        />
        <CategoryCard
          backgroundColor="#EBEBFF"
          icon={landingPageImage.marketingIcon}
          name="Marketing"
          courseCount={12068}
        />
        <CategoryCard
          backgroundColor="#F5F7FA"
          icon={landingPageImage.photographyIcon}
          name="Photography & Video"
          courseCount={6196}
        />
        <CategoryCard
          backgroundColor="#FFF2E5"
          icon={landingPageImage.lifestyleIcon}
          name="Lifestyle"
          courseCount={2736}
        />
        <CategoryCard
          backgroundColor="#FFEEE8"
          icon={landingPageImage.designIcon}
          name="Design"
          courseCount={2600}
        />
        <CategoryCard
          backgroundColor="#E1F7E3"
          icon={landingPageImage.healthAndFitnessIcon}
          name="Health & Fitness"
          courseCount={1678}
        />
        <CategoryCard
          backgroundColor="#FFF2E5"
          icon={landingPageImage.musicIcon}
          name="Music"
          courseCount={959}
        />
      </div>

      <div className={styles.footer}>
        <div className={styles.footerText}>We have more category & subcategory.</div>
        <div className={styles.browseButton}>
          <div className={styles.browseText}>Browse All</div>
          <div className={styles.arrowIcon}>
            <svg
              width="25"
              height="24"
              viewBox="0 0 25 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4.25 12H20.75"
                stroke="#FF6636"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M14 5.25L20.75 12L14 18.75"
                stroke="#FF6636"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Category;
