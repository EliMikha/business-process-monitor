export default function ProgressIndicator({ value, processName }) {
  return (
    <div className="progress-indicator">
      <span className="field-label">Прогресс выполнения</span>
      <span className="progress-value">{value}%</span>
      <progress className="process-progress" value={value} max="100" aria-label={`Прогресс процесса «${processName}»`}>{value}%</progress>
    </div>
  );
}
