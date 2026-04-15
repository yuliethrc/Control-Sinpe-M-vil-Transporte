from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Optional

class SinpeBase(BaseModel):
    date: Optional[datetime] = None
    guide_number: str
    client_name: str
    amount: float
    received_by: str
    state: Optional[str] = "No confirmado"

class SinpeCreate(SinpeBase):
    pass

class SinpeUpdate(BaseModel):
    date: Optional[datetime] = None
    guide_number: Optional[str] = None
    client_name: Optional[str] = None
    amount: Optional[float] = None
    received_by: Optional[str] = None
    state: Optional[str] = None

class SinpeRecord(SinpeBase):
    id: int
    
    model_config = ConfigDict(from_attributes=True)
