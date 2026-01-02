from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List
import os
import shutil
from datetime import datetime, timedelta

from . import models, schemas
from .database import get_db
from .pdf_parser import WorkoutPDFParser

router = APIRouter()

UPLOAD_DIR = "./data/uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


# ============== Workout Plans ==============

@router.get("/plans", response_model=List[schemas.WorkoutPlanSummary])
def get_workout_plans(db: Session = Depends(get_db)):
    """Get all workout plans with summary info."""
    plans = db.query(models.WorkoutPlan).all()
    result = []
    for plan in plans:
        result.append(schemas.WorkoutPlanSummary(
            id=plan.id,
            name=plan.name,
            description=plan.description,
            created_at=plan.created_at,
            day_count=len(plan.workout_days)
        ))
    return result


@router.get("/plans/{plan_id}", response_model=schemas.WorkoutPlan)
def get_workout_plan(plan_id: int, db: Session = Depends(get_db)):
    """Get a specific workout plan with all details."""
    plan = db.query(models.WorkoutPlan).filter(models.WorkoutPlan.id == plan_id).first()
    if not plan:
        raise HTTPException(status_code=404, detail="Workout plan not found")
    return plan


@router.delete("/plans/{plan_id}")
def delete_workout_plan(plan_id: int, db: Session = Depends(get_db)):
    """Delete a workout plan."""
    plan = db.query(models.WorkoutPlan).filter(models.WorkoutPlan.id == plan_id).first()
    if not plan:
        raise HTTPException(status_code=404, detail="Workout plan not found")
    
    db.delete(plan)
    db.commit()
    return {"message": "Workout plan deleted successfully"}


@router.post("/plans/upload", response_model=schemas.PDFUploadResponse)
async def upload_workout_pdf(
    file: UploadFile = File(...),
    plan_name: str = Form(None),
    db: Session = Depends(get_db)
):
    """Upload and parse a workout PDF file."""
    if not file.filename.lower().endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")
    
    # Save uploaded file
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    try:
        # Parse PDF
        parser = WorkoutPDFParser()
        parsed_data = parser.parse_pdf(file_path)
        
        # Create workout plan
        plan = models.WorkoutPlan(
            name=plan_name or parsed_data.get("name", "Imported Workout"),
            pdf_filename=file.filename
        )
        db.add(plan)
        db.flush()
        
        total_exercises = 0
        
        # Create workout days
        for day_data in parsed_data.get("workout_days", []):
            workout_day = models.WorkoutDay(
                plan_id=plan.id,
                name=day_data["name"],
                day_number=day_data["day_number"],
                muscle_groups=day_data.get("muscle_groups")
            )
            db.add(workout_day)
            db.flush()
            
            # Create circuits
            for circuit_data in day_data.get("circuits", []):
                circuit = models.Circuit(
                    workout_day_id=workout_day.id,
                    circuit_number=circuit_data["circuit_number"],
                    name=circuit_data.get("name", f"Circuit {circuit_data['circuit_number']}"),
                    rounds=circuit_data.get("rounds", 3)
                )
                db.add(circuit)
                db.flush()
                
                # Create exercises
                for ex_data in circuit_data.get("exercises", []):
                    exercise = models.Exercise(
                        circuit_id=circuit.id,
                        name=ex_data["name"],
                        order=ex_data["order"],
                        sets=ex_data.get("sets", "3"),
                        reps=ex_data.get("reps", "10-12"),
                        weight_recommendation=ex_data.get("weight_recommendation"),
                        notes=ex_data.get("notes")
                    )
                    db.add(exercise)
                    total_exercises += 1
        
        db.commit()
        
        return schemas.PDFUploadResponse(
            success=True,
            message=f"Successfully imported workout plan: {plan.name}",
            plan_id=plan.id,
            workout_days_count=len(parsed_data.get("workout_days", [])),
            exercises_count=total_exercises
        )
        
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error parsing PDF: {str(e)}")


# ============== Workout Days ==============

@router.get("/days", response_model=List[schemas.WorkoutDaySummary])
def get_workout_days(plan_id: int = None, db: Session = Depends(get_db)):
    """Get all workout days, optionally filtered by plan."""
    query = db.query(models.WorkoutDay)
    if plan_id:
        query = query.filter(models.WorkoutDay.plan_id == plan_id)
    
    days = query.all()
    result = []
    for day in days:
        exercise_count = sum(len(c.exercises) for c in day.circuits)
        result.append(schemas.WorkoutDaySummary(
            id=day.id,
            plan_id=day.plan_id,
            name=day.name,
            day_number=day.day_number,
            muscle_groups=day.muscle_groups,
            exercise_count=exercise_count,
            circuit_count=len(day.circuits)
        ))
    return result


@router.get("/days/{day_id}", response_model=schemas.WorkoutDay)
def get_workout_day(day_id: int, db: Session = Depends(get_db)):
    """Get a specific workout day with all circuits and exercises."""
    day = db.query(models.WorkoutDay).filter(models.WorkoutDay.id == day_id).first()
    if not day:
        raise HTTPException(status_code=404, detail="Workout day not found")
    return day


# ============== Workout Sessions ==============

@router.post("/sessions", response_model=schemas.WorkoutSession)
def start_workout_session(
    session_data: schemas.WorkoutSessionCreate,
    db: Session = Depends(get_db)
):
    """Start a new workout session."""
    # Verify workout day exists
    day = db.query(models.WorkoutDay).filter(
        models.WorkoutDay.id == session_data.workout_day_id
    ).first()
    if not day:
        raise HTTPException(status_code=404, detail="Workout day not found")
    
    session = models.WorkoutSession(
        workout_day_id=session_data.workout_day_id,
        notes=session_data.notes
    )
    db.add(session)
    db.commit()
    db.refresh(session)
    return session


@router.get("/sessions", response_model=List[schemas.WorkoutSession])
def get_all_sessions(db: Session = Depends(get_db)):
    """Get all workout sessions, ordered by most recent."""
    sessions = db.query(models.WorkoutSession).order_by(
        models.WorkoutSession.started_at.desc()
    ).limit(50).all()
    return sessions


@router.get("/sessions/{session_id}", response_model=schemas.WorkoutSession)
def get_workout_session(session_id: int, db: Session = Depends(get_db)):
    """Get a specific workout session."""
    session = db.query(models.WorkoutSession).filter(
        models.WorkoutSession.id == session_id
    ).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    return session


@router.delete("/sessions/{session_id}")
def delete_workout_session(session_id: int, db: Session = Depends(get_db)):
    """Delete a workout session."""
    session = db.query(models.WorkoutSession).filter(
        models.WorkoutSession.id == session_id
    ).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    db.delete(session)
    db.commit()
    return {"message": "Session deleted successfully"}


@router.patch("/sessions/{session_id}", response_model=schemas.WorkoutSession)
def update_workout_session(
    session_id: int,
    update_data: schemas.WorkoutSessionUpdate,
    db: Session = Depends(get_db)
):
    """Update a workout session (e.g., mark as completed)."""
    session = db.query(models.WorkoutSession).filter(
        models.WorkoutSession.id == session_id
    ).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    if update_data.completed_at:
        session.completed_at = update_data.completed_at
        # Update user stats
        _update_user_stats(db, session)
    if update_data.duration_minutes is not None:
        session.duration_minutes = update_data.duration_minutes
    if update_data.notes is not None:
        session.notes = update_data.notes
    
    db.commit()
    db.refresh(session)
    return session


@router.post("/sessions/{session_id}/log", response_model=schemas.ExerciseLog)
def log_exercise(
    session_id: int,
    log_data: schemas.ExerciseLogCreate,
    db: Session = Depends(get_db)
):
    """Log an exercise completion in a session."""
    session = db.query(models.WorkoutSession).filter(
        models.WorkoutSession.id == session_id
    ).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    log = models.ExerciseLog(
        session_id=session_id,
        exercise_id=log_data.exercise_id,
        set_number=log_data.set_number,
        reps_completed=log_data.reps_completed,
        weight_used=log_data.weight_used,
        completed=log_data.completed
    )
    db.add(log)
    db.commit()
    db.refresh(log)
    return log


# ============== User Stats ==============

@router.get("/stats", response_model=schemas.UserStatsResponse)
def get_user_stats(db: Session = Depends(get_db)):
    """Get user workout statistics."""
    stats = db.query(models.UserStats).first()
    if not stats:
        stats = models.UserStats()
        db.add(stats)
        db.commit()
        db.refresh(stats)
    return stats


def _update_user_stats(db: Session, session: models.WorkoutSession):
    """Update user stats after completing a workout."""
    stats = db.query(models.UserStats).first()
    if not stats:
        stats = models.UserStats()
        db.add(stats)
    
    stats.total_workouts += 1
    if session.duration_minutes:
        stats.total_workout_minutes += session.duration_minutes
    
    # Update streak
    today = datetime.utcnow().date()
    if stats.last_workout_date:
        last_date = stats.last_workout_date.date()
        if last_date == today - timedelta(days=1):
            stats.current_streak += 1
        elif last_date != today:
            stats.current_streak = 1
    else:
        stats.current_streak = 1
    
    if stats.current_streak > stats.longest_streak:
        stats.longest_streak = stats.current_streak
    
    stats.last_workout_date = datetime.utcnow()
    db.commit()


# ============== Exercise History ==============

@router.get("/exercises/{exercise_id}/history", response_model=schemas.ExerciseHistoryResponse)
def get_exercise_history(exercise_id: int, db: Session = Depends(get_db)):
    """Get weight history for an exercise (no duplicates)."""
    exercise = db.query(models.Exercise).filter(models.Exercise.id == exercise_id).first()
    if not exercise:
        raise HTTPException(status_code=404, detail="Exercise not found")
    
    # Get all logs for this exercise
    logs = db.query(models.ExerciseLog).filter(
        models.ExerciseLog.exercise_id == exercise_id,
        models.ExerciseLog.weight_used.isnot(None)
    ).order_by(models.ExerciseLog.logged_at.asc()).all()
    
    # Also get logs for exercises with the same name (across all circuits/days)
    same_name_exercises = db.query(models.Exercise).filter(
        models.Exercise.name == exercise.name
    ).all()
    
    all_exercise_ids = [e.id for e in same_name_exercises]
    
    all_logs = db.query(models.ExerciseLog).filter(
        models.ExerciseLog.exercise_id.in_(all_exercise_ids),
        models.ExerciseLog.weight_used.isnot(None)
    ).order_by(models.ExerciseLog.logged_at.asc()).all()
    
    if not all_logs:
        return schemas.ExerciseHistoryResponse(
            exercise_id=exercise_id,
            exercise_name=exercise.name,
            history=[],
            last_weight=None,
            max_weight=None,
            total_logs=0
        )
    
    # Build history - dedupe by date (keep max weight per day)
    history_by_date = {}
    for log in all_logs:
        date_str = log.logged_at.strftime("%Y-%m-%d")
        if date_str not in history_by_date or log.weight_used > history_by_date[date_str]["weight"]:
            history_by_date[date_str] = {
                "date": date_str,
                "weight": log.weight_used,
                "reps": log.reps_completed
            }
    
    history = list(history_by_date.values())
    history.sort(key=lambda x: x["date"])
    
    # Get last and max weight
    last_weight = all_logs[-1].weight_used if all_logs else None
    max_weight = max((log.weight_used for log in all_logs), default=None)
    
    return schemas.ExerciseHistoryResponse(
        exercise_id=exercise_id,
        exercise_name=exercise.name,
        history=history,
        last_weight=last_weight,
        max_weight=max_weight,
        total_logs=len(all_logs)
    )


# ============== Manual Workout Creation ==============

@router.post("/plans", response_model=schemas.WorkoutPlan)
def create_workout_plan(
    plan_data: schemas.WorkoutPlanCreate,
    db: Session = Depends(get_db)
):
    """Manually create a workout plan."""
    plan = models.WorkoutPlan(
        name=plan_data.name,
        description=plan_data.description
    )
    db.add(plan)
    db.flush()
    
    for day_data in plan_data.workout_days:
        day = models.WorkoutDay(
            plan_id=plan.id,
            name=day_data.name,
            day_number=day_data.day_number,
            muscle_groups=day_data.muscle_groups
        )
        db.add(day)
        db.flush()
        
        for circuit_data in day_data.circuits:
            circuit = models.Circuit(
                workout_day_id=day.id,
                circuit_number=circuit_data.circuit_number,
                name=circuit_data.name,
                rounds=circuit_data.rounds
            )
            db.add(circuit)
            db.flush()
            
            for ex_data in circuit_data.exercises:
                exercise = models.Exercise(
                    circuit_id=circuit.id,
                    name=ex_data.name,
                    order=ex_data.order,
                    sets=ex_data.sets,
                    reps=ex_data.reps,
                    weight_recommendation=ex_data.weight_recommendation,
                    notes=ex_data.notes
                )
                db.add(exercise)
    
    db.commit()
    db.refresh(plan)
    return plan

