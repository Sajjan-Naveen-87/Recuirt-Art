from django.contrib import admin
from .models import NewsItem, VisitorCount

@admin.register(NewsItem)
class NewsItemAdmin(admin.ModelAdmin):
    list_display = ('title', 'is_active', 'created_at', 'updated_at')
    list_filter = ('is_active', 'created_at')
    search_fields = ('title', 'description', 'content')
    readonly_fields = ('created_at', 'updated_at')
    fieldsets = (
        (None, {
            'fields': ('title', 'is_active')
        }),
        ('Content', {
            'fields': ('description', 'content', 'image', 'link_url')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

@admin.register(VisitorCount)
class VisitorCountAdmin(admin.ModelAdmin):
    list_display = ('count', 'updated_at')
    readonly_fields = ('updated_at',)

    def has_add_permission(self, request):
        # Only allow one row
        return not VisitorCount.objects.exists()

    def has_delete_permission(self, request, obj=None):
        return False
