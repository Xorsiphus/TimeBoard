from typing import List

from models.parse_schedule_models import ScheduleItem, PromptRequest


def parse_schedule_handler(request: PromptRequest) -> List[ScheduleItem]:
    return [ScheduleItem(
        title=request.prompt,
        description='description',
        start_time='start_time',
        end_time='end_time'
    )]

