import uvicorn
from fastapi import FastAPI
from typing import List
from fastapi.middleware.cors import CORSMiddleware

from handlers.parse_schedule_handler import parse_schedule_handler
from models.parse_schedule_models import ScheduleItem, PromptRequest

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/parse_schedule", response_model=List[ScheduleItem])
async def parse_schedule(request: PromptRequest):
    return parse_schedule_handler(request)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
