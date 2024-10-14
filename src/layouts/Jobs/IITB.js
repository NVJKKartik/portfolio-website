import React from 'react';
import { getTasksTextWithHighlightedKeyword } from 'layouts/Jobs/taskAndType';
import styles from './IITB.module.css'; // Importing the module

export default function IITB() {
  const tasks = [
    {
      text: '• Developed AffectBots: A scalable, multimodal tutoring system utilizing audio, video, and text data for real-time emotion recognition with 88% accuracy. ',
      keywords: ['PyTorch', 'TensorFlow', 'Emotion Recognition'],
    },
    {
      text: '• Implemented speaker diarization using PyAnnote and Whisper Speech Recognition, improving diarization performance by 65% on a 200-hour classroom dataset. (Paper Accepted at IEEE-TALE 2024).',
      keywords: ['PyAnnote', 'Whisper', 'Speaker Diarization'],
    },
    {
      text: '• Applied Conditional Random Fields (CRFs) and machine learning to detect triggers of Socially Shared Metacognitive Regulation (SSMR) in collaborative learning environments.',
      keywords: ['CRFs', 'Machine Learning', 'Collaborative Learning'],
    },
    {
      text: '• Developed automated analysis systems for large-scale collaborative learning datasets, with findings accepted for publication at EdTech Society T4E 2024.',
      keywords: ['Data Analysis', 'Collaborative Learning', 'EdTech'],
    },
  ];



  return (
    <div className={styles.container}>
      <div className={styles.titleContainer}>
        <span className={styles.title}>
        Research Associate <span className={styles.company}>- Dept of Educational Technology</span>
        </span>
        <span className={styles.date}>May 2023 - August 2024</span>
      </div>
      <div className={styles.taskList}>
        {tasks.map((item, index) => (
          <div key={index} className={styles.taskItem}>
            <span
              className={styles.taskText}
              dangerouslySetInnerHTML={{
                __html: getTasksTextWithHighlightedKeyword(item.text, item.keywords),
              }}
            ></span>
          </div>
        ))}
      </div>
    </div>
  );
}
