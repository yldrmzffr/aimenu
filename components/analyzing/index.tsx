import styles from "./analyzing.module.css";

interface AnalyzingComponentProps {
  title?: string;
}

export default function Analyzing({ title }: AnalyzingComponentProps) {
  return (
    <>
      <div className={styles.container}>
        <div className={styles.blob}>
          <h1 className={styles.title}>{title}</h1>
        </div>
        <div className={styles.blob1} />
        <div className={styles.blob2} />
        <div className={styles.blob3} />
      </div>
    </>
  );
}
