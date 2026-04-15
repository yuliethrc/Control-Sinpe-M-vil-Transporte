from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime

import models
import schemas
from database import SessionLocal, engine

# Create the database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Control SINPE API")

# Allow CORS so the frontend can communicate seamlessly
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/api/sinpe", response_model=schemas.SinpeRecord)
def create_sinpe(record: schemas.SinpeCreate, db: Session = Depends(get_db)):
    db_record = models.SinpeRecord(**record.model_dump())
    if not db_record.date:
        db_record.date = datetime.utcnow()
    db.add(db_record)
    db.commit()
    db.refresh(db_record)
    return db_record

@app.get("/api/sinpe", response_model=List[schemas.SinpeRecord])
def get_all_sinpes(db: Session = Depends(get_db)):
    # Los registros deben ordenarse del más reciente al más antiguo.
    return db.query(models.SinpeRecord).order_by(models.SinpeRecord.date.desc()).all()

@app.get("/api/sinpe/pendientes", response_model=List[schemas.SinpeRecord])
def get_pendientes(db: Session = Depends(get_db)):
    return db.query(models.SinpeRecord).filter(models.SinpeRecord.state == "No confirmado").order_by(models.SinpeRecord.date.desc()).all()

@app.put("/api/sinpe/{record_id}", response_model=schemas.SinpeRecord)
def update_sinpe(record_id: int, record: schemas.SinpeUpdate, db: Session = Depends(get_db)):
    db_record = db.query(models.SinpeRecord).filter(models.SinpeRecord.id == record_id).first()
    if not db_record:
        raise HTTPException(status_code=404, detail="Record not found")
    
    update_data = record.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_record, key, value)
    
    db.commit()
    db.refresh(db_record)
    return db_record

@app.put("/api/sinpe/{record_id}/state")
def toggle_state(record_id: int, db: Session = Depends(get_db)):
    db_record = db.query(models.SinpeRecord).filter(models.SinpeRecord.id == record_id).first()
    if not db_record:
        raise HTTPException(status_code=404, detail="Record not found")
    
    db_record.state = "Confirmado" if db_record.state == "No confirmado" else "No confirmado"
    db.commit()
    return {"status": "ok", "new_state": db_record.state}

@app.delete("/api/sinpe/{record_id}")
def delete_sinpe(record_id: int, db: Session = Depends(get_db)):
    db_record = db.query(models.SinpeRecord).filter(models.SinpeRecord.id == record_id).first()
    if not db_record:
        raise HTTPException(status_code=404, detail="Record not found")
    db.delete(db_record)
    db.commit()
    return {"status": "deleted"}
