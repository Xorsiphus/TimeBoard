from pydantic import BaseModel


class PromptRequest(BaseModel):
    prompt: str


class ScheduleItem(BaseModel):
    title: str
    description: str
    start_time: str
    end_time: str
