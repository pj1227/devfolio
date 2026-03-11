import type { TechStackInfo } from '@devfolio/shared-interfaces';
import { useResumeApi } from '../../hooks/useResumeApi';
import styles from '../app.module.css';

export function TechStackTab() {
  const { data, loading, error } = useResumeApi<TechStackInfo>('/tech-stack');
  if (loading) return <div className={styles.loading}>fetching live runtime data...</div>;
  if (error) return <div className={styles.error}>Error: {error}</div>;
  if (!data) return null;
  return (
    <div>
      <p className={styles.sectionHeading}>Live Runtime Environment</p>
      <div className={styles.techGrid}>
        <div className={styles.techCard}>
          <div className={styles.techCardName}>{data.runtime.name}</div>
          <div className={styles.techCardCategory}>runtime</div>
          <div className={styles.techMeta}>
            <div className={styles.techMetaRow}>
              <span className={styles.techMetaKey}>version</span>
              <span className={styles.techMetaValue}>{data.runtime.version}</span>
            </div>
            <div className={styles.techMetaRow}>
              <span className={styles.techMetaKey}>impl</span>
              <span className={styles.techMetaValue}>{data.runtime.implementation}</span>
            </div>
          </div>
        </div>
        <div className={styles.techCard}>
          <div className={styles.techCardName}>{data.framework.name}</div>
          <div className={styles.techCardCategory}>framework</div>
          <div className={styles.techMeta}>
            <div className={styles.techMetaRow}>
              <span className={styles.techMetaKey}>version</span>
              <span className={styles.techMetaValue}>{data.framework.version}</span>
            </div>
            {Object.entries(data.framework.extra ?? {}).map(([k, v]) => (
              <div key={k} className={styles.techMetaRow}>
                <span className={styles.techMetaKey}>{k}</span>
                <span className={styles.techMetaValue}>{v}</span>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.techCard}>
          <div className={styles.techCardName}>{data.database.name}</div>
          <div className={styles.techCardCategory}>database</div>
          <div className={styles.techMeta}>
            <div className={styles.techMetaRow}>
              <span className={styles.techMetaKey}>dialect</span>
              <span className={styles.techMetaValue}>{data.database.dialect}</span>
            </div>
            <div className={styles.techMetaRow}>
              <span className={styles.techMetaKey}>connected</span>
              <span className={styles.techMetaValue}>
                {data.database.connected ? '✓ yes' : '✗ seed mode'}
              </span>
            </div>
          </div>
        </div>
        <div className={styles.techCard}>
          <div className={styles.techCardName}>{data.os.platform}</div>
          <div className={styles.techCardCategory}>os</div>
          <div className={styles.techMeta}>
            <div className={styles.techMetaRow}>
              <span className={styles.techMetaKey}>release</span>
              <span className={styles.techMetaValue}>{data.os.release}</span>
            </div>
            <div className={styles.techMetaRow}>
              <span className={styles.techMetaKey}>arch</span>
              <span className={styles.techMetaValue}>{data.os.architecture}</span>
            </div>
          </div>
        </div>
        {data.packages.map((pkg, i) => (
          <div key={i} className={styles.techCard}>
            <div className={styles.techCardName}>{pkg.name}</div>
            <div className={styles.techCardCategory}>{pkg.category}</div>
            <div className={styles.techMeta}>
              <div className={styles.techMetaRow}>
                <span className={styles.techMetaKey}>version</span>
                <span className={styles.techMetaValue}>{pkg.version}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}