from sqlalchemy import Column, Integer, String, Float, DateTime
from datetime import datetime
from database import Base

class SinpeRecord(Base):
    __tablename__ = "sinpe_records"

    id = Column(Integer, primary_key=True, index=True)
    date = Column(DateTime, default=datetime.utcnow)
    guide_number = Column(String, index=True)
    client_name = Column(String, index=True)
    amount = Column(Float)
    received_by = Column(String)
    state = Column(String, default="No confirmado") # "Confirmado" o "No confirmado"
