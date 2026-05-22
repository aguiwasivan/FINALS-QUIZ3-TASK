from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from .models import Task
from .serializers import TaskSerializer


@api_view(['GET', 'POST'])
def task_list(request):

    # GET TASKS
    if request.method == 'GET':

        tasks = Task.objects.all()
        serializer = TaskSerializer(tasks, many=True)

        return Response(serializer.data)

    # ADD TASK
    elif request.method == 'POST':

        serializer = TaskSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT', 'DELETE'])
def update_task(request, pk):

    task = Task.objects.get(id=pk)

    if request.method == 'DELETE':
        task.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    serializer = TaskSerializer(task, data=request.data)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
