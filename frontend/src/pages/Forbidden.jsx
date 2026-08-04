import StatusPage from '../components/ui/StatusPage'
import Button from '../components/ui/Button'

export default function Forbidden() {
  return (
    <StatusPage
      code="403"
      title="This area is members-only"
      message="You don&rsquo;t have permission to view this page. If you think that&rsquo;s a mistake, contact the gym front desk."
      actions={
        <>
          <Button to="/dashboard" variant="primary">Back to Dashboard</Button>
          <Button to="/" variant="secondary">Home</Button>
        </>
      }
    />
  )
}
