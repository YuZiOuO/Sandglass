from datetime import datetime

from sandglass_api.models.project import Project, Status
from sandglass_api.models.tasks import Task
from sandglass_api.models.user import User

example_task = Task(
    taskName = 'Example task',
    deadline = '2018-01-01T00:00:00Z',
    status = 'completed',
    description= 'example description'
)

example_proj = Project(
    projName = 'Example proj',
    startTimestamp = datetime.now(),
    endTimestamp = datetime.now(),
    status = Status.NOT_STARTED,
    avatarUrl = 'https://cdnimg103.lizhi.fm/user/2017/02/04/2583325032200238082_160x160.jpg',
    description = 'A example proj',
    tasks = [example_task]
)

example_user = User(
    nickname="Alfred",
    email="test@example.com",
    pwd="1233211234567abc",
    avatarUrl="https://cdnimg103.lizhi.fm/user/2017/02/04/2583325032200238082_160x160.jpg"
)