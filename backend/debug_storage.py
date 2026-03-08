import os
import sys

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'recruit_art.settings')
import django
django.setup()

from feedback.models import TeamMember

count = TeamMember.objects.count()
print(f"TeamMember count: {count}")

if count > 0:
    for tm in TeamMember.objects.all()[:2]:
        print(f"Name: {tm.name}")
        if tm.image:
            print(f"Image name: {tm.image.name}")
            try:
                print(f"Image url: {tm.image.url}")
            except Exception as e:
                print(f"URL error: {e}")
        else:
            print("No image")
