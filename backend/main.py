from fastapi import FastAPI
from typing import List

from handlers.parse_schedule_handler import parse_schedule_handler
from models.parse_schedule_models import ScheduleItem, PromptRequest

app = FastAPI()


@app.post("/parse_schedule", response_model=List[ScheduleItem])
async def parse_schedule(request: PromptRequest):
    return parse_schedule_handler(request)

