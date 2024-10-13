import gamestackTexture2Placeholder from 'assets/gamestack-list-placeholder.jpg';

import gamestackTexturePlaceholder from 'assets/gamestack-login-placeholder.jpg';

import sliceTexturePlaceholder from 'assets/slice-app-placeholder.jpg';

import sprTexturePlaceholder from 'assets/spr-lesson-builder-dark-placeholder.jpg';

import hmsPreview from 'assets/pro1.jpg';
import cicd from 'assets/pro5.png';
import algoVE from 'assets/algo-ve-preview.png';
import blockchain from 'assets/pro2.jpg';
import algoVE2 from 'assets/algoVE2.png';
import stockDash from 'assets/pro4.jpg';
import stockDash2 from 'assets/pro3.jpg';
import { Footer } from 'components/Footer';
import { Meta } from 'components/Meta';
import { Intro } from 'layouts/Home/Intro';
import { Profile } from 'layouts/Home/Profile';
import { ProjectSummary } from 'layouts/Home/ProjectSummary';
import { Experience } from 'layouts/Home/Experience';
import { useEffect, useRef, useState } from 'react';
import styles from './Home.module.css';

const disciplines = ['AI Enthusiast', 'Learner','Designer','Programmer','Data Scientist'];

export const Home = () => {
  const [visibleSections, setVisibleSections] = useState([]);
  const [scrollIndicatorHidden, setScrollIndicatorHidden] = useState(false);
  const intro = useRef();
  const projectOne = useRef();
  const projectTwo = useRef();
  const projectThree = useRef();
  const projectFour = useRef();
  const details = useRef();
  

  useEffect(() => {
    const sections = [intro, projectOne, projectTwo, projectThree, projectFour, details];

    const sectionObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const section = entry.target;
            observer.unobserve(section);
            if (visibleSections.includes(section)) return;
            setVisibleSections(prevSections => [...prevSections, section]);
          }
        });
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.1 }
    );

    const indicatorObserver = new IntersectionObserver(
      ([entry]) => {
        setScrollIndicatorHidden(!entry.isIntersecting);
      },
      { rootMargin: '-100% 0px 0px 0px' }
    );

    sections.forEach(section => {
      sectionObserver.observe(section.current);
    });

    indicatorObserver.observe(intro.current);

    return () => {
      sectionObserver.disconnect();
      indicatorObserver.disconnect();
    };
  }, [visibleSections]);

  return (
    <div className={styles.home}>
      <Meta
        title="Designer + Developer"
        description="Design portfolio of NVJK Kartik — a product designer working on web & mobile
          apps with a focus on motion, experience design, and accessibility."
      />
      <Intro
        id="intro"
        sectionRef={intro}
        disciplines={disciplines}
        scrollIndicatorHidden={scrollIndicatorHidden}
      />
            <Profile
        sectionRef={details}
        visible={visibleSections.includes(details.current)}
        id="details"
      />
      <Experience 
      id="experience" />
      <ProjectSummary
        id="project-1"
        sectionRef={projectOne}
        visible={visibleSections.includes(projectOne.current)}
        index={1}
        title="Emotional Monitoring of Crypto Traders"
        description="Developed a cryptocurrency trading platform that monitors emotional well-being and provides personalized interventions to enhance user decision-making."
        buttonText="View project"
        buttonLink="https://github.com/hackfest-dev/HF24-Nexus"
        model={{
          type: 'laptop',
          alt: 'Displaying the home page of the website.',
          textures: [
            {
              srcSet: [hmsPreview, hmsPreview],
              placeholder: sprTexturePlaceholder,
            },
          ],
        }}
      />
      <ProjectSummary
        id="project-2"
        // alternate
        sectionRef={projectTwo}
        visible={visibleSections.includes(projectTwo.current)}
        index={2}
        title="Online Schooling for the Specially Abled"
        description="Developed an adaptive online learning platform for specially-abled students using computer vision, winning first place in a hackathon for building it in 48 hours."
        buttonText="Visit repository"
        buttonLink="https://github.com/PlatJack/DRS-Hackathon-2"
        model={{
          type: 'laptop',
          alt: 'landing page',
          textures: [
            {
              srcSet: [blockchain],
              placeholder: gamestackTexturePlaceholder,
            },
          ],
        }}
      />
      <ProjectSummary
        id="project-3"
        sectionRef={projectThree}
        visible={visibleSections.includes(projectThree.current)}
        index={3}
        title="Centio.Ai Conversational AI with Research and Task Automation"
        description="This is AI-driven platform that enables versatile chat interactions, task automation, and in-depth research capabilities. With features like Regular Chat, Assistant tasks, and document management, it streamlines workflows for enhanced productivity."
        buttonText="View project"
        buttonLink="https://github.com/VinayakRai5/Centio.AI"
        model={{
          type: 'laptop',
          alt: 'Visual description of the pipeline workflow',
          textures: [
            {
              srcSet: [cicd],
              placeholder: sliceTexturePlaceholder,
            },
          ],
        }}
      />
      <ProjectSummary
        id="project-4"
        alternate
        sectionRef={projectFour}
        visible={visibleSections.includes(projectFour.current)}
        index={4}
        title="Alumni Connect"
        description="Designed a Flutter app for CGC IIIT Dharwad that fosters alumni engagement, featuring social media-style image sharing, job postings, and job application capabilities."
        buttonText="View repository"
        buttonLink="https://github.com/NVJKKartik/Alumni_connect"
        model={{
          type: 'phone',
          alt: 'App login screen',
          textures: [
            {
              srcSet: [stockDash],
              placeholder: gamestackTexturePlaceholder,
            },
            {
              srcSet: [stockDash2],
              placeholder: gamestackTexture2Placeholder,
            },
          ],
        }}
      />
      <Footer />
    </div>
  );
};
