import os
import django
import random
import uuid

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django.setup()

from apps.authentication.models import User, UserRole
from apps.students.models import Student
from apps.companies.models import Company

# Lists for realistic data generation
FIRST_NAMES = ["Aryan", "Sneha", "Kabir", "Ishita", "Rohan", "Ananya", "Vikram", "Meera", "Aditya", "Riya", 
               "James", "Emma", "Liam", "Olivia", "Noah", "Ava", "Lucas", "Isabella", "Mason", "Mia"]
LAST_NAMES = ["Sharma", "Verma", "Patel", "Gupta", "Das", "Reddy", "Singh", "Nair", "Iyer", "Joshi",
              "Smith", "Johnson", "Brown", "Taylor", "Miller", "Wilson", "Moore", "Anderson", "Thomas", "Jackson"]
COMPANY_WORDS = ["Tech", "Systems", "Solutions", "Laboratories", "Digital", "Industries", "Group", "Global", "NextGen", "Inovatio"]
INDUSTRIES = ["IT Services", "Finance", "Healthcare", "Manufacturing", "Retail", "Education"]
CITIES = ["Mumbai", "Bangalore", "Chennai", "Delhi", "Hyderabad", "Pune", "Kochi", "Kolkata"]

def populate_students(count=50, verified_count=30):
    print(f"Creating {count} students ({verified_count} verified)...")
    for i in range(count):
        first = random.choice(FIRST_NAMES)
        last = random.choice(LAST_NAMES)
        full_name = f"{first} {last}"
        email = f"student_{i+1}@example.com"
        
        user, created = User.objects.get_or_create(
            email=email,
            defaults={"role": UserRole.STUDENT}
        )
        if created:
            user.set_password("password123")
            user.save()
        
        # Student profile is automatically created via signal in some Django setups, 
        # but let's ensure it exists and update it.
        student, _ = Student.objects.get_or_create(user=user)
        student.full_name = full_name
        student.phone = f"9{random.randint(100000000, 999999999)}"
        student.country = "India"
        student.state = "Tamil Nadu"
        student.district = random.choice(CITIES)
        student.verification_status = "verified" if i < verified_count else "pending"
        student.skills = "React, Django, Python, JavaScript"
        student.save()
        
    print(f"Successfully populated students.")

def populate_companies(count=50, verified_count=40):
    print(f"Creating {count} companies ({verified_count} verified)...")
    for i in range(count):
        word1 = random.choice(COMPANY_WORDS)
        word2 = random.choice(COMPANY_WORDS)
        company_name = f"{word1} {word2} {random.choice(['Pvt Ltd', 'LLC', 'Corp'])}"
        if word1 == word2:
            company_name = f"{word1} {random.choice(['Enterprises', 'Ventures'])}"
            
        email = f"company_{i+1}@enterprise.com"
        
        user, created = User.objects.get_or_create(
            email=email,
            defaults={"role": UserRole.COMPANY}
        )
        if created:
            user.set_password("password123")
            user.save()
        
        # GST and CIN must be unique
        gst = f"{random.randint(10, 99)}ABCDE{random.randint(1000, 9999)}F{random.randint(1, 9)}Z{random.randint(1, 9)}"
        cin = f"U{random.randint(10000, 99999)}TN{random.randint(2000, 2024)}PTC{random.randint(100000, 999999)}"
        
        company, _ = Company.objects.get_or_create(
            user=user,
            defaults={
                "gst_number": gst,
                "cin_number": cin
            }
        )
        company.company_name = company_name
        company.email = email
        company.phone = f"8{random.randint(100000000, 999999999)}"
        company.company_type = random.choice(INDUSTRIES)
        company.country = "India"
        company.state = "Karnataka"
        company.district = random.choice(CITIES)
        company.verification_status = "verified" if i < verified_count else "pending"
        company.save()
        
    print(f"Successfully populated companies.")

if __name__ == "__main__":
    populate_students(50, 30)
    populate_companies(50, 40)
    print("Population complete.")
