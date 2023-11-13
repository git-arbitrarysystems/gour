from pydantic import BaseModel, ConfigDict
from typing import Optional,List
from datetime import datetime

class InboundAction(BaseModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    type: str
    value: Optional[any] = None

class OutboundAction(BaseModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    type:str
    options:List[any] = []

class SessionData(BaseModel):
    created: datetime
    game:Optional[dict] = None