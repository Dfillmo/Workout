import pdfplumber
import re
from typing import List, Dict, Any, Optional
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class WorkoutPDFParser:
    """
    Parser for workout PDF files.
    Extracts workout days, circuits, and exercises from PDF content.
    Optimized for fitness program PDFs like Nick Bare's Embrace the Suck.
    """
    
    def __init__(self):
        self.common_exercises = [
            "press", "curl", "row", "squat", "deadlift", "lunge", "fly",
            "extension", "raise", "pulldown", "pushup", "push-up", "push up",
            "crunch", "plank", "dip", "shrug", "kickback", "pullover", 
            "skull crusher", "hammer", "preacher", "concentration", "cable",
            "dumbbell", "barbell", "machine", "smith", "bench", "incline", 
            "decline", "overhead", "lateral", "front", "rear", "face pull",
            "tricep", "bicep", "pull up", "pullup", "chin up", "lat", 
            "muscle up", "leg raise", "sit up", "l-sit", "rope", "hand stand",
            "handstand", "push down", "pushdown"
        ]
        
        self.muscle_groups = [
            "chest", "back", "shoulders", "biceps", "triceps", "arms",
            "legs", "quads", "hamstrings", "glutes", "calves", "abs",
            "core", "full body", "upper body", "lower body", "push", "pull"
        ]
        
        # Words that indicate this line is NOT an exercise
        self.skip_patterns = [
            r'^\*',  # Lines starting with asterisk (notes)
            r'^the intent',
            r'^these are',
            r'^bar or rings',
            r'^as long as',
            r'^warm up',
            r'^rest',
            r'^note:',
            r'^tip:',
            r'^\d+\s*rm\s*x',  # Like "3-RM x 3 sets"
            r'^rm\s*x',
        ]
    
    def parse_pdf(self, pdf_path: str) -> Dict[str, Any]:
        """Parse a workout PDF and extract structured data."""
        try:
            with pdfplumber.open(pdf_path) as pdf:
                all_tables = []
                full_text = ""
                
                for page in pdf.pages:
                    # Try to extract tables first (better for structured PDFs)
                    tables = page.extract_tables()
                    if tables:
                        all_tables.extend(tables)
                    
                    # Also get text
                    text = page.extract_text()
                    if text:
                        full_text += text + "\n"
                
                logger.info(f"Extracted {len(full_text)} characters from PDF")
                logger.info(f"Found {len(all_tables)} tables")
                
                # If we have tables, use table parsing (better for Nick Bare format)
                if all_tables:
                    return self._parse_tables(all_tables, full_text)
                else:
                    return self._parse_workout_text(full_text)
                    
        except Exception as e:
            logger.error(f"Error parsing PDF: {e}")
            raise
    
    def _parse_tables(self, tables: List, full_text: str) -> Dict[str, Any]:
        """Parse workout data from PDF tables."""
        result = {
            "name": self._extract_plan_name(full_text.split('\n')),
            "workout_days": []
        }
        
        current_day = None
        current_circuit = None
        exercise_order = 1
        
        for table in tables:
            if not table:
                continue
                
            for row in table:
                if not row or all(cell is None or cell == '' for cell in row):
                    continue
                
                # Clean row
                row = [str(cell).strip() if cell else '' for cell in row]
                
                # Check if this is a day header (Week X, Day Y)
                row_text = ' '.join(row).lower()
                day_match = re.search(r'week\s*(\d+).*day\s*(\d+)\s*[:\-]?\s*(\w+)?', row_text, re.IGNORECASE)
                if day_match or 'day' in row_text and any(mg in row_text for mg in ['push', 'pull', 'leg', 'upper', 'lower', 'chest', 'back', 'arm']):
                    # Save previous day
                    if current_day and current_circuit:
                        if current_circuit.get("exercises"):
                            current_day["circuits"].append(current_circuit)
                        if current_day.get("circuits"):
                            result["workout_days"].append(current_day)
                    
                    # Extract day info
                    day_name = ' '.join(row).strip()
                    day_num = len(result["workout_days"]) + 1
                    muscle_groups = self._extract_muscle_groups(day_name)
                    
                    if day_match:
                        week = day_match.group(1)
                        day = day_match.group(2)
                        workout_type = day_match.group(3) or ""
                        day_name = f"Week {week}, Day {day}"
                        if workout_type:
                            day_name += f": {workout_type.upper()}"
                    
                    current_day = {
                        "name": day_name,
                        "day_number": day_num,
                        "muscle_groups": muscle_groups,
                        "circuits": []
                    }
                    current_circuit = {
                        "circuit_number": 1,
                        "name": "Circuit 1",
                        "rounds": 3,
                        "exercises": []
                    }
                    exercise_order = 1
                    continue
                
                # Check if this is a header row
                if any(h in row_text for h in ['exercise', 'sets', 'reps', 'notes']):
                    continue
                
                # Try to parse as exercise row
                exercise = self._parse_table_row(row, exercise_order)
                if exercise and current_circuit is not None:
                    current_circuit["exercises"].append(exercise)
                    exercise_order += 1
        
        # Add last day/circuit
        if current_day and current_circuit:
            if current_circuit.get("exercises"):
                current_day["circuits"].append(current_circuit)
            if current_day.get("circuits"):
                result["workout_days"].append(current_day)
        
        return result
    
    def _parse_table_row(self, row: List[str], order: int) -> Optional[Dict[str, Any]]:
        """Parse a table row as an exercise."""
        if len(row) < 2:
            return None
        
        # First column is usually exercise name
        name = row[0].strip()
        
        # Skip if it looks like a note
        name_lower = name.lower()
        for pattern in self.skip_patterns:
            if re.search(pattern, name_lower):
                return None
        
        # Skip if name is too short or doesn't look like an exercise
        if len(name) < 3:
            return None
        
        # Skip if it's just numbers
        if re.match(r'^[\d\-\s]+$', name):
            return None
            
        # Skip if it starts with common note indicators
        if name.startswith('*') or name.startswith('('):
            return None
        
        # Check if it's a valid exercise name
        is_exercise = any(ex in name_lower for ex in self.common_exercises)
        
        # Also check if it has a reasonable structure (not just random text)
        has_alpha = bool(re.search(r'[a-zA-Z]{3,}', name))
        
        if not has_alpha:
            return None
        
        # Try to find sets (usually column 2)
        sets = "3"
        if len(row) > 1 and row[1]:
            sets_match = re.search(r'(\d+)', row[1])
            if sets_match:
                sets = sets_match.group(1)
        
        # Try to find reps (usually column 3)
        reps = "10-12"
        if len(row) > 2 and row[2]:
            reps_val = row[2].strip()
            if reps_val and reps_val.upper() not in ['AMRAP', 'ALAP']:
                reps = reps_val
            elif reps_val.upper() == 'AMRAP':
                reps = 'AMRAP'
            elif reps_val.upper() == 'ALAP':
                reps = 'ALAP'
        
        # Try to find notes (usually column 4)
        notes = None
        if len(row) > 3 and row[3]:
            notes_text = row[3].strip()
            if notes_text and len(notes_text) > 3:
                notes = notes_text
        
        # Clean up name - remove any leading numbers/bullets and trailing punctuation
        name = re.sub(r'^[\d\.\)\-\s]+', '', name).strip()
        name = re.sub(r'[:\-\*\.]+$', '', name).strip()  # Remove trailing punctuation
        
        # Title case the name
        name = self._title_case_exercise(name)
        
        if len(name) < 3:
            return None
        
        return {
            "name": name,
            "order": order,
            "sets": sets,
            "reps": reps,
            "weight_recommendation": None,
            "notes": notes
        }
    
    def _title_case_exercise(self, name: str) -> str:
        """Convert exercise name to title case, handling special cases."""
        # Split by spaces
        words = name.split()
        result = []
        
        lowercase_words = ['of', 'the', 'to', 'a', 'an', 'and', 'or', 'for', 'with']
        
        for i, word in enumerate(words):
            # First word always capitalized
            if i == 0:
                result.append(word.capitalize())
            elif word.lower() in lowercase_words:
                result.append(word.lower())
            else:
                result.append(word.capitalize())
        
        return ' '.join(result)
    
    def _extract_muscle_groups(self, text: str) -> Optional[str]:
        """Extract muscle groups from text."""
        found = []
        text_lower = text.lower()
        
        for mg in self.muscle_groups:
            if mg in text_lower:
                found.append(mg.title())
        
        return ', '.join(found) if found else None
    
    def _parse_workout_text(self, text: str) -> Dict[str, Any]:
        """Parse extracted text into structured workout data (fallback)."""
        lines = text.split('\n')
        lines = [line.strip() for line in lines if line.strip()]
        
        result = {
            "name": self._extract_plan_name(lines),
            "workout_days": []
        }
        
        # Try to find day separators
        day_sections = self._split_into_days(lines)
        
        for day_num, day_lines in enumerate(day_sections, 1):
            workout_day = self._parse_day(day_lines, day_num)
            if workout_day["circuits"]:
                result["workout_days"].append(workout_day)
        
        # If no days found, treat entire content as one day
        if not result["workout_days"]:
            workout_day = self._parse_day(lines, 1)
            if workout_day["circuits"]:
                result["workout_days"].append(workout_day)
        
        return result
    
    def _extract_plan_name(self, lines: List[str]) -> str:
        """Extract the workout plan name from the first few lines."""
        for line in lines[:10]:
            # Look for program name patterns
            if any(keyword in line.lower() for keyword in ['program', 'training', 'week', 'workout']):
                clean = re.sub(r'[^\w\s&\-]', '', line).strip()
                if clean and 10 < len(clean) < 100:
                    return clean
        
        for line in lines[:5]:
            if len(line) > 5 and not line.startswith(('•', '-', '*', '1', '2', '3')):
                clean = re.sub(r'[^\w\s&\-]', '', line).strip()
                if clean and len(clean) < 100:
                    return clean
        
        return "Imported Workout Plan"
    
    def _split_into_days(self, lines: List[str]) -> List[List[str]]:
        """Split lines into separate workout days."""
        day_patterns = [
            r'week\s*\d+.*day\s*\d+',
            r'day\s*\d+',
            r'workout\s*\d+',
            r'session\s*\d+'
        ]
        
        day_indices = [0]
        for i, line in enumerate(lines):
            line_lower = line.lower()
            for pattern in day_patterns:
                if re.search(pattern, line_lower) and i > 0:
                    if len(line) < 80:  # Header lines are usually short
                        day_indices.append(i)
                        break
        
        day_indices = sorted(set(day_indices))
        
        sections = []
        for i, start_idx in enumerate(day_indices):
            end_idx = day_indices[i + 1] if i + 1 < len(day_indices) else len(lines)
            section = lines[start_idx:end_idx]
            if section:
                sections.append(section)
        
        return sections if sections else [lines]
    
    def _parse_day(self, lines: List[str], day_num: int) -> Dict[str, Any]:
        """Parse a single workout day."""
        day_name = f"Day {day_num}"
        muscle_groups = []
        
        for line in lines[:5]:
            line_lower = line.lower()
            for mg in self.muscle_groups:
                if mg in line_lower and mg.title() not in muscle_groups:
                    muscle_groups.append(mg.title())
            
            day_match = re.search(r'(week\s*\d+.*day\s*\d+|day\s*\d+)', line_lower)
            if day_match:
                day_name = line.strip()
                if len(day_name) > 50:
                    day_name = day_match.group(1).title()
        
        if muscle_groups and "Day" in day_name and "-" not in day_name and ":" not in day_name:
            day_name += f" - {', '.join(muscle_groups)}"
        
        circuits = self._parse_circuits(lines)
        
        return {
            "name": day_name,
            "day_number": day_num,
            "muscle_groups": ", ".join(muscle_groups) if muscle_groups else None,
            "circuits": circuits
        }
    
    def _parse_circuits(self, lines: List[str]) -> List[Dict[str, Any]]:
        """Parse circuits from day lines."""
        circuits = []
        current_exercises = []
        circuit_num = 1
        
        for line in lines:
            line_lower = line.lower()
            
            # Skip note lines
            skip = False
            for pattern in self.skip_patterns:
                if re.search(pattern, line_lower):
                    skip = True
                    break
            if skip:
                continue
            
            # Check for circuit header
            circuit_match = re.search(r'circuit\s*(\d+)', line_lower)
            superset_match = re.search(r'superset\s*(\d+)?', line_lower)
            
            if circuit_match or superset_match:
                if current_exercises:
                    circuits.append({
                        "circuit_number": circuit_num,
                        "name": f"Circuit {circuit_num}",
                        "rounds": self._extract_rounds(line),
                        "exercises": current_exercises
                    })
                    circuit_num += 1
                    current_exercises = []
                continue
            
            # Try to parse as exercise
            exercise = self._parse_exercise_line(line, len(current_exercises) + 1)
            if exercise:
                current_exercises.append(exercise)
        
        if current_exercises:
            circuits.append({
                "circuit_number": circuit_num,
                "name": f"Circuit {circuit_num}",
                "rounds": 3,
                "exercises": current_exercises
            })
        
        return circuits
    
    def _parse_exercise_line(self, line: str, order: int) -> Optional[Dict[str, Any]]:
        """Parse a single line as an exercise."""
        line_lower = line.lower()
        
        # Skip note lines
        for pattern in self.skip_patterns:
            if re.search(pattern, line_lower):
                return None
        
        # Check if line contains exercise keywords
        is_exercise = any(ex in line_lower for ex in self.common_exercises)
        
        # Also check for common patterns
        has_sets_reps = bool(re.search(r'\d+\s*[xX×]\s*\d+|\d+\s*reps?|\d+\s*sets?', line))
        
        if not is_exercise and not has_sets_reps:
            return None
        
        # Skip if line is too long (probably a paragraph/note)
        if len(line) > 100:
            return None
        
        # Extract exercise name
        name_match = re.match(r'^[\d\.\)]*\s*(.+?)(?:\s*[-–:]\s*|\s+)(\d)', line, re.IGNORECASE)
        if name_match:
            name = name_match.group(1).strip()
        else:
            name_match = re.match(r'^[\d\.\)]*\s*([A-Za-z][A-Za-z\s\-&]+)', line)
            name = name_match.group(1).strip() if name_match else line[:50]
        
        name = re.sub(r'^[\d\.\)\-\s]+', '', name).strip()
        name = re.sub(r'[:\-\*\.]+$', '', name).strip()  # Remove trailing punctuation
        name = self._title_case_exercise(name)
        
        if len(name) < 3:
            return None
        
        sets, reps = self._extract_sets_reps(line)
        weight = self._extract_weight(line)
        
        return {
            "name": name,
            "order": order,
            "sets": sets,
            "reps": reps,
            "weight_recommendation": weight,
            "notes": None
        }
    
    def _extract_sets_reps(self, line: str) -> tuple:
        """Extract sets and reps from a line."""
        sets = "3"
        reps = "10-12"
        
        match = re.search(r'(\d+)\s*[xX×]\s*(\d+(?:\s*[-,]\s*\d+)*)', line)
        if match:
            sets = match.group(1)
            reps = match.group(2).replace(' ', '')
            return sets, reps
        
        sets_match = re.search(r'(\d+)\s*sets?', line, re.IGNORECASE)
        reps_match = re.search(r'(\d+(?:\s*[-,]\s*\d+)*)\s*reps?', line, re.IGNORECASE)
        
        if sets_match:
            sets = sets_match.group(1)
        if reps_match:
            reps = reps_match.group(1).replace(' ', '')
        
        pyramid_match = re.search(r'(\d+)\s*,\s*(\d+)\s*,\s*(\d+)', line)
        if pyramid_match:
            reps = f"{pyramid_match.group(1)}, {pyramid_match.group(2)}, {pyramid_match.group(3)}"
        
        return sets, reps
    
    def _extract_weight(self, line: str) -> Optional[str]:
        """Extract weight recommendation from a line."""
        weight_match = re.search(
            r'(\d+(?:\s*[-–]\s*\d+)?)\s*(lbs?|kg|pounds?|kilos?)',
            line, re.IGNORECASE
        )
        if weight_match:
            return f"{weight_match.group(1)} {weight_match.group(2)}"
        return None
    
    def _extract_rounds(self, line: str) -> int:
        """Extract number of rounds from a line."""
        match = re.search(r'(\d+)\s*rounds?', line, re.IGNORECASE)
        if match:
            return int(match.group(1))
        return 3
