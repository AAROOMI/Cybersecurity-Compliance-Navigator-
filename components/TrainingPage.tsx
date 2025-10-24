import React, { useState } from 'react';
import type { TrainingCourse, UserTrainingProgress } from '../types';
import { trainingCourses } from '../data/trainingData';

interface TrainingPageProps {
  userProgress: UserTrainingProgress;
  onUpdateProgress: (courseId: string, lessonId: string, score?: number) => void;
}

const CourseCard: React.FC<{ course: TrainingCourse; progress?: UserTrainingProgress[string] }> = ({ course, progress }) => {
    const completion = progress ? (progress.completedLessons.length / course.lessons.length) * 100 : 0;

    return (
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 p-6 flex flex-col">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">{course.title}</h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 flex-grow">{course.description}</p>
            <div className="mt-4">
                <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                    <span>Progress</span>
                    <span>{completion.toFixed(0)}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mt-1">
                    <div className="bg-teal-600 h-2.5 rounded-full" style={{ width: `${completion}%` }}></div>
                </div>
            </div>
            {progress?.badgeEarned && (
                 <div className="mt-4 text-center py-1 px-2 bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 text-xs font-bold rounded-full">
                    Badge Earned!
                </div>
            )}
        </div>
    );
};

export const TrainingPage: React.FC<TrainingPageProps> = ({ userProgress, onUpdateProgress }) => {
    const [activeCourse, setActiveCourse] = useState<TrainingCourse | null>(null);
    const [activeLesson, setActiveLesson] = useState<{ courseId: string, lessonId: string } | null>(null);
    const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
    const [quizResult, setQuizResult] = useState<{ score: number, total: number } | null>(null);

    const handleSelectCourse = (course: TrainingCourse) => {
        setActiveCourse(course);
        setActiveLesson(null);
        setQuizResult(null);
        setQuizAnswers({});
    };

    const handleSelectLesson = (courseId: string, lessonId: string) => {
        setActiveLesson({ courseId, lessonId });
        setQuizResult(null);
        setQuizAnswers({});
    };

    const handleQuizSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const lesson = activeCourse?.lessons.find(l => l.id === activeLesson?.lessonId);
        if (!lesson?.quiz) return;

        let score = 0;
        lesson.quiz.questions.forEach((q, index) => {
            if (quizAnswers[index] === q.correctAnswer) {
                score++;
            }
        });

        const total = lesson.quiz.questions.length;
        setQuizResult({ score, total });
        
        // Update progress if quiz is passed (e.g., >50% score)
        if (score / total > 0.5) {
             onUpdateProgress(activeCourse!.id, lesson.id, score / total * 100);
        }
    };

    if (activeLesson) {
        const course = trainingCourses.find(c => c.id === activeLesson.courseId);
        const lesson = course?.lessons.find(l => l.id === activeLesson.lessonId);
        if (!course || !lesson) return null;

        const isLessonCompleted = userProgress[course.id]?.completedLessons.includes(lesson.id);

        return (
             <div className="space-y-6">
                 <button onClick={() => handleSelectCourse(course)} className="text-sm font-medium text-teal-600 dark:text-teal-400 hover:underline">&larr; Back to {course.title}</button>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{lesson.title}</h2>
                    <div className="mt-4 prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: lesson.content.replace(/\n/g, '<br/>') }} />
                </div>
                {lesson.quiz && (
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">{lesson.quiz.title}</h3>
                        {quizResult ? (
                            <div className="mt-4 text-center">
                                <p className="text-lg font-semibold">Your Score: {quizResult.score} / {quizResult.total}</p>
                                {quizResult.score/quizResult.total > 0.5 ? (
                                    <p className="text-green-600 dark:text-green-400">Great job, you passed!</p>
                                ): (
                                    <p className="text-red-600 dark:text-red-400">Try again to improve your score.</p>
                                )}
                            </div>
                        ) : (
                            <form onSubmit={handleQuizSubmit} className="mt-4 space-y-6">
                                {lesson.quiz.questions.map((q, qIndex) => (
                                    <fieldset key={qIndex}>
                                        <legend className="text-md font-medium text-gray-900 dark:text-gray-200">{q.question}</legend>
                                        <div className="mt-2 space-y-2">
                                            {q.options.map((option, oIndex) => (
                                                <div key={oIndex} className="flex items-center">
                                                    <input id={`${qIndex}-${oIndex}`} type="radio" name={`question-${qIndex}`} required onChange={() => setQuizAnswers({...quizAnswers, [qIndex]: oIndex})} className="h-4 w-4 text-teal-600 border-gray-300 dark:border-gray-600 focus:ring-teal-500" />
                                                    <label htmlFor={`${qIndex}-${oIndex}`} className="ml-3 block text-sm text-gray-700 dark:text-gray-300">{option}</label>
                                                </div>
                                            ))}
                                        </div>
                                    </fieldset>
                                ))}
                                <button type="submit" disabled={isLessonCompleted} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 disabled:bg-gray-400">
                                    {isLessonCompleted ? 'Completed' : 'Submit Quiz'}
                                </button>
                            </form>
                        )}
                    </div>
                )}
            </div>
        );
    }

    if (activeCourse) {
        return (
            <div className="space-y-6">
                <button onClick={() => setActiveCourse(null)} className="text-sm font-medium text-teal-600 dark:text-teal-400 hover:underline">&larr; Back to All Courses</button>
                <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">{activeCourse.title}</h1>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                     <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Lessons</h2>
                     <ul className="space-y-2">
                        {activeCourse.lessons.map(lesson => (
                            <li key={lesson.id}>
                                <button onClick={() => handleSelectLesson(activeCourse.id, lesson.id)} className="w-full text-left p-3 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700/50 flex justify-between items-center">
                                    <span>{lesson.title}</span>
                                    {userProgress[activeCourse.id]?.completedLessons.includes(lesson.id) && <span className="text-xs font-bold text-green-600">COMPLETED</span>}
                                </button>
                            </li>
                        ))}
                     </ul>
                </div>
            </div>
        );
    }
    
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 tracking-tight">Training & Awareness</h1>
                <p className="mt-2 text-lg text-gray-500 dark:text-gray-400">Enhance your cybersecurity knowledge with our interactive courses.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {trainingCourses.map(course => (
                    <button key={course.id} onClick={() => handleSelectCourse(course)} className="text-left">
                        <CourseCard course={course} progress={userProgress[course.id]} />
                    </button>
                ))}
            </div>
        </div>
    );
};