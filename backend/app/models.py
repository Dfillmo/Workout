from sqlalchemy import Column, Integer, String, Text, ForeignKey, Boolean, DateTime, Float
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base


class WorkoutPlan(Base):
    __tablename__ = "workout_plans"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    pdf_filename = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    workout_days = relationship("WorkoutDay", back_populates="plan", cascade="all, delete-orphan")


class WorkoutDay(Base):
    __tablename__ = "workout_days"
    
    id = Column(Integer, primary_key=True, index=True)
    plan_id = Column(Integer, ForeignKey("workout_plans.id"), nullable=False)
    name = Column(String(255), nullable=False)  # e.g., "Day 1 - Back & Biceps"
    day_number = Column(Integer, nullable=False)
    muscle_groups = Column(String(255), nullable=True)  # e.g., "Back, Biceps"
    
    plan = relationship("WorkoutPlan", back_populates="workout_days")
    circuits = relationship("Circuit", back_populates="workout_day", cascade="all, delete-orphan")


class Circuit(Base):
    __tablename__ = "circuits"
    
    id = Column(Integer, primary_key=True, index=True)
    workout_day_id = Column(Integer, ForeignKey("workout_days.id"), nullable=False)
    circuit_number = Column(Integer, nullable=False)
    name = Column(String(255), nullable=True)  # e.g., "Circuit 1"
    rounds = Column(Integer, default=3)
    
    workout_day = relationship("WorkoutDay", back_populates="circuits")
    exercises = relationship("Exercise", back_populates="circuit", cascade="all, delete-orphan")


class Exercise(Base):
    __tablename__ = "exercises"
    
    id = Column(Integer, primary_key=True, index=True)
    circuit_id = Column(Integer, ForeignKey("circuits.id"), nullable=False)
    name = Column(String(255), nullable=False)
    order = Column(Integer, nullable=False)
    sets = Column(String(50), nullable=True)  # e.g., "3" or "3-4"
    reps = Column(String(50), nullable=True)  # e.g., "15, 12, 10" or "10-12"
    weight_recommendation = Column(String(100), nullable=True)  # e.g., "45-55 lbs"
    notes = Column(Text, nullable=True)
    video_url = Column(String(500), nullable=True)
    image_url = Column(String(500), nullable=True)
    
    circuit = relationship("Circuit", back_populates="exercises")


class WorkoutSession(Base):
    __tablename__ = "workout_sessions"
    
    id = Column(Integer, primary_key=True, index=True)
    workout_day_id = Column(Integer, ForeignKey("workout_days.id"), nullable=False)
    started_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)
    duration_minutes = Column(Integer, nullable=True)
    notes = Column(Text, nullable=True)
    
    exercise_logs = relationship("ExerciseLog", back_populates="session", cascade="all, delete-orphan")


class ExerciseLog(Base):
    __tablename__ = "exercise_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("workout_sessions.id"), nullable=False)
    exercise_id = Column(Integer, ForeignKey("exercises.id"), nullable=False)
    set_number = Column(Integer, nullable=False)
    reps_completed = Column(Integer, nullable=True)
    weight_used = Column(Float, nullable=True)
    completed = Column(Boolean, default=False)
    logged_at = Column(DateTime, default=datetime.utcnow)
    
    session = relationship("WorkoutSession", back_populates="exercise_logs")


class UserStats(Base):
    __tablename__ = "user_stats"
    
    id = Column(Integer, primary_key=True, index=True)
    total_workouts = Column(Integer, default=0)
    current_streak = Column(Integer, default=0)
    longest_streak = Column(Integer, default=0)
    total_workout_minutes = Column(Integer, default=0)
    last_workout_date = Column(DateTime, nullable=True)

