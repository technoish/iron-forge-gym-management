import StatusPage from '../components/ui/StatusPage'

export default function NotFound() {
  return (
    <StatusPage
      code="404"
      title="This page skipped leg day"
      message="We couldn&rsquo;t find the page you were looking for. Let&rsquo;s get you back on track."
    />
  )
}
