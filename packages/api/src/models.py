from pydantic import BaseModel, ConfigDict
from typing import Optional,List
from datetime import datetime

class InboundAction(BaseModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    action: str
    value: Optional[any] = None

class OutboundAction(BaseModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    action:str
    options:Optional[List[any]] = None


class GameData(BaseModel):
    board: Optional[List[List[Optional[int]]]] = None
    player: Optional[int] = None
    dice: Optional[List[int]] = None

    next: Optional[OutboundAction] = None

class SessionData(BaseModel):
    created: datetime
    game:Optional[GameData] = None