import React, { useState, useEffect } from 'react';
import styles from './FilterSideBar.module.css';

// Icon components
export const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M11.6667 3.5L5.25 9.91667L2.33333 7"
      stroke="white"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const StarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M8.27569 11.9208L11.4279 13.9179C11.8308 14.1732 12.3311 13.7935 12.2115 13.3232L11.3008 9.74052C11.2752 9.64073 11.2782 9.53573 11.3096 9.4376C11.3409 9.33946 11.3994 9.25218 11.4781 9.18577L14.3049 6.83306C14.6763 6.52392 14.4846 5.90751 14.0074 5.87654L10.3159 5.63696C10.2165 5.62986 10.1211 5.59465 10.0409 5.53545C9.96069 5.47625 9.89896 5.39548 9.86289 5.30255L8.48612 1.83549C8.44869 1.73685 8.38215 1.65194 8.29532 1.59201C8.2085 1.53209 8.1055 1.5 8 1.5C7.89451 1.5 7.79151 1.53209 7.70468 1.59201C7.61786 1.65194 7.55131 1.73685 7.51389 1.83549L6.13712 5.30255C6.10104 5.39548 6.03932 5.47625 5.95912 5.53545C5.87892 5.59465 5.78355 5.62986 5.68412 5.63696L1.99263 5.87654C1.51544 5.90751 1.32373 6.52392 1.69515 6.83306L4.52186 9.18577C4.60063 9.25218 4.65907 9.33946 4.69044 9.4376C4.72181 9.53573 4.72485 9.64073 4.6992 9.74052L3.85459 13.063C3.71111 13.6274 4.31143 14.083 4.79495 13.7767L7.72431 11.9208C7.8067 11.8683 7.90234 11.8405 8 11.8405C8.09767 11.8405 8.19331 11.8683 8.27569 11.9208Z"
      fill="#82FDF3"
    />
  </svg>
);

// Checkbox component
interface CheckboxProps {
  checked: boolean;
  onChange?: (checked: boolean) => void;
  label: string;
  count?: number;
  highlighted?: boolean;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  onChange,
  label,
  count,
  highlighted,
}) => {
  return (
    <div className={styles.checkboxContainer}>
      <div className={styles.checkboxWrapper}>
        <div
          className={`${styles.checkbox} ${checked ? styles.checkboxChecked : ''} ${highlighted ? styles.checkboxHighlighted : ''}`}
          onClick={() => onChange?.(!checked)}
        >
          {checked && <CheckIcon />}
        </div>
        <span className={`${styles.checkboxLabel} ${highlighted ? styles.labelHighlighted : ''}`}>
          {label}
        </span>
      </div>
      {count !== undefined && (
        <span className={`${styles.count} ${highlighted ? styles.countHighlighted : ''}`}>
          {count}
        </span>
      )}
    </div>
  );
};

// Filter Section component
interface FilterSectionProps {
  title: string;
  children: React.ReactNode;
  expanded?: boolean;
  onToggle?: () => void;
}

export const FilterSection: React.FC<FilterSectionProps> = ({
  title,
  children,
  expanded: defaultExpanded = true,
  onToggle,
}) => {
  const [expanded, setExpanded] = useState(defaultExpanded);

  const handleToggle = () => {
    setExpanded(!expanded);
    onToggle?.();
  };

  return (
    <div className={styles.filterSection}>
      <div className={styles.sectionHeader} onClick={handleToggle}>
        <h3 className={styles.sectionTitle}>{title}</h3>
        <button className={`${styles.toggleButton} ${expanded ? styles.expanded : ''}`}>
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M13 6L8 11L3 6"
              stroke="#1D2026"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
      {expanded && <div className={styles.sectionContent}>{children}</div>}
    </div>
  );
};

// Rating component
interface RatingFilterProps {
  value: number;
  count: number;
  onChange: (value: number) => void;
  selected: boolean;
}

const RatingFilter: React.FC<RatingFilterProps> = ({ value, count, onChange, selected }) => {
  return (
    <div className={styles.checkboxContainer}>
      <div className={styles.checkboxWrapper}>
        <div
          className={`${styles.checkbox} ${selected ? styles.checkboxChecked : ''}`}
          onClick={() => onChange(value)}
        >
          {selected && <CheckIcon />}
        </div>
        <div className={styles.ratingLabel}>
          <StarIcon />
          <span className={styles.checkboxLabel}>{value} & up</span>
        </div>
      </div>
      {count > 0 && <span className={styles.count}>{count}</span>}
    </div>
  );
};

// Main FilterSideBar component
interface FilterSideBarProps {
  onFilterChange?: (filters: object) => void;
  persistState?: boolean;
  filterCounts?: {
    categoryCounts: Record<string, number>;
    levelCounts: Record<string, number>;
    durationCounts: Record<string, number>;
    priceCounts: {
      free: number;
      paid: number;
    };
    ratingCounts: Record<number, number>;
  };
}

export const FilterSideBar: React.FC<FilterSideBarProps> = ({ onFilterChange, filterCounts }) => {
  // Create static object for initial states based on our courseData
  const initialCategoryFilters = {
    Development: false,
    Business: false,
    'Finance & Accounting': false,
    'IT & Software': false,
    'Office Productivity': false,
    'Personal Development': false,
    Design: false,
    Marketing: false,
    Lifestyle: false,
    'Photography & Video': false,
    'Health & Fitness': false,
    Music: false,
  };

  const initialLevelFilters = {
    Beginner: false,
    Intermediate: false,
    Advanced: false,
    'All Levels': false,
  };

  const initialDurationFilters = {
    '0-1 Hour': false,
    '1-3 Hours': false,
    '3-6 Hours': false,
    '6-17 Hours': false,
    '17+ Hours': false,
  };

  // Use localStorage to store filter states
  const [categoryFilters, setCategoryFilters] = useState<{ [key: string]: boolean }>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('categoryFilters');
      return saved ? JSON.parse(saved) : initialCategoryFilters;
    }
    return initialCategoryFilters;
  });

  const [ratingFilter, setRatingFilter] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ratingFilter');
      return saved ? parseInt(saved) : 0;
    }
    return 0;
  });

  const [levelFilters, setLevelFilters] = useState<{ [key: string]: boolean }>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('levelFilters');
      return saved ? JSON.parse(saved) : initialLevelFilters;
    }
    return initialLevelFilters;
  });

  const [priceFilters, setPriceFilters] = useState<{
    type: 'free' | 'paid' | null;
    min: number;
    max: number;
  }>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('priceFilters');
      return saved
        ? JSON.parse(saved)
        : {
            type: null,
            min: 0,
            max: 200,
          };
    }
    return {
      type: null,
      min: 0,
      max: 200,
    };
  });

  const [durationFilters, setDurationFilters] = useState<{ [key: string]: boolean }>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('durationFilters');
      return saved ? JSON.parse(saved) : initialDurationFilters;
    }
    return initialDurationFilters;
  });

  // Save filter states to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('categoryFilters', JSON.stringify(categoryFilters));
    localStorage.setItem('ratingFilter', ratingFilter.toString());
    localStorage.setItem('levelFilters', JSON.stringify(levelFilters));
    localStorage.setItem('priceFilters', JSON.stringify(priceFilters));
    localStorage.setItem('durationFilters', JSON.stringify(durationFilters));
  }, [categoryFilters, ratingFilter, levelFilters, priceFilters, durationFilters]);

  // Handle category filter change
  const handleCategoryChange = (category: string, checked: boolean) => {
    setCategoryFilters((prev) => ({
      ...prev,
      [category]: checked,
    }));
  };

  // Handle rating filter change
  const handleRatingChange = (value: number) => {
    setRatingFilter((prev) => (prev === value ? 0 : value));
  };

  // Handle level filter change
  const handleLevelChange = (level: string, checked: boolean) => {
    setLevelFilters((prev) => ({
      ...prev,
      [level]: checked,
    }));
  };

  // Handle price filter change
  const handlePriceTypeChange = (type: 'free' | 'paid') => {
    setPriceFilters((prev) => ({
      ...prev,
      type: prev.type === type ? null : type,
    }));
  };

  // Handle price range change
  const handlePriceRangeChange = (min: number, max: number) => {
    const newMin = Math.min(min, max);
    const newMax = Math.max(min, max);

    setPriceFilters((prev) => ({
      ...prev,
      min: newMin,
      max: newMax,
    }));
  };

  // Handle duration filter change
  const handleDurationChange = (duration: string, checked: boolean) => {
    setDurationFilters((prev) => ({
      ...prev,
      [duration]: checked,
    }));
  };

  // Notify parent component about filter changes - FIXED TO REMOVE WARNING
  useEffect(() => {
    // Calculate active filters count inside the effect
    const calculateActiveFiltersCount = () => {
      let count = 0;
      if (Object.values(categoryFilters).some((v) => v)) count++;
      if (ratingFilter > 0) count++;
      if (Object.values(levelFilters).some((v) => v)) count++;
      if (priceFilters.type !== null) count++;
      if (Object.values(durationFilters).some((v) => v)) count++;

      return count;
    };

    onFilterChange?.({
      categories: categoryFilters,
      rating: ratingFilter,
      levels: levelFilters,
      price: priceFilters,
      durations: durationFilters,
      activeCount: calculateActiveFiltersCount(),
    });
  }, [categoryFilters, ratingFilter, levelFilters, priceFilters, durationFilters, onFilterChange]);

  return (
    <div className={styles.sidebar}>
      {/* Category Filter */}
      <FilterSection title="CATEGORY">
        <div className={styles.categoryList}>
          {Object.entries(categoryFilters).map(([category, checked]) => (
            <Checkbox
              key={category}
              checked={checked}
              onChange={(checked) => handleCategoryChange(category, checked)}
              label={category}
              count={filterCounts?.categoryCounts[category] || 0}
            />
          ))}
        </div>
      </FilterSection>

      {/* Rating Filter */}
      <FilterSection title="RATING">
        <div className={styles.ratingList}>
          {[4.5, 4, 3.5, 3, 2.5].map((value) => (
            <RatingFilter
              key={value}
              value={value}
              count={filterCounts?.ratingCounts[value] || 0}
              onChange={handleRatingChange}
              selected={ratingFilter === value}
            />
          ))}
        </div>
      </FilterSection>

      {/* Price Filter */}
      <FilterSection title="PRICE">
        <div className={styles.priceOptions}>
          <Checkbox
            checked={priceFilters.type === 'free'}
            onChange={() => handlePriceTypeChange('free')}
            label="Free"
            count={filterCounts?.priceCounts.free || 0}
          />
          <Checkbox
            checked={priceFilters.type === 'paid'}
            onChange={() => handlePriceTypeChange('paid')}
            label="Paid"
            count={filterCounts?.priceCounts.paid || 0}
          />
        </div>

        {priceFilters.type === 'paid' && (
          <div className={styles.priceFilter}>
            <div className={styles.priceSlider}>
              <div
                className={styles.sliderFill}
                style={{
                  left: `${(priceFilters.min / 200) * 100}%`,
                  right: `${100 - (priceFilters.max / 200) * 100}%`,
                }}
              ></div>
              <input
                type="range"
                min="0"
                max="200"
                value={priceFilters.min}
                onChange={(e) => handlePriceRangeChange(parseInt(e.target.value), priceFilters.max)}
                className={`${styles.slider} ${styles.sliderMin}`}
              />
              <input
                type="range"
                min="0"
                max="200"
                value={priceFilters.max}
                onChange={(e) => handlePriceRangeChange(priceFilters.min, parseInt(e.target.value))}
                className={`${styles.slider} ${styles.sliderMax}`}
              />
            </div>
            <div className={styles.priceInputs}>
              <div className={styles.priceInput}>
                <span className={styles.currencySymbol}>$</span>
                <input
                  type="number"
                  value={priceFilters.min}
                  onChange={(e) =>
                    handlePriceRangeChange(parseInt(e.target.value), priceFilters.max)
                  }
                  min="0"
                  max={priceFilters.max}
                />
              </div>
              <div className={styles.priceInput}>
                <span className={styles.currencySymbol}>$</span>
                <input
                  type="number"
                  value={priceFilters.max}
                  onChange={(e) =>
                    handlePriceRangeChange(priceFilters.min, parseInt(e.target.value))
                  }
                  min={priceFilters.min}
                  max="200"
                />
              </div>
            </div>
          </div>
        )}
      </FilterSection>

      {/* Course Level Filter */}
      <FilterSection title="COURSE LEVEL">
        <div className={styles.levelList}>
          {Object.entries(levelFilters).map(([level, checked]) => (
            <Checkbox
              key={level}
              checked={checked}
              onChange={(checked) => handleLevelChange(level, checked)}
              label={level}
              count={filterCounts?.levelCounts[level] || 0}
            />
          ))}
        </div>
      </FilterSection>

      {/* Duration Filter */}
      <FilterSection title="DURATION">
        <div className={styles.durationList}>
          {Object.entries(durationFilters).map(([duration, checked]) => (
            <Checkbox
              key={duration}
              checked={checked}
              onChange={(checked) => handleDurationChange(duration, checked)}
              label={duration}
              count={filterCounts?.durationCounts[duration] || 0}
            />
          ))}
        </div>
      </FilterSection>
    </div>
  );
};

export default FilterSideBar;
