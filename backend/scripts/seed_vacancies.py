
import os
import sys
import django
from django.utils import timezone
from datetime import timedelta

# Setup Django environment
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'recruit_art.settings')
django.setup()

from jobs.models import Job
from django.contrib.auth import get_user_model

User = get_user_model()

def seed_vacancies():
    print("Starts seeding vacancies...")
    
    # Ensure there's at least one user to assign as created_by
    admin_user = User.objects.filter(is_superuser=True).first()
    if not admin_user:
        print("No superuser found. Creating default admin...")
        admin_user = User.objects.create_superuser('admin', 'admin@example.com', 'admin123')

    # Clinician Vacancies
    clinician_jobs = [
        "General Physician (MBBS)",
        "Medicine (MD/DNB)",
        "Gynecologist (MD/DNB/DGO)",
        "Histopathologist (MD/DNB)",
        "Pathologist/Chief of Lab (MD/DNB/DCP)",
        "Microbiologist (MD/DNB)",
        "Radiologist (MD/DNB/DMRD)",
        "Associate Professor Radiology",
        "Associate Professor Pathology",
        "Assistant Professor Microbiology"
    ]

    # Non-Clinician Vacancies
    non_clinician_jobs = [
        "Nurse (B.Sc. Nursing, G.N.M., A.N.M.)",
        "IP Pharmacist (B.Pharma)",
        "GM Marketing",
        "Zonal Sales Manager",
        "Regional Sales Manager",
        "Purchase Manager",
        "Lab Manager",
        "Scientific Officer"
    ]

    # Common attributes
    description = "We are seeking a qualified professional for this role. Apply now to join our team."
    location = "Multiple Locations"
    deadline = timezone.now() + timedelta(days=30)

    # Create Clinician Jobs
    for title in clinician_jobs:
        Job.objects.get_or_create(
            title=title,
            company_name="Recruit Art Healthcare",
            defaults={
                'location': location,
                'category': 'clinician',
                'description': description,
                'skills_required': "Healthcare, Medical",
                'apply_deadline': deadline,
                'created_by': admin_user,
                'status': 'active'
            }
        )
        print(f"Created/Verified Clinician Job: {title}")

    # Create Non-Clinician Jobs
    for title in non_clinician_jobs:
        Job.objects.get_or_create(
            title=title,
            company_name="Recruit Art Healthcare",
            defaults={
                'location': location,
                'category': 'non_clinician',
                'description': description,
                'skills_required': "Management, Operations",
                'apply_deadline': deadline,
                'created_by': admin_user,
                'status': 'active'
            }
        )
        print(f"Created/Verified Non-Clinician Job: {title}")

    print("Vacancy seeding completed!")

if __name__ == '__main__':
    seed_vacancies()
