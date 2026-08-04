import StatusPage from '../components/ui/StatusPage'
import Button from '../components/ui/Button'

export default function ServerError({ onRetry }) {
  return (
    <StatusPage
      code="500"
      title="Something broke on our end"
      message="An unexpected error occurred. Try refreshing the page — if it keeps happening, let us know from the Contact page."
      actions={
        <>
          <button type="button" onClick={onRetry || (() => window.location.reload())} className="btn-primary">
            Reload Page
          </button>
          <Button to="/" variant="secondary">Home</Button>
        </>
      }
    />
  )
}
