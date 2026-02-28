from django.db.models.signals import post_save
from django.dispatch import receiver
from apps.authentication.models import User, UserRole

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        if instance.role == UserRole.STUDENT:
            from apps.students.models import Student
            Student.objects.get_or_create(
                user=instance,
                defaults={
                    "full_name": instance.email.split("@")[0],
                    "phone": "",
                    "skills": "",
                }
            )
        elif instance.role == UserRole.COMPANY:
            from apps.companies.models import Company
            Company.objects.get_or_create(
                user=instance,
                defaults={
                    "company_name": instance.email.split("@")[0],
                    "email": instance.email,
                    "phone": "",
                    "company_type": "Unknown",
                    "gst_number": f"PENDING-{instance.id}",
                    "cin_number": f"PENDING-{instance.id}",
                }
            )
