import React from 'react';
// import ArrowIcon from "../../../Icons/ArrowIcon";
import { getTasksTextWithHighlightedKeyword } from 'layouts/Jobs/taskAndType';
import styles from './IITB.module.css'; // Importing the module

export default function IITM() {
  const tasks = [
    {
      text: '• Employing advanced sentiment analysis with transformer-based models to enhance swing trading strategies in the Indian stock market.',
      keywords: ['Alchemy', 'Wagmi', 'Web3.js', 'Moralis', 'Ethers.js'],
    },
    {
      text: '• Integrating multimodal data (social media sentiment, financial news, technical indicators, and fundamental analysis) for a comprehensive stock prediction system.',
      keywords: ['quality', 'testing tasks', 'user base'],
    },
    {
      text: '• Investigating the impact of optimized time series prediction models and robust feature selection on swing trading prediction accuracy.',
      keywords: ['quality', 'testing tasks', 'user base'],
    },
    {
      text: '• Preliminary results indicate the multimodal approach may significantly improve accuracy and reliability of swing trading predictions compared to traditional methods.',      keywords: ['quality', 'testing tasks', 'user base'],
    },
  ];

  return (
    <>
      <div className={styles.container}>
        <div className={styles.titleContainer}>
          {/* Title */}
          <span className={styles.title}>
          Research Intern <span className={styles.company}>- Robert Bosch Centre for Data Science and AI (IIT Madras)</span>
          </span>
          {/* Date */}
          <span className={styles.date}>June 2024 - Present</span>
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
