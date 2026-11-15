import type { ReactNode } from 'react';
import styles from './popover.module.css';

interface PopoverProps {
  readonly id: string;
  readonly label: string;
  readonly align: 'center' | 'end';
  readonly children: ReactNode;
}

export function Popover({ id, label, align, children }: PopoverProps) {
  return (
    <div id={id} role="dialog" aria-label={label} className={styles.popover} data-align={align}>
      {children}
    </div>
  );
}
