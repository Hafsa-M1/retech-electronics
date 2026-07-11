from django.db import models
from django.conf import settings


class DeviceSubmission(models.Model):
    """
    Customer-submitted device for refurbishing evaluation.
    Matches SRS 4.1 and ER diagram DEVICE_SUBMISSION.
    """

    customer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='device_submissions',
        help_text="The customer who submitted the device"
    )

    brand = models.CharField(
        max_length=100,
        help_text="Device brand (e.g. Apple, Samsung)"
    )

    model = models.CharField(
        max_length=100,
        help_text="Device model (e.g. iPhone 13, Galaxy S22)"
    )

    serial_number = models.CharField(
        max_length=100,
        blank=True,
        help_text="Serial number / IMEI (optional)"
    )

    condition_description = models.TextField(
        help_text="Customer's description of the device's current condition"
    )

    # ─────────────────────────────────────────────
    # Submission metadata
    # ─────────────────────────────────────────────

    submission_date = models.DateTimeField(
        auto_now_add=True,
        help_text="When the submission was created"
    )

    status = models.CharField(
        max_length=20,
        choices=[
            ('PENDING', 'Pending'),
            ('APPROVED', 'Approved'),
            ('REJECTED', 'Rejected'),
            ('UNDER_REVIEW', 'Under Review'),
            ('CERTIFIED', 'Certified'),
            ('REFURBISH', 'Refurbishment'),
            ('PUBLISHED', 'Published to Catalog'),
        ],
        default='PENDING',
        help_text="Current status of the submission"
    )

    # ─────────────────────────────────────────────
    # Certification / Business data
    # ─────────────────────────────────────────────

    certificate_id = models.CharField(
        max_length=50,
        blank=True,
        null=True,
        help_text="Unique certificate ID if device is certified"
    )

    category = models.CharField(
        max_length=50,
        blank=True,
        null=True,
        help_text="Device category (Smartphone, Laptop, etc.)"
    )

    estimated_price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True,
        help_text="Estimated resale price after certification"
    )

    final_notes = models.TextField(
        blank=True,
        null=True,
        help_text="Final certification notes by staff"
    )

    # ─────────────────────────────────────────────
    # 🔥 Diagnostic data 
    # ─────────────────────────────────────────────

    diagnostic_results = models.JSONField(
        null=True,
        blank=True,
        help_text="Stores Pass/Fail diagnostic checklist results"
    )

    diagnostic_notes = models.TextField(
        blank=True,
        null=True,
        help_text="Staff notes from diagnostic testing"
    )

    # ─────────────────────────────────────────────
    # Media
    # ─────────────────────────────────────────────

    video = models.FileField(
        upload_to='submission_videos/',
        null=True,
        blank=True,
        help_text="Optional short video showing device functionality"
    )

    def __str__(self):
        return f"{self.brand} {self.model} - {self.customer.email} ({self.status})"

    class Meta:
        ordering = ['-submission_date']
        verbose_name = "Device Submission"
        verbose_name_plural = "Device Submissions"


class SubmissionPhoto(models.Model):
    """
    Individual photo attached to a DeviceSubmission.
    Allows multiple photos per submission.
    """

    submission = models.ForeignKey(
        DeviceSubmission,
        on_delete=models.CASCADE,
        related_name='photos',
        help_text="The submission this photo belongs to"
    )

    image = models.ImageField(
        upload_to='submission_photos/%Y/%m/%d/',
        help_text="Photo of the device (multiple angles recommended)"
    )

    uploaded_at = models.DateTimeField(
        auto_now_add=True,
        help_text="When the photo was uploaded"
    )

    def __str__(self):
        return f"Photo for {self.submission.brand} {self.submission.model} - {self.submission.customer.email}"

    class Meta:
        ordering = ['uploaded_at']
        verbose_name = "Submission Photo"
        verbose_name_plural = "Submission Photos"


class DeviceReservation(models.Model):
    """
    Represents a customer reservation for a published device.
    """

    RESERVATION_STATUS = [
        ('ACTIVE', 'Active'),
        ('COMPLETED', 'Completed'),
    ]

    device_submission = models.OneToOneField(
        DeviceSubmission,
        on_delete=models.CASCADE,
        related_name='reservation',
        help_text='The published device that has been reserved'
    )
    customer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='reservations',
        help_text='The customer who reserved the device'
    )
    reserved_at = models.DateTimeField(
        auto_now_add=True,
        help_text='When the reservation was created'
    )
    status = models.CharField(
        max_length=20,
        choices=RESERVATION_STATUS,
        default='ACTIVE',
        help_text='Reservation status'
    )

    def __str__(self):
        return f"{self.customer.email} reserved {self.device_submission.brand} {self.device_submission.model}"

    class Meta:
        ordering = ['-reserved_at']
        verbose_name = "Device Reservation"
        verbose_name_plural = "Device Reservations"