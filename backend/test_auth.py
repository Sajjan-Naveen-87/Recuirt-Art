import os, django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'recruit_art.settings')
django.setup()

from django.contrib.auth import authenticate

print("Testing valid email, wrong password...")
try:
    user = authenticate(email='sajjanboynaveen3@gmail.com', password='wrongpassword123')
    print("Result:", user)
except Exception as e:
    import traceback
    traceback.print_exc()

print("Testing wrong email...")
try:
    user = authenticate(email='doesnotexist@example.com', password='wrongpassword123')
    print("Result:", user)
except Exception as e:
    import traceback
    traceback.print_exc()
