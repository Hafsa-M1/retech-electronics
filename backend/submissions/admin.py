from django.contrib import admin
from .models import DeviceSubmission, SubmissionPhoto


class SubmissionPhotoInline(admin.TabularInline):
    """
    Inline admin for photos attached to a DeviceSubmission.
    Shows photos directly when viewing/editing a submission.
    """
    model = SubmissionPhoto
    extra = 1  # Show 1 empty slot for adding new photo
    fields = ('image', 'uploaded_at')
    readonly_fields = ('uploaded_at',)


@admin.register(DeviceSubmission)
class DeviceSubmissionAdmin(admin.ModelAdmin):
    """
    Admin interface for DeviceSubmission model.
    """
    list_display = ('brand', 'model', 'customer', 'status', 'submission_date')
    list_filter = ('status', 'submission_date')
    search_fields = ('brand', 'model', 'serial_number', 'condition_description')
    date_hierarchy = 'submission_date'
    readonly_fields = ('submission_date',)
    
    # Show attached photos inline
    inlines = [SubmissionPhotoInline]


@admin.register(SubmissionPhoto)
class SubmissionPhotoAdmin(admin.ModelAdmin):
    """
    Admin interface for SubmissionPhoto model.
    """
    list_display = ('submission', 'uploaded_at')
    list_filter = ('uploaded_at',)
    search_fields = ('submission__brand', 'submission__model')
    date_hierarchy = 'uploaded_at'
    readonly_fields = ('uploaded_at',)