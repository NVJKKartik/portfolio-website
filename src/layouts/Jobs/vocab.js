import React from 'react';
// import ArrowIcon from "../../../Icons/ArrowIcon";
import { getTasksTextWithHighlightedKeyword } from 'layouts/Jobs/taskAndType';
import styles from './IITB.module.css'; // Importing the module

export default function Vocab() {
  const tasks = [
    {
      text: '• Developed RESTful APIs to automate data processing and analytics, increasing user engagement by 10%.',
      keywords: ['Alchemy', 'Wagmi', 'Web3.js', 'Moralis', 'Ethers.js'],
    },
    {
      text: '• Developed Speaker Diarization and Voice Emotion Recognition models (81% accuracy) and a user-friendly ReactJS web application for model access.',
      keywords: ['quality', 'testing tasks', 'user base'],
    },
    {
      text: '• Fine-tuned Large Language Models (LLMs) such as Meta LLaMA 2 and OpenAI GPT-3.5 Turbo for sentiment analysis, topic modeling, and conversation scoring.',
      keywords: ['quality', 'testing tasks', 'user base'],
    },
    {
      text: '• Integrated an automated QA system into customer service workflows for real-time monitoring and analytics.',
      keywords: ['quality', 'testing tasks', 'user base'],
    },
  ];

  return (
    <>
      <div className={styles.container}>
        <div className={styles.titleContainer}>
          {/* Title */}
          <span className={styles.title}>
          Full Stack Developer Intern <span className={styles.company}>- Vocab.Ai</span>
          </span>
          {/* Date */}
          <span className={styles.date}>Aug 2023 - May 2024</span>
        </div>
        <div className={styles.taskList}>
          {/* Tasks Description 1 */}
          {tasks.map((item, index) => {
            return (
              <div key={index} className={styles.taskItem}>
                {/* <ArrowIcon className={" h-5 w-4 text-AAsecondary flex-none"} /> */}
                <span
                  className={styles.taskText}
                  dangerouslySetInnerHTML={{
                    __html: getTasksTextWithHighlightedKeyword(item.text, item.keywords),
                  }}
                ></span>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
