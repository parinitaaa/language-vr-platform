import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';

const API = 'http://localhost:5000/api';
const LEVELS = ['Beginner', 'Intermediate', 'Advanced'];
const LEVEL_CLS: Record<string, string> = {
  Beginner: 'bg-green-100 text-green-700',
  Intermediate: 'bg-yellow-100 text-yellow-700',
  Advanced: 'bg-red-100 text-red-700',
};

const confirm = (msg: string) => window.confirm(msg);

// ── Helpers ──────────────────────────────────────────────────────────────────

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
      {children}
    </div>
  );
}

const inp = 'w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400';
const btn = (col: string) => `text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors ${col}`;

// ── Quiz Builder ─────────────────────────────────────────────────────────────

interface QRow { _id?: string; question: string; options: [string,string,string,string]; correctAnswer: string; }
const emptyQ = (): QRow => ({ question: '', options: ['','','',''], correctAnswer: '' });
const LABELS = ['A','B','C','D'];

function QuizBuilder({ lessonId, lessonTitle, token, onClose }: {
  lessonId: string; lessonTitle: string; token: string; onClose: () => void;
}) {
  const [rows, setRows] = useState<QRow[]>([emptyQ()]);
  const [saving, setSaving] = useState(false);

  // Load existing questions
  useEffect(() => {
    axios.get(`${API}/quizzes/lesson/${lessonId}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => { if (r.data.length) setRows(r.data); })
      .catch(() => {});
  }, [lessonId]);

  const setQ = (i: number, patch: Partial<QRow>) =>
    setRows(prev => prev.map((r, idx) => idx === i ? { ...r, ...patch } : r));

  const setOpt = (qi: number, oi: number, val: string) => {
    setRows(prev => prev.map((r, i) => {
      if (i !== qi) return r;
      const opts = [...r.options] as [string,string,string,string];
      const wasCorrect = r.correctAnswer === r.options[oi];
      opts[oi] = val;
      return { ...r, options: opts, correctAnswer: wasCorrect ? val : r.correctAnswer };
    }));
  };

  const save = async () => {
    for (let i = 0; i < rows.length; i++) {
      const q = rows[i];
      if (!q.question.trim()) { toast.error(`Q${i+1}: question required`); return; }
      if (q.options.some(o => !o.trim())) { toast.error(`Q${i+1}: all 4 options required`); return; }
      if (!q.correctAnswer) { toast.error(`Q${i+1}: select correct answer`); return; }
    }
    setSaving(true);
    try {
      await axios.post(`${API}/quizzes/bulk`, { lessonId, questions: rows },
        { headers: { Authorization: `Bearer ${token}` } });
      toast.success('Quiz saved!');
      onClose();
    } catch (e: any) {
      toast.error(e.response?.data?.message || 'Failed to save quiz');
    } finally { setSaving(false); }
  };

  return (
    <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-5 space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-semibold text-amber-800 text-sm uppercase tracking-wide">Quiz Builder</h4>
          <p className="text-xs text-amber-600 mt-0.5">Lesson: <b>{lessonTitle}</b></p>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-lg">✕</button>
      </div>

      {rows.map((q, qi) => (
        <div key={qi} className="bg-white border border-amber-200 rounded-xl p-4 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-amber-700 uppercase">Question {qi+1}</span>
            {rows.length > 1 && (
              <button onClick={() => setRows(p => p.filter((_,i) => i !== qi))}
                className="text-xs text-red-500 hover:text-red-700 font-medium">Remove</button>
            )}
          </div>
          <input value={q.question} onChange={e => setQ(qi, { question: e.target.value })}
            placeholder="Question text…" className={inp} />
          <div className="space-y-2">
            <p className="text-xs text-gray-500">Options — click circle to mark correct</p>
            {q.options.map((opt, oi) => {
              const correct = q.correctAnswer === opt && opt.trim() !== '';
              return (
                <div key={oi} className="flex items-center gap-2">
                  <button type="button"
                    onClick={() => opt.trim() && setQ(qi, { correctAnswer: opt })}
                    className={`w-7 h-7 flex-shrink-0 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-colors ${correct ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-gray-300 text-gray-400 hover:border-amber-400'}`}>
                    {correct ? '✓' : LABELS[oi]}
                  </button>
                  <input value={opt} onChange={e => setOpt(qi, oi, e.target.value)}
                    placeholder={`Option ${LABELS[oi]}`}
                    className={`flex-1 px-3 py-1.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 ${correct ? 'border-emerald-400 bg-emerald-50' : 'border-gray-300'}`} />
                </div>
              );
            })}
          </div>
        </div>
      ))}

      <button onClick={() => setRows(p => [...p, emptyQ()])}
        className="w-full py-2 border-2 border-dashed border-amber-300 rounded-xl text-amber-600 text-sm font-medium hover:border-amber-500 hover:bg-amber-50 transition-colors">
        + Add Question
      </button>
      <button onClick={save} disabled={saving}
        className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors disabled:opacity-60">
        {saving ? 'Saving…' : `Save Quiz (${rows.length} question${rows.length>1?'s':''})`}
      </button>
    </div>
  );
}

// ── Lesson Form (create / edit) ───────────────────────────────────────────────

interface LessonData { _id?: string; title: string; content: string; videoUrl: string; thumbnailUrl: string; level: string; }

function LessonForm({ courseId, token, existing, onDone, onCancel }: {
  courseId: string; token: string; existing?: LessonData;
  onDone: (lesson: any) => void; onCancel: () => void;
}) {
  const [f, setF] = useState<LessonData>(existing || { title:'', content:'', videoUrl:'', thumbnailUrl:'', level:'Beginner' });
  const [saving, setSaving] = useState(false);
  const editing = !!existing?._id;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = editing
        ? await axios.put(`${API}/lessons/${existing!._id}`, f, { headers: { Authorization: `Bearer ${token}` } })
        : await axios.post(`${API}/lessons`, { ...f, courseId }, { headers: { Authorization: `Bearer ${token}` } });
      toast.success(editing ? 'Lesson updated!' : 'Lesson created!');
      onDone(res.data);
    } catch (e: any) {
      toast.error(e.response?.data?.message || 'Failed');
    } finally { setSaving(false); }
  };

  return (
    <form onSubmit={submit} className="mt-4 bg-indigo-50 border border-indigo-100 rounded-xl p-5 space-y-4">
      <h4 className="font-semibold text-indigo-800 text-sm uppercase tracking-wide">
        {editing ? 'Edit Lesson' : 'New Lesson'}
      </h4>
      <Field label="Lesson Title *">
        <input required value={f.title} onChange={e => setF({...f, title: e.target.value})} className={inp} placeholder="e.g. Greetings in Spanish" />
      </Field>
      <Field label="Content *">
        <textarea required rows={4} value={f.content} onChange={e => setF({...f, content: e.target.value})}
          className={inp + ' resize-none'} placeholder="Lesson content…" />
      </Field>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Video URL (YouTube / Vimeo)">
          <input type="url" value={f.videoUrl} onChange={e => setF({...f, videoUrl: e.target.value})} className={inp} placeholder="https://youtube.com/watch?v=…" />
        </Field>
        <Field label="Thumbnail URL">
          <input type="url" value={f.thumbnailUrl} onChange={e => setF({...f, thumbnailUrl: e.target.value})} className={inp} placeholder="https://…/image.jpg" />
        </Field>
      </div>
      {f.thumbnailUrl && (
        <div className="rounded-lg overflow-hidden border border-gray-200 h-28">
          <img src={f.thumbnailUrl} alt="preview" className="w-full h-full object-cover"
            onError={e => { (e.target as HTMLImageElement).style.display='none'; }} />
        </div>
      )}
      <Field label="Level">
        <select value={f.level} onChange={e => setF({...f, level: e.target.value})} className={inp}>
          {LEVELS.map(l => <option key={l}>{l}</option>)}
        </select>
      </Field>
      <div className="flex gap-3">
        <button type="submit" disabled={saving}
          className="flex-1 bg-indigo-600 text-white text-sm font-medium py-2 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-60">
          {saving ? 'Saving…' : (editing ? 'Update Lesson' : 'Save Lesson')}
        </button>
        <button type="button" onClick={onCancel}
          className="flex-1 bg-white text-gray-600 text-sm font-medium py-2 rounded-lg border border-gray-300 hover:bg-gray-50">
          Cancel
        </button>
      </div>
    </form>
  );
}

// ── Course Card ───────────────────────────────────────────────────────────────

interface Course { _id: string; title: string; language: string; level: string; description: string; }
interface Lesson  { _id: string; title: string; level: string; thumbnailUrl?: string; content: string; videoUrl: string; }

function CourseCard({ course, token, onDeleted, onUpdated }: {
  course: Course; token: string;
  onDeleted: (id: string) => void;
  onUpdated: (c: Course) => void;
}) {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [expanded, setExpanded] = useState(false);
  const [loadingLessons, setLoadingLessons] = useState(false);

  // Course editing
  const [editingCourse, setEditingCourse] = useState(false);
  const [cf, setCf] = useState({ title: course.title, language: course.language, level: course.level, description: course.description });

  // Lesson UI state
  const [showLessonForm, setShowLessonForm] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [quizLessonId, setQuizLessonId] = useState<string | null>(null);
  const [quizLessonTitle, setQuizLessonTitle] = useState('');

  const fetchLessons = async () => {
    setLoadingLessons(true);
    try {
      const r = await axios.get(`${API}/lessons/course/${course._id}`, { headers: { Authorization: `Bearer ${token}` } });
      setLessons(r.data);
    } catch {} finally { setLoadingLessons(false); }
  };

  const toggle = () => {
    if (!expanded) fetchLessons();
    setExpanded(v => !v);
    setShowLessonForm(false);
    setEditingLesson(null);
    setQuizLessonId(null);
  };

  const saveCourse = async () => {
    try {
      const r = await axios.put(`${API}/courses/${course._id}`, cf, { headers: { Authorization: `Bearer ${token}` } });
      toast.success('Course updated!');
      onUpdated(r.data);
      setEditingCourse(false);
    } catch (e: any) { toast.error(e.response?.data?.message || 'Failed'); }
  };

  const deleteCourse = async () => {
    if (!confirm(`Delete "${course.title}" and ALL its lessons & quizzes? This cannot be undone.`)) return;
    try {
      await axios.delete(`${API}/courses/${course._id}`, { headers: { Authorization: `Bearer ${token}` } });
      toast.success('Course deleted');
      onDeleted(course._id);
    } catch (e: any) { toast.error(e.response?.data?.message || 'Failed'); }
  };

  const deleteLesson = async (lesson: Lesson) => {
    if (!confirm(`Delete lesson "${lesson.title}" and its quiz?`)) return;
    try {
      await axios.delete(`${API}/lessons/${lesson._id}`, { headers: { Authorization: `Bearer ${token}` } });
      toast.success('Lesson deleted');
      setLessons(p => p.filter(l => l._id !== lesson._id));
      if (quizLessonId === lesson._id) setQuizLessonId(null);
    } catch (e: any) { toast.error(e.response?.data?.message || 'Failed'); }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Course header */}
      <div className="px-6 py-4">
        {editingCourse ? (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div><label className="text-xs text-gray-500 mb-1 block">Title</label>
                <input value={cf.title} onChange={e => setCf({...cf, title: e.target.value})} className={inp} /></div>
              <div><label className="text-xs text-gray-500 mb-1 block">Language</label>
                <input value={cf.language} onChange={e => setCf({...cf, language: e.target.value})} className={inp} /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="text-xs text-gray-500 mb-1 block">Level</label>
                <select value={cf.level} onChange={e => setCf({...cf, level: e.target.value})} className={inp}>
                  {LEVELS.map(l => <option key={l}>{l}</option>)}
                </select></div>
              <div><label className="text-xs text-gray-500 mb-1 block">Description</label>
                <input value={cf.description} onChange={e => setCf({...cf, description: e.target.value})} className={inp} /></div>
            </div>
            <div className="flex gap-2">
              <button onClick={saveCourse} className="flex-1 bg-indigo-600 text-white text-sm py-2 rounded-lg hover:bg-indigo-700 font-medium">Save</button>
              <button onClick={() => setEditingCourse(false)} className="flex-1 bg-white border border-gray-300 text-sm py-2 rounded-lg text-gray-600 hover:bg-gray-50">Cancel</button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-gray-900 truncate">{course.title}</h3>
              <p className="text-sm text-gray-500 mt-0.5">{course.language}</p>
            </div>
            <div className="flex items-center gap-2 ml-4 flex-shrink-0">
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${LEVEL_CLS[course.level]||'bg-gray-100 text-gray-600'}`}>{course.level}</span>
              <button onClick={() => setEditingCourse(true)} className={btn('border-indigo-200 text-indigo-600 hover:bg-indigo-50')}>Edit</button>
              <button onClick={deleteCourse} className={btn('border-red-200 text-red-500 hover:bg-red-50')}>Delete</button>
              <button onClick={toggle} className="text-indigo-600 text-sm font-medium hover:underline whitespace-nowrap">
                {expanded ? 'Collapse ▲' : 'Manage ▼'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Expanded panel */}
      {expanded && (
        <div className="border-t border-gray-100 px-6 pb-6 pt-4 space-y-3 bg-gray-50">
          {loadingLessons ? (
            <p className="text-sm text-gray-400">Loading lessons…</p>
          ) : lessons.length > 0 ? (
            <>
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Lessons</h4>
              {lessons.map(lesson => (
                <div key={lesson._id}>
                  <div className="bg-white border border-gray-200 rounded-xl px-4 py-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      {lesson.thumbnailUrl && (
                        <img src={lesson.thumbnailUrl} alt="" className="w-10 h-10 rounded-lg object-cover flex-shrink-0 border border-gray-100" />
                      )}
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">{lesson.title}</p>
                        <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${LEVEL_CLS[lesson.level]||'bg-gray-100 text-gray-600'}`}>{lesson.level}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button onClick={() => { setEditingLesson(lesson); setShowLessonForm(false); setQuizLessonId(null); }}
                        className={btn('border-indigo-200 text-indigo-600 hover:bg-indigo-50')}>Edit</button>
                      <button onClick={() => {
                        if (quizLessonId === lesson._id) { setQuizLessonId(null); }
                        else { setQuizLessonId(lesson._id); setQuizLessonTitle(lesson.title); setEditingLesson(null); setShowLessonForm(false); }
                      }} className={btn(quizLessonId === lesson._id ? 'bg-amber-500 text-white border-amber-500' : 'border-amber-400 text-amber-600 hover:bg-amber-50')}>
                        {quizLessonId === lesson._id ? 'Close Quiz' : 'Add Quiz'}
                      </button>
                      <button onClick={() => deleteLesson(lesson)} className={btn('border-red-200 text-red-500 hover:bg-red-50')}>Delete</button>
                    </div>
                  </div>

                  {/* Inline lesson edit form */}
                  {editingLesson?._id === lesson._id && (
                    <LessonForm courseId={course._id} token={token} existing={editingLesson}
                      onDone={updated => { setLessons(p => p.map(l => l._id===updated._id ? updated : l)); setEditingLesson(null); }}
                      onCancel={() => setEditingLesson(null)} />
                  )}

                  {/* Quiz builder */}
                  {quizLessonId === lesson._id && (
                    <QuizBuilder lessonId={lesson._id} lessonTitle={quizLessonTitle} token={token} onClose={() => setQuizLessonId(null)} />
                  )}
                </div>
              ))}
            </>
          ) : (
            <p className="text-sm text-gray-400 italic">No lessons yet.</p>
          )}

          {/* New lesson form */}
          {showLessonForm ? (
            <LessonForm courseId={course._id} token={token}
              onDone={l => { setLessons(p => [...p, l]); setShowLessonForm(false); }}
              onCancel={() => setShowLessonForm(false)} />
          ) : (
            <button onClick={() => { setShowLessonForm(true); setEditingLesson(null); setQuizLessonId(null); }}
              className="flex items-center gap-2 text-indigo-600 font-medium text-sm border-2 border-dashed border-indigo-200 w-full py-2.5 rounded-xl justify-center hover:bg-indigo-50 hover:border-indigo-400 transition-colors">
              <span className="text-lg leading-none">+</span> Add Lesson
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ── Main Admin Page ───────────────────────────────────────────────────────────

const Admin = () => {
  const { token } = useContext(AuthContext);
  const [courses, setCourses] = useState<Course[]>([]);
  const [title, setTitle] = useState('');
  const [language, setLanguage] = useState('');
  const [level, setLevel] = useState('Beginner');
  const [description, setDescription] = useState('');

  useEffect(() => { fetchCourses(); }, []);

  const fetchCourses = async () => {
    try { const r = await axios.get(`${API}/courses`); setCourses(r.data); }
    catch { toast.error('Failed to load courses'); }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const r = await axios.post(`${API}/courses`, { title, language, level, description },
        { headers: { Authorization: `Bearer ${token}` } });
      toast.success('Course created!');
      setCourses(p => [...p, r.data]);
      setTitle(''); setLanguage(''); setLevel('Beginner'); setDescription('');
    } catch (e: any) { toast.error(e.response?.data?.message || 'Failed'); }
  };

  return (
    <div className="max-w-6xl mx-auto py-12 px-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-1">Admin Dashboard</h1>
      <p className="text-gray-500 mb-10">Manage courses, lessons, and quizzes.</p>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        {/* Create Course sidebar */}
        <div className="lg:col-span-2">
          <div className="bg-white p-7 rounded-2xl shadow-sm border border-gray-100 sticky top-6">
            <h2 className="text-lg font-bold text-gray-900 mb-5">Create New Course</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <Field label="Title *">
                <input required value={title} onChange={e => setTitle(e.target.value)} className={inp} placeholder="Spanish for Beginners" />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Language *">
                  <input required value={language} onChange={e => setLanguage(e.target.value)} className={inp} placeholder="Spanish" />
                </Field>
                <Field label="Level">
                  <select value={level} onChange={e => setLevel(e.target.value)} className={inp}>
                    {LEVELS.map(l => <option key={l}>{l}</option>)}
                  </select>
                </Field>
              </div>
              <Field label="Description *">
                <textarea required rows={3} value={description} onChange={e => setDescription(e.target.value)}
                  className={inp + ' resize-none'} placeholder="Short description…" />
              </Field>
              <button type="submit"
                className="w-full bg-indigo-600 text-white font-semibold py-2.5 rounded-xl hover:bg-indigo-700 transition-colors shadow-sm text-sm">
                Create Course
              </button>
            </form>
          </div>
        </div>

        {/* Course list */}
        <div className="lg:col-span-3 space-y-4">
          <h2 className="text-lg font-bold text-gray-900">
            Manage Courses <span className="text-sm font-normal text-gray-400">({courses.length})</span>
          </h2>
          {courses.length === 0 ? (
            <div className="bg-white p-8 rounded-2xl border border-dashed border-gray-200 text-center text-gray-400 text-sm">
              No courses yet. Create one to get started.
            </div>
          ) : courses.map(c => (
            <CourseCard key={c._id} course={c} token={token}
              onDeleted={id => setCourses(p => p.filter(x => x._id !== id))}
              onUpdated={updated => setCourses(p => p.map(x => x._id===updated._id ? updated : x))} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Admin;
