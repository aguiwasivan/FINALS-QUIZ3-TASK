from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tasks', '0002_task_deadline'),
    ]

    operations = [
        migrations.AddField(
            model_name='task',
            name='details',
            field=models.TextField(blank=True),
        ),
    ]
