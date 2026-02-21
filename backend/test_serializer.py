import os, django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'recruit_art.settings')
django.setup()

from accounts.models import CustomUser
from accounts.serializers import UserSerializer

user = CustomUser.objects.first()
if user:
    print(f"Testing serialization for user: {user.email}")
    try:
        data = UserSerializer(user).data
        print("Success!")
        print(data)
    except Exception as e:
        import traceback
        traceback.print_exc()
else:
    print("No user found")
