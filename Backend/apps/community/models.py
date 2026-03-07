from django.db import models
from django.conf import settings

class ThoughtPost(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='thought_posts')
    role_type = models.CharField(max_length=20, choices=[('student', 'Student'), ('company', 'Company')], blank=True)
    title = models.CharField(max_length=255, help_text="Job Role Interested / Hiring For")
    description = models.TextField()
    resume_file = models.FileField(upload_to="thought_resumes/", blank=True, null=True)
    likes = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='liked_thoughts', blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.email} - {self.title}"
