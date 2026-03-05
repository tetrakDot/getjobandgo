from django.db import models
from django.conf import settings

class ResumeEvaluation(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name="evaluations",
        null=True, 
        blank=True
    )
    email = models.EmailField(blank=True, null=True) # For guest or as a secondary reference
    filename = models.CharField(max_length=255)
    job_description = models.TextField()
    overall_score = models.IntegerField()
    classification = models.CharField(max_length=100)
    recommendation = models.CharField(max_length=100)
    payload = models.JSONField() # Store the full AI result
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Resume Evaluation"
        verbose_name_plural = "Resume Evaluations"

    def __str__(self):
        user_id = self.user.email if self.user else "Anonymous"
        return f"{user_id} - {self.filename} ({self.overall_score}%)"
