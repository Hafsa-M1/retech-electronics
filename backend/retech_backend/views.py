from django.views.static import serve
from django.http import HttpResponse
from django.conf import settings

def serve_media_with_cors(request, path, document_root=None, show_indexes=False):
    """
    Serve media files with proper CORS headers in development.
    Wraps Django's built-in serve view and adds CORS to the response.
    """
    # Call the original serve function to get the response
    response = serve(request, path, document_root=document_root, show_indexes=show_indexes)

    # Add CORS headers to allow frontend (e.g. localhost:5173) to load images/videos
    response['Access-Control-Allow-Origin'] = '*'  # or 'http://localhost:5173' for stricter
    response['Access-Control-Allow-Methods'] = 'GET, OPTIONS'
    response['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'

    return response