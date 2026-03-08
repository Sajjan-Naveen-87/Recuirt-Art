import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'recruit_art.settings')
django.setup()

from django.core.files.storage import default_storage
print(default_storage.__class__)
try:
    url = default_storage.url("team/Founder-New.png")
    print("url:", url)
except Exception as e:
    print("Error:", e)
