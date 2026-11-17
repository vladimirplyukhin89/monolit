import { AnimatePresence, LazyMotion, LayoutGroup } from 'motion/react';
import * as m from 'motion/react-m';
import { useId, useRef, useState } from 'react';
import { fade, motionTransition, spring } from '../lib/motion';
import loadMotionFeatures from '../lib/motion-features';
import PhotoSlider, { type PhotoSlide } from './PhotoSlider';

export interface CaseTabGroup {
  title: string;
  photos: PhotoSlide[];
}

interface Props {
  groups: readonly CaseTabGroup[];
}

export default function CaseTabs({ groups }: Props) {
  const baseId = useId();
  const pillId = useId();
  const [active, setActive] = useState(0);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const select = (index: number, moveFocus: boolean) => {
    if (groups.length === 0) return;
    const next = (index + groups.length) % groups.length;
    setActive(next);
    if (moveFocus) {
      tabRefs.current[next]?.focus();
    }
  };

  return (
    <LazyMotion features={loadMotionFeatures} strict>
      <div className="case-tabs reveal">
        <LayoutGroup>
          <div className="case-tabs__list" role="tablist" aria-label="Виды работ">
            {groups.map((group, i) => (
              <button
                key={group.title}
                ref={(node) => {
                  tabRefs.current[i] = node;
                }}
                type="button"
                role="tab"
                id={`${baseId}-tab-${i}`}
                className="case-tabs__tab"
                aria-selected={i === active}
                aria-controls={`${baseId}-panel-${i}`}
                tabIndex={i === active ? 0 : -1}
                onClick={() => select(i, false)}
                onKeyDown={(event) => {
                  if (event.key === 'ArrowRight') {
                    event.preventDefault();
                    select(i + 1, true);
                  } else if (event.key === 'ArrowLeft') {
                    event.preventDefault();
                    select(i - 1, true);
                  } else if (event.key === 'Home') {
                    event.preventDefault();
                    select(0, true);
                  } else if (event.key === 'End') {
                    event.preventDefault();
                    select(groups.length - 1, true);
                  }
                }}
              >
                <AnimatePresence>
                  {i === active ? (
                    <m.span
                      className="case-tabs__tab-active"
                      layoutId={pillId}
                      transition={motionTransition(spring)}
                    />
                  ) : null}
                </AnimatePresence>
                <span className="case-tabs__tab-label">{group.title}</span>
              </button>
            ))}
          </div>
        </LayoutGroup>

        <div className="case-tabs__stage">
          {groups.map((group, i) => (
            <div
              key={group.title}
              className="case-tabs__panel"
              role="tabpanel"
              id={`${baseId}-panel-${i}`}
              aria-labelledby={`${baseId}-tab-${i}`}
              aria-hidden={i !== active}
              inert={i !== active}
            >
              <m.div
                className="case-tabs__fade"
                initial={false}
                animate={{ opacity: i === active ? 1 : 0 }}
                transition={motionTransition(fade)}
              >
                <PhotoSlider
                  slides={group.photos}
                  variant="peek"
                  label={group.title}
                  active={i === active}
                  reveal={false}
                />
              </m.div>
            </div>
          ))}
        </div>

        <style>{styles}</style>
      </div>
    </LazyMotion>
  );
}

const styles = `
  .case-tabs__list {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-2);
    margin: 0 0 var(--space-6);
  }
  .case-tabs__tab {
    position: relative;
    min-height: 2.75rem;
    padding: var(--space-2) var(--space-4);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-full);
    background: transparent;
    color: var(--color-text);
    font: inherit;
    font-size: var(--font-size-base);
    font-weight: 600;
    line-height: var(--line-height-tight);
    cursor: pointer;
    transition: transform var(--duration-fast) var(--ease-out);
  }
  .case-tabs__tab[aria-selected='true'] {
    border-color: transparent;
    color: var(--color-primary-contrast);
  }
  .case-tabs__tab:active {
    transform: scale(var(--press-scale));
  }
  .case-tabs__tab-active {
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background: var(--color-primary);
  }
  .case-tabs__tab-label {
    position: relative;
    z-index: 1;
  }
  .case-tabs__stage {
    display: grid;
  }
  .case-tabs__panel {
    grid-area: 1 / 1;
    min-width: 0;
  }
  .case-tabs__panel[aria-hidden='true'] {
    pointer-events: none;
  }
  .case-tabs__fade {
    min-width: 0;
  }
`;
