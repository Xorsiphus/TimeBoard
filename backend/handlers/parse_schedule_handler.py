import uuid
from typing import List
from datetime import datetime, timedelta, timezone

from models.parse_schedule_models import ScheduleItem, PromptRequest


def get_delta_datetime(date_time: datetime, delta_days: int = 0, delta_hours: int = 0) -> str:
    return (date_time.replace(microsecond=0) + timedelta(days=delta_days, hours=delta_hours)).isoformat()


def parse_schedule_handler(request: PromptRequest) -> List[ScheduleItem]:
    # TODO добавить обработку промта
    today_datetime = datetime.now(timezone.utc)
    return [
        ScheduleItem(
            id=str(uuid.uuid4()),
            text=request.prompt,
            start=get_delta_datetime(today_datetime),
            end=get_delta_datetime(today_datetime, 0, 1),
        ),
        ScheduleItem(
            id=str(uuid.uuid4()),
            text='Элемент 2',
            start=get_delta_datetime(today_datetime, 1, 1),
            end=get_delta_datetime(today_datetime, 1, 2),
        ),
        ScheduleItem(
            id=str(uuid.uuid4()),
            text='Элемент 3',
            start=get_delta_datetime(today_datetime, -1, -1),
            end=get_delta_datetime(today_datetime, -1),
        ),
    ]
