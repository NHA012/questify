import Image from 'next/image';
import { backButtonIcon, sectionsIcon } from '@/assets/icons';
import style from './Header.module.css';

interface HeaderCourseDetailProp {
  name: string;
  islandCount: number;
}

const HeaderCourseDetail: React.FC<HeaderCourseDetailProp> = ({ name, islandCount }) => {
  return (
    <div className={`${style.courseDetail} bg-F5F7FA`}>
      <div className={style.courseDetail__container}>
        <div className={style.courseDetail__part1}>
          <button className={style.courseDetail__backButton}>
            <Image src={backButtonIcon} alt="Back" width={48} height={48} />
          </button>
          <div className={style.courseDetail__info}>
            <h1 className={style.courseDetail__title}>{name}</h1>
            <div className={style.courseDetail__meta}>
              <div className={style.courseDetail__metaItem}>
                <Image src={sectionsIcon} alt="Sections" width={24} height={24} />
                <span>{islandCount} Islands</span>
              </div>
            </div>
          </div>
        </div>
        <div className={style.courseDetail__part2}>
          <button className={style.courseDetail__reviewButton}>Write a Review</button>
        </div>
      </div>
    </div>
  );
};

export default HeaderCourseDetail;
