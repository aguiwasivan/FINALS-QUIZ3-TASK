from django.urls import path
from .views import task_list, update_task

urlpatterns = [
    path('tasks/', task_list),
    path('tasks/<int:pk>/', update_task),
]