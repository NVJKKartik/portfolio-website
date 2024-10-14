import React from 'react';
// import ArrowIcon from "../../../Icons/ArrowIcon";
import { getTasksTextWithHighlightedKeyword } from 'layouts/Jobs/taskAndType';
import styles from './IITB.module.css'; // Importing the module

export default function NITPY() {
    const tasks = [
      {
        text: '• Designed 77% more energy-efficient deep learning models for lung nodule classification and segmentation on the LIDC-IDRI dataset, achieving an 86% reduction in computational resource usage without compromising accuracy.',
        keywords: ['deep learning', 'lung nodule classification', 'LIDC-IDRI', 'energy efficiency'],
      },
      {
        text: '• Enhanced lung nodule analysis models through model pruning, quantization, and architectural optimizations, reducing memory and compute requirements by 95%, enabling real-time analysis and improving diagnostic efficiency.',
        keywords: ['model pruning', 'quantization', 'architectural optimization', 'real-time analysis'],
      },
    ];
  

  return (
    <>
      <div className={styles.container}>
        <div className={styles.titleContainer}>
          {/* Title */}
          <span className={styles.title}>
          MLOps Intern <span className={styles.company}>-Dept of CSE, NIT Puducherry</span>
          </span>
          {/* Date */}
          <span className={styles.date}>Dec 2023 - Jan 2024</span>
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
