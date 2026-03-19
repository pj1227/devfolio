/**
 * StackSelector
 *
 * Four-segment bar: Frontend · Backend · Query · Database
 * Available options are interactive; unavailable show a phase badge and are muted.
 *
 * @devfolio/shared-ui
 */

import type { KeyboardEvent, MouseEvent } from 'react';
import type {
  StackSegment,
  StackSelection,
  StackOption,
} from '@devfolio/shared-interfaces';
import styles from './StackSelector.module.css';

// ─── Props ────────────────────────────────────────────────────────────────────

export interface StackSelectorProps {
  /** Ordered list of segment configs (from STACK_SEGMENTS in shared-models) */
  segments: StackSegment[];
  /** Current selection */
  selection: StackSelection;
  /** Called when the user picks an available option */
  onSelect: <K extends keyof StackSelection>(
    segment: K,
    value: StackSelection[K]
  ) => void;
  /** Visual variant */
  variant?: 'default' | 'compact';
  /** Extra class applied to the root element */
  className?: string;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function PhaseBadge({ badge }: { badge: string }) {
  return <span className={styles.phaseBadge}>{badge}</span>;
}

function OptionButton<K extends string>({
  option,
  isActive,
  onSelect,
}: {
  option: StackOption<K>;
  isActive: boolean;
  onSelect: (key: K) => void;
}) {
  const available = option.status === 'available';

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (available && !isActive) onSelect(option.key);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if ((e.key === 'Enter' || e.key === ' ') && available && !isActive) {
      e.preventDefault();
      onSelect(option.key);
    }
  };

  const classNames = [
    styles.option,
    available ? styles.available : styles.unavailable,
    isActive ? styles.active : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type="button"
      role="radio"
      aria-checked={isActive}
      aria-disabled={!available}
      disabled={!available}
      className={classNames}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      title={
        !available && option.phase
          ? `Coming in Phase ${option.phase.number}`
          : option.label
      }
    >
      {option.shortLabel ?? option.label}
      {!available && option.phase && (
        <PhaseBadge badge={option.phase.badge} />
      )}
    </button>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function StackSelector({
  segments,
  selection,
  onSelect,
  variant = 'default',
  className,
}: StackSelectorProps) {
  const rootClass = [
    styles.root,
    variant === 'compact' ? styles.compact : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={rootClass} role="group" aria-label="Stack selector">
      {segments.map((segment, idx) => (
        <div key={segment.id}>
          <div className={styles.segment}>
            <span className={styles.segmentLabel}>{segment.label}</span>
            <div
              className={styles.optionGroup}
              role="radiogroup"
              aria-label={`${segment.label} options`}
            >
              {segment.options.map((option) => (
                <OptionButton
                  key={option.key}
                  option={option}
                  isActive={selection[segment.id] === option.key}
                  onSelect={(key) =>
                    onSelect(
                      segment.id as keyof StackSelection,
                      key as StackSelection[keyof StackSelection]
                    )
                  }
                />
              ))}
            </div>
          </div>
          {idx < segments.length - 1 && <div className={styles.divider} />}
        </div>
      ))}
    </div>
  );
}

export default StackSelector;
