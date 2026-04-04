from django.db import models

class NewsItem(models.Model):
    """
    Model for storing News and Updates shown on the landing page.
    """
    title = models.CharField('Title', max_length=255)
    description = models.TextField('Short Description', blank=True, help_text="Brief summary shown on the card")
    content = models.TextField('Full Content', blank=True, help_text="Detailed news content")
    image = models.ImageField('Cover Image', upload_to='news_images/', blank=True, null=True)
    link_url = models.URLField('External Link', blank=True, null=True, help_text="Link to full article or external site")
    is_active = models.BooleanField('Is Active', default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'content_newsitem'
        verbose_name = 'News & Update'
        verbose_name_plural = 'News & Updates'
        ordering = ['-created_at']

    def __str__(self):
        return self.title

class VisitorCount(models.Model):
    """
    Single-row model to track total site visitors.
    """
    count = models.PositiveIntegerField('Total Visitors', default=1000)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'content_visitorcount'
        verbose_name = 'Visitor Counter'
        verbose_name_plural = 'Visitor Counter'

    def __str__(self):
        return f"Total Visitors: {self.count}"
