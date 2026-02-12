from django.core.management.base import BaseCommand
from django.utils import timezone
from jobs.models import Job
from django.contrib.auth import get_user_model
import random
from datetime import timedelta

User = get_user_model()

class Command(BaseCommand):
    help = 'Seeds the database with dummy job data for presentation'

    def handle(self, *args, **kwargs):
        self.stdout.write('Seeding data...')

        # Get a user to assign as creator (preferably superuser)
        user = User.objects.filter(is_superuser=True).first()
        if not user:
            user = User.objects.first()
        
        if not user:
            self.stdout.write(self.style.ERROR('No users found. Please create a user first.'))
            return

        jobs_data = [
            {
                "title": "Senior UX Designer",
                "company_name": "Creative Pulse",
                "location": "New York, NY (Remote)",
                "job_type": "full_time",
                "category": "non_clinician",
                "salary_range": "$120k - $150k",
                "experience_required": "5+ years",
                "description": "We are looking for a Senior UX Designer to lead our design team...",
                "skills_required": "Figma, Sketch, Prototyping, User Research",
                "is_featured": True
            },
            {
                "title": "Clinical Psychologist",
                "company_name": "Mindful Health",
                "location": "San Francisco, CA",
                "job_type": "full_time",
                "category": "clinician",
                "salary_range": "$90k - $110k",
                "experience_required": "3+ years",
                "description": "Join our team of dedicated mental health professionals...",
                "skills_required": "Clinical Psychology, Therapy, Counseling",
                "is_featured": False
            },
            {
                "title": "React Native Developer",
                "company_name": "TechFlow",
                "location": "Austin, TX",
                "job_type": "contract",
                "category": "non_clinician",
                "salary_range": "$60 - $80 / hr",
                "experience_required": "2+ years",
                "description": "Looking for an experienced React Native developer for a 6-month contract...",
                "skills_required": "React Native, JavaScript, TypeScript, Redux",
                "is_featured": True
            },
            {
                "title": "Registered Nurse",
                "company_name": "City General Hospital",
                "location": "Chicago, IL",
                "job_type": "part_time",
                "category": "clinician",
                "salary_range": "$35 - $45 / hr",
                "experience_required": "1+ years",
                "description": "Part-time RN position available in our emergency department...",
                "skills_required": "Nursing, Patient Care, CPR",
                "is_featured": False
            },
             {
                "title": "Product Manager",
                "company_name": "Innovate Inc",
                "location": "Whyte, WA",
                "job_type": "full_time",
                "category": "non_clinician",
                "salary_range": "$130k - $160k",
                "experience_required": "4+ years",
                "description": "Lead product strategy and execution for our core platform...",
                "skills_required": "Product Management, Agile, Roadmapping",
                "is_featured": True
            },
            {
                "title": "Physical Therapist",
                "company_name": "Active Life Therapy",
                "location": "Miami, FL",
                "job_type": "full_time",
                "category": "clinician",
                "salary_range": "$80k - $100k",
                "experience_required": "2+ years",
                "description": "Help patients recover and regain mobility...",
                "skills_required": "Physical Therapy, Rehabilitation, Kinesiology",
                "is_featured": False
            },
        ]

        for job_data in jobs_data:
            Job.objects.create(
                title=job_data['title'],
                company_name=job_data['company_name'],
                location=job_data['location'],
                job_type=job_data['job_type'],
                category=job_data['category'],
                salary_range=job_data['salary_range'],
                experience_required=job_data['experience_required'],
                description=job_data['description'],
                skills_required=job_data['skills_required'],
                is_featured=job_data['is_featured'],
                status='active',
                apply_deadline=timezone.now() + timedelta(days=30),
                created_by=user
            )

        self.stdout.write(self.style.SUCCESS(f'Successfully seeded {len(jobs_data)} jobs!'))
