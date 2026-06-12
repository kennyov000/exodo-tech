export interface Course {
  slug:        string;
  title:       string;
  tagline:     string;
  level:       "Fundamentos" | "Intermedio" | "Avanzado";
  duration:    string;
  modules:     Module[];
}

export interface Module {
  id:      string;
  title:   string;
  content: string; // Markdown
}

export interface Student {
  id:              string;
  name:            string;
  currentCourse:   string;
  currentModule:   string;
  progress:        number; // 0–100
  pendingCount:    number;
}

export interface Assignment {
  id:          string;
  title:       string;
  courseSlug:  string;
  dueDate:     string;
  status:      "pending" | "submitted" | "graded";
}

export interface Submission {
  id:           string;
  assignmentId: string;
  fileUrl?:     string;
  text?:        string;
  submittedAt:  string;
}

export interface TeacherSubmission {
  id:           string;
  studentName:  string;
  assignmentTitle: string;
  courseTitle:  string;
  fileUrl?:     string;
  text?:        string;
  submittedAt:  string;
  status:       "pending" | "graded";
  grade?:       number;
  feedback?:    string;
}
