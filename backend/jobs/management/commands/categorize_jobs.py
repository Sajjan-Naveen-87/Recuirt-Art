from django.core.management.base import BaseCommand
from jobs.models import Job

class Command(BaseCommand):
    help = 'Categorizes all existing jobs into Clinician or Non-Clinician based on their titles and descriptions.'

    def handle(self, *args, **kwargs):
        jobs = Job.objects.all()
        updated_count = 0
        
        clinician_keywords = [
            'doctor', 'nurse', 'surgeon', 'physician', 'therapist', 'medical', 
            'clinical', 'dental', 'dentist', 'psychiatrist', 'psychologist', 
            'pediatrician', 'cardiologist', 'neurologist', 'pharmacist', 'pharmacy',
            'practitioner', 'specialist', 'technician'
        ]
        
        for job in jobs:
            title_lower = job.title.lower()
            desc_lower = job.description.lower()
            
            is_clinician = any(keyword in title_lower for keyword in clinician_keywords)
            
            # If not explicitly clinician in title, check description implicitly or just assume non-clinician
            if is_clinician:
                job.category = 'clinician'
            else:
                job.category = 'non_clinician'
                
            job.save()
            updated_count += 1
            self.stdout.write(self.style.SUCCESS(f"Updated '{job.title}' -> {job.category}"))
            
        self.stdout.write(self.style.SUCCESS(f"\nSuccessfully categorized {updated_count} jobs."))
