"""Lightweight middleware to log every API request/response for auditing."""
import logging
import time

logger = logging.getLogger('apps')


class RequestLoggingMiddleware:
    """Logs method, path, status code, and duration for every /api/ request."""

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        start_time = time.monotonic()
        response = self.get_response(request)

        if request.path.startswith('/api/'):
            duration_ms = round((time.monotonic() - start_time) * 1000, 2)
            logger.info(
                '%s %s -> %s (%sms) user=%s',
                request.method,
                request.get_full_path(),
                response.status_code,
                duration_ms,
                getattr(request.user, 'id', 'anonymous') if hasattr(request, 'user') else 'anonymous',
            )
        return response
