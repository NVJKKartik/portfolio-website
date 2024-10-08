import React from "react";
import { motion } from "framer-motion";
import IIITB from "layouts/Home/IIITB";
import NITPY from "layouts/Home/NITPY";
import styles from './Experience.module.css'; // Import the CSS module

export const Experience = () => {
  // Set IIITB as the default experience section
  const [DescriptionJob, setDescriptionJob] = React.useState("IIITB");

  const GetDescription = () => {
    switch (DescriptionJob) {
      case "IIITB":
        return <IIITB />;
      case "NITPY":
        return <NITPY />;
      default:
        return null;
    }
  };

  return (
    <div data-aos="fade-up" className={styles.container}>
      <section className={styles.titleSection}>
        <div className={styles.titleSection}>
          <span className={styles.titleNumber}></span>
        </div>
        <span className={styles.titleText}>Where I&apos;ve Worked</span>
        <div className={styles.divider}></div>
      </section>
      <section className={styles.experienceSection}>
        <CompaniesBar setDescriptionJob={setDescriptionJob} />
        <ul className={styles.experienceList}>
          <li>{GetDescription()}</li> {/* Bullet point for each experience */}
        </ul>
      </section>
    </div>
  );
};

const CompaniesBar = (props) => {
  // Set initial positions for the bar and selection
  const [barPosition, setBarPosition] = React.useState(-10);
  const [barAbovePosition, setBarAbovePosition] = React.useState(1);
  const [companyNameBackgroundColorGreen, setCompanyNameBackgroundColorGreen] = React.useState([true, false]);

  const CompanyButton = (props) => (
<button
    onClick={() => {
      setBarPosition(props.BarPosition);
      setBarAbovePosition(props.BarAvobePosition);
      props.setDescriptionJob(props.DescriptionJob);
      setCompanyNameBackgroundColorGreen(props.CompanyNameBackgroundColorGreen);
    }}
    className={`${styles.companyButton} ${
      companyNameBackgroundColorGreen[props.ButtonOrderOfcompanyNameBackgroundColorGreen] && styles.selectedCompanyButton
    }`}
  >
    {props.CompanyName}
  </button>
  );

  return (
    <div className={styles.barContainer}>
      <div className={styles.barWrapper}>
        <motion.div animate={{ y: barPosition }} className={styles.animatedBar}></motion.div>
      </div>
      <div className={`${styles.flexCol} ${styles.spaceY1} ${styles.paddingLeft8} ${styles.paddingLeft0Md}`}>
        <CompanyButton
          ButtonOrderOfcompanyNameBackgroundColorGreen={0}
          CompanyName="IIITB"
          BarPosition={-10}
          BarAvobePosition={1}
          DescriptionJob="IIITB"
          CompanyNameBackgroundColorGreen={[true,false]} // IIITB selected by default
          setDescriptionJob={props.setDescriptionJob}
        />
        <CompanyButton
          ButtonOrderOfcompanyNameBackgroundColorGreen={1} // NITPY not selected
          CompanyName="NITPY"
          BarPosition={40}
          BarAvobePosition={2}
          DescriptionJob="NITPY"
          CompanyNameBackgroundColorGreen={[false,true]} // NITPY unselected
          setDescriptionJob={props.setDescriptionJob}
        />
      </div>
      <div className={styles.horizontalBar}>
        <motion.div animate={{ x: barAbovePosition }} className={styles.animatedHorizontalBar}></motion.div>
      </div>
    </div>
  );
};