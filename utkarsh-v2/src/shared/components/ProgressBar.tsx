import { useScrollStore } from '@/shared/stores/scrollStore'
import styles from './ProgressBar.module.css'

export function ProgressBar() {
    const progress = useScrollStore((s) => s.progress)

    return (
        <div className={styles.track} aria-hidden="true">
            <div
                className={styles.bar}
                style={{ transform: `scaleX(${progress})` }}
            />
        </div>
    )
}
