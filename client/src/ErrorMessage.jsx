import styles from './ErrorMessage.module.css';

// Visar ett felmeddelande. Renderar ingenting om message är tomt.
// Skicka med onDismiss för att visa en stäng-knapp.
function ErrorMessage({ message, onDismiss }) {
  if (!message) return null;

  return (
    <div className={styles.error} role="alert">
      <span>{message}</span>
      {onDismiss && (
        <button
          type="button"
          className={styles.dismiss}
          onClick={onDismiss}
          aria-label="Dismiss error"
        >
          &times;
        </button>
      )}
    </div>
  );
}

export default ErrorMessage;
