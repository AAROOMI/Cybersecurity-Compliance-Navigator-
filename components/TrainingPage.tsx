
import React, { useState } from 'react';
import type { TrainingCourse, UserTrainingProgress, Lesson } from '../types';
import { trainingCourses } from '../data/trainingData';
import { CourseDetailPage } from './CourseDetailPage';
import { LessonPlayer } from './LessonPlayer';

interface TrainingPageProps {
  userProgress: UserTrainingProgress;
  onUpdateProgress: (courseId: string, lessonId: string, score?: number) => void;
}

const CourseCard: React.FC<{ course: TrainingCourse; progress?: UserTrainingProgress[string] }> = ({ course, progress }) => {
    const totalLessons = course.lessons.length;
    const completedLessons = progress?.completedLessons.length || 0;
    const completion = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

    return (
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 p-6 flex flex-col h-full transition-transform hover:scale-105">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">{course.title}</h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 flex-grow">{course.description}</p>
            <div className="mt-4">
                <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                    <span>Progress ({completedLessons}/{totalLessons})</span>
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
    const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);

    const handleSelectCourse = (course: TrainingCourse) => {
        setActiveCourse(course);
    };

    const handleStartLesson = (lesson: Lesson) => {
        setActiveLesson(lesson);
    };

    const handleCompleteLesson = (courseId: string, lessonId: string, score?: number) => {
        onUpdateProgress(courseId, lessonId, score);
        setActiveLesson(null); // Close the lesson player
    };

    if (activeCourse) {
        return (
            <>
                <CourseDetailPage
                    course={activeCourse}
                    userProgress={userProgress[activeCourse.id]}
                    onBack={() => setActiveCourse(null)}
                    onStartLesson={handleStartLesson}
                />
                {activeLesson && (
                    <LessonPlayer
                        course={activeCourse}
                        lesson={activeLesson}
                        onClose={() => setActiveLesson(null)}
                        onCompleteLesson={handleCompleteLesson}
                    />
                )}
            </>
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
                    <button key={course.id} onClick={() => handleSelectCourse(course)} className="text-left focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 rounded-lg">
                        <CourseCard course={course} progress={userProgress[course.id]} />
                    </button>
                ))}
            </div>
            
        </div>
    );
};
