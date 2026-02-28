import uuid
from django.db import models

class UUIDBaseModel(models.Model):
    """
    Abstract base model that enforces UUIDs as the primary key.
    Future models should inherit from this to ensure consistency and avoid integer ID enumeration attacks.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    class Meta:
        abstract = True
