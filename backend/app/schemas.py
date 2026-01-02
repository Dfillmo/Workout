from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime


# Exercise Schemas
class ExerciseBase(BaseModel):
    name: str
    order: int
    sets: Optional[str] = "3"
    reps: Optional[str] = "10-12"
    weight_recommendation: Optional[str] = None
    notes: Optional[str] = None
    video_url: Optional[str] = None
    image_url: Optional[str] = None


class ExerciseCreate(ExerciseBase):
    pass


class Exercise(ExerciseBase):
    id: int
    circuit_id: int

    class Config:
        from_attributes = True


# Circuit Schemas
class CircuitBase(BaseModel):
    circuit_number: int
    name: Optional[str] = None
    rounds: int = 3


class CircuitCreate(CircuitBase):
    exercises: List[ExerciseCreate]


class Circuit(CircuitBase):
    id: int
    workout_day_id: int
    exercises: List[Exercise] = []

    class Config:
        from_attributes = True


# Workout Day Schemas
class WorkoutDayBase(BaseModel):
    name: str
    day_number: int
    muscle_groups: Optional[str] = None


class WorkoutDayCreate(WorkoutDayBase):
    circuits: List[CircuitCreate]


class WorkoutDay(WorkoutDayBase):
    id: int
    plan_id: int
    circuits: List[Circuit] = []

    class Config:
        from_attributes = True


class WorkoutDaySummary(BaseModel):
    id: int
    plan_id: int
    name: str
    day_number: int
    muscle_groups: Optional[str] = None
    exercise_count: int
    circuit_count: int

    class Config:
        from_attributes = True


# Workout Plan Schemas
class WorkoutPlanBase(BaseModel):
    name: str
    description: Optional[str] = None


class WorkoutPlanCreate(WorkoutPlanBase):
    workout_days: List[WorkoutDayCreate]


class WorkoutPlan(WorkoutPlanBase):
    id: int
    pdf_filename: Optional[str] = None
    created_at: datetime
    workout_days: List[WorkoutDay] = []

    class Config:
        from_attributes = True


class WorkoutPlanSummary(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    created_at: datetime
    day_count: int

    class Config:
        from_attributes = True


# Workout Session Schemas
class ExerciseLogCreate(BaseModel):
    exercise_id: int
    set_number: int
    reps_completed: Optional[int] = None
    weight_used: Optional[float] = None
    completed: bool = False


class ExerciseLog(ExerciseLogCreate):
    id: int
    session_id: int

    class Config:
        from_attributes = True


class WorkoutSessionCreate(BaseModel):
    workout_day_id: int
    notes: Optional[str] = None


class WorkoutSessionUpdate(BaseModel):
    completed_at: Optional[datetime] = None
    duration_minutes: Optional[int] = None
    notes: Optional[str] = None


class WorkoutSession(BaseModel):
    id: int
    workout_day_id: int
    started_at: datetime
    completed_at: Optional[datetime] = None
    duration_minutes: Optional[int] = None
    notes: Optional[str] = None
    exercise_logs: List[ExerciseLog] = []

    class Config:
        from_attributes = True


# User Stats Schemas
class UserStatsResponse(BaseModel):
    total_workouts: int
    current_streak: int
    longest_streak: int
    total_workout_minutes: int
    last_workout_date: Optional[datetime] = None

    class Config:
        from_attributes = True


# PDF Upload Response
class PDFUploadResponse(BaseModel):
    success: bool
    message: str
    plan_id: Optional[int] = None
    workout_days_count: int = 0
    exercises_count: int = 0


# Exercise History
class WeightHistoryEntry(BaseModel):
    date: str
    weight: float
    reps: Optional[int] = None


class ExerciseHistoryResponse(BaseModel):
    exercise_id: int
    exercise_name: str
    history: List[WeightHistoryEntry] = []
    last_weight: Optional[float] = None
    max_weight: Optional[float] = None
    total_logs: int = 0

