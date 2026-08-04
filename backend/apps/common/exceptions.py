"""
Custom DRF exception handler so every error response — validation errors,
permission denials, throttling, 404s, uncaught exceptions — comes back in
the same { success, message, errors } envelope.
"""
import logging

from django.core.exceptions import PermissionDenied
from django.http import Http404
from rest_framework import exceptions as drf_exceptions
from rest_framework.response import Response
from rest_framework.views import exception_handler as drf_default_handler

logger = logging.getLogger('apps.common')


def _flatten_errors(detail):
    """DRF error details can be a list, dict, or string — normalize to a dict."""
    if isinstance(detail, dict):
        return detail
    if isinstance(detail, list):
        return {'non_field_errors': detail}
    return {'detail': [str(detail)]}


def custom_exception_handler(exc, context):
    if isinstance(exc, Http404):
        exc = drf_exceptions.NotFound()
    elif isinstance(exc, PermissionDenied):
        exc = drf_exceptions.PermissionDenied()

    response = drf_default_handler(exc, context)

    if response is None:
        # Uncaught, non-DRF exception — log it and return a generic 500.
        logger.exception('Unhandled exception in %s', context.get('view'))
        return Response(
            {'success': False, 'message': 'Internal server error.', 'errors': {}},
            status=500,
        )

    message_map = {
        400: 'Validation failed.',
        401: 'Authentication credentials were not provided or are invalid.',
        403: "You don't have permission to perform this action.",
        404: 'The requested resource was not found.',
        405: 'This method is not allowed on this endpoint.',
        429: 'Too many requests. Please try again later.',
    }

    message = message_map.get(response.status_code, 'Request failed.')
    response.data = {
        'success': False,
        'message': message,
        'errors': _flatten_errors(response.data),
    }
    return response
