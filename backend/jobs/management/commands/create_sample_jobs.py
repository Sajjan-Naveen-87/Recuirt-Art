from django.core.management.base import BaseCommand
from jobs.models import Job

class Command(BaseCommand):
    help = 'Create sample jobs for testing'

    def handle(self, *args, **options):
        # Sample job data
        jobs_data = [
            {
                'title': 'Senior Full Stack Developer',
                'company_name': 'TechCorp Inc.',
                'location': 'San Francisco, CA',
                'job_type': 'full_time',
                'salary_range': '$120k - $160k',
                'description': 'We are looking for a Senior Full Stack Developer to join our dynamic team. You will be responsible for developing and maintaining web applications using modern technologies.',
                'skills_required': 'React, Node.js, Python, AWS, microservices',
                'status': 'active',
                'apply_deadline': '2025-12-31T23:59:59Z',
            },
            {
                'title': 'Product Manager',
                'company_name': 'InnovateLabs',
                'location': 'New York, NY',
                'job_type': 'full_time',
                'salary_range': '$130k - $170k',
                'description': 'Join our product team as a Product Manager. You will drive product strategy, work closely with engineering teams, and ensure we deliver exceptional user experiences.',
                'skills_required': 'Product management, Agile, Analytics, Communication',
                'status': 'active',
                'apply_deadline': '2025-12-31T23:59:59Z',
            },
            {
                'title': 'DevOps Engineer',
                'company_name': 'CloudTech Solutions',
                'location': 'Austin, TX',
                'job_type': 'full_time',
                'salary_range': '$110k - $140k',
                'description': 'We are seeking a DevOps Engineer to help us build and maintain our cloud infrastructure. You will work with cutting-edge technologies and ensure high availability of our services.',
                'skills_required': 'AWS, Docker, Kubernetes, CI/CD, Infrastructure as Code',
                'status': 'active',
                'apply_deadline': '2025-12-31T23:59:59Z',
            },
            {
                'title': 'UI/UX Designer',
                'company_name': 'DesignStudio',
                'location': 'Los Angeles, CA',
                'job_type': 'full_time',
                'salary_range': '$90k - $120k',
                'description': 'Create beautiful and intuitive user experiences for our web and mobile applications. Work closely with product and engineering teams to deliver pixel-perfect designs.',
                'skills_required': 'Figma, Sketch, Adobe Creative Suite, UI/UX Design',
                'status': 'active',
                'apply_deadline': '2025-12-31T23:59:59Z',
            },
            {
                'title': 'Data Scientist',
                'company_name': 'DataDriven Corp',
                'location': 'Seattle, WA',
                'job_type': 'full_time',
                'salary_range': '$140k - $180k',
                'description': 'Apply advanced analytics and machine learning techniques to solve complex business problems. Work with large datasets and build predictive models.',
                'skills_required': 'Python, R, SQL, Machine Learning, Statistics',
                'status': 'active',
                'apply_deadline': '2025-12-31T23:59:59Z',
            },
            {
                'title': 'Mobile App Developer',
                'company_name': 'AppWorks',
                'location': 'Remote',
                'job_type': 'full_time',
                'salary_range': '$100k - $130k',
                'description': 'Develop native mobile applications for iOS and Android. Work on exciting projects that reach millions of users worldwide.',
                'skills_required': 'React Native, Flutter, iOS, Android, App Deployment',
                'status': 'active',
                'apply_deadline': '2025-12-31T23:59:59Z',
            },
        ]

        # Create jobs
        created_count = 0
        for job_data in jobs_data:
            job, created = Job.objects.get_or_create(
                title=job_data['title'],
                company_name=job_data['company_name'],
                defaults=job_data
            )
            if created:
                created_count += 1
                self.stdout.write(
                    self.style.SUCCESS(f'Created job: {job.title} at {job.company_name}')
                )
            else:
                self.stdout.write(
                    f'Job already exists: {job.title} at {job.company_name}'
                )

        self.stdout.write(
            self.style.SUCCESS(f'Successfully created {created_count} sample jobs')
        )
