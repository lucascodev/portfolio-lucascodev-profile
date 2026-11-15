import type { CSSProperties, ReactNode } from 'react';
import type { DesktopWindow as DesktopWindowState } from '@/modules/portfolio/domain/types/desktop/desktop-window.type';
import type { WindowBounds } from '@/modules/portfolio/domain/types/desktop/window-bounds.type';
import { WINDOW_RESIZE_EDGES } from '@/modules/portfolio/presentation/components/linux-desktop/constants/window-resize-edges.constant';
import { useWindowDrag } from './hooks/use-window-drag/use-window-drag';
import { useWindowResize } from './hooks/use-window-resize/use-window-resize';
import styles from './desktop-window.module.css';

interface DesktopWindowProps {
  readonly window: DesktopWindowState;
  readonly title: string;
  readonly isActive: boolean;
  readonly onFocus: () => void;
  readonly onMove: (x: number, y: number) => void;
  readonly onResize: (bounds: WindowBounds) => void;
  readonly onMinimize: () => void;
  readonly onToggleMaximize: () => void;
  readonly onClose: () => void;
  readonly children: ReactNode;
}

export function DesktopWindow({
  window,
  title,
  isActive,
  onFocus,
  onMove,
  onResize,
  onMinimize,
  onToggleMaximize,
  onClose,
  children,
}: DesktopWindowProps) {
  const drag = useWindowDrag({ position: window.bounds, isEnabled: !window.isMaximized, onMove });
  const resize = useWindowResize({ bounds: window.bounds, isEnabled: !window.isMaximized, onResize });
  const style: CSSProperties = {
    zIndex: window.zIndex,
    ...(window.isMaximized
      ? {}
      : { left: window.bounds.x, top: window.bounds.y, width: window.bounds.width, height: window.bounds.height }),
  };

  return (
    <section
      className={styles.window}
      style={style}
      data-active={isActive}
      data-maximized={window.isMaximized}
      hidden={window.isMinimized}
      onPointerDownCapture={onFocus}
      aria-label={title}
    >
      <header className={styles.titleBar} onDoubleClick={onToggleMaximize} {...drag}>
        <span className={styles.title}>{title}</span>
        <div className={styles.controls}>
          <button type="button" className={styles.control} onClick={onMinimize} aria-label="Minimizar">
            <svg viewBox="0 0 12 12" aria-hidden="true"><path d="M2.5 6h7" /></svg>
          </button>
          <button type="button" className={styles.control} onClick={onToggleMaximize} aria-label="Maximizar">
            <svg viewBox="0 0 12 12" aria-hidden="true"><rect x="2.5" y="2.5" width="7" height="7" rx="1" /></svg>
          </button>
          <button type="button" className={styles.control} data-variant="close" onClick={onClose} aria-label="Fechar">
            <svg viewBox="0 0 12 12" aria-hidden="true"><path d="M3 3l6 6M9 3l-6 6" /></svg>
          </button>
        </div>
      </header>
      <div className={styles.body}>{children}</div>
      {!window.isMaximized &&
        WINDOW_RESIZE_EDGES.map((edge) => (
          <div key={edge} className={styles.resizeHandle} data-edge={edge} aria-hidden="true" {...resize.handlePropsFor(edge)} />
        ))}
    </section>
  );
}
