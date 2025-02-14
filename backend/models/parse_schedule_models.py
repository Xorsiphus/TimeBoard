from pydantic import BaseModel


class PromptRequest(BaseModel):
    prompt: str


class ScheduleItem(BaseModel):
    id: str
    text: str
    start: str
    end: str
