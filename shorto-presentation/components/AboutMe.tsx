import React, { useEffect, useRef, useState } from 'react';
import { ArrowDown, Music, Mountain, Heart, Briefcase, GraduationCap, Sparkles, Video } from 'lucide-react';

// Import images
import introImg from '../pic/intro.jpg';
import familyImg from '../pic/my family.jpg';
import smealShieldImg from '../pic/SmealShield.webp';
import cornellImg from '../pic/cornell.png';
import northeasternImg from '../pic/northeastern.png';
import goldmanImg from '../pic/goldman.jpg';
import mossadamsImg from '../pic/mossadams.jpg';
import hackathonImg from '../pic/hackathon.jpg';
import cofoundImg from '../pic/cofoundstartup.jpg';
import wiwynn from '../pic/Wiwynn.jpg';
import wiwynn1 from '../pic/Wiwynn1.jpg';
import bravomeal from '../pic/bravoMeal.png';
import volunteerImg from '../pic/volunteer.jpg';
import volunteer2Img from '../pic/volunteer2.jpg';
import concertImg from '../pic/concert.jpg';
import concert1Img from '../pic/concert1.jpg';
import snowboardImg from '../pic/snowboard.jpg';
import snowboard1Img from '../pic/snowboard1.jpg';
import influencerImg from '../pic/influncer.jpg';

interface TimelineItemProps {
  year: string;
  title: string;
  description: React.ReactNode;
  images: string[];
  icon: React.ReactNode;
  isLogo?: boolean;
  align?: 'left' | 'right';
}

const TimelineItem: React.FC<TimelineItemProps> = ({ year, title, description, images, icon, isLogo, align = 'left' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  // Two images layout: one left, one right
  if (images.length === 2) {
    return (
      <div
        ref={ref}
        className={`flex flex-col items-center mb-24 transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        {/* Images row */}
        <div className="flex items-center gap-8 w-full justify-center">
          {/* Left image */}
          <div className={`${isLogo ? 'w-48 h-48 bg-white p-6' : 'w-96 h-72'} rounded-2xl shadow-xl overflow-hidden transform hover:scale-105 transition-transform duration-300`}>
            <img src={images[0]} alt={title} className={`w-full h-full ${isLogo ? 'object-contain' : 'object-cover'}`} />
          </div>

          {/* Timeline dot + content */}
          <div className="flex flex-col items-center z-10 text-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg">
              {icon}
            </div>
            <div className="text-sm font-bold text-indigo-600 mt-2">{year}</div>
            <h3 className="text-2xl font-bold text-slate-800 mt-4 mb-2">{title}</h3>
            <p className="text-lg text-slate-600 leading-relaxed max-w-xs">{description}</p>
          </div>

          {/* Right image */}
          <div className={`${isLogo ? 'w-48 h-48 bg-white p-6' : 'w-96 h-72'} rounded-2xl shadow-xl overflow-hidden transform hover:scale-105 transition-transform duration-300`}>
            <img src={images[1]} alt={title} className={`w-full h-full ${isLogo ? 'object-contain' : 'object-cover'}`} />
          </div>
        </div>
      </div>
    );
  }

  // Single image layout
  return (
    <div
      ref={ref}
      className={`flex items-center gap-8 mb-24 transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      } ${align === 'right' ? 'flex-row-reverse' : ''}`}
    >
      {/* Images */}
      <div className={`flex-1 ${align === 'right' ? 'pl-8' : 'pr-8'}`}>
        <div className={`flex gap-4 ${align === 'right' ? 'justify-start' : 'justify-end'} ${isLogo ? 'items-center' : ''}`}>
          {images.map((img, idx) => (
            <div
              key={idx}
              className={`${isLogo ? 'w-48 h-48 bg-white p-6' : 'w-96 h-72'} rounded-2xl shadow-xl overflow-hidden transform hover:scale-105 transition-transform duration-300`}
              style={{ transitionDelay: `${idx * 100}ms` }}
            >
              <img
                src={img}
                alt={title}
                className={`w-full h-full ${isLogo ? 'object-contain' : 'object-cover'}`}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Timeline dot */}
      <div className="flex flex-col items-center z-10">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg">
          {icon}
        </div>
        <div className="text-sm font-bold text-indigo-600 mt-2">{year}</div>
      </div>

      {/* Content */}
      <div className={`flex-1 ${align === 'right' ? 'pr-8 text-right' : 'pl-8'}`}>
        <h3 className="text-2xl font-bold text-slate-800 mb-2">{title}</h3>
        <p className="text-lg text-slate-600 leading-relaxed">{description}</p>
      </div>
    </div>
  );
};

export const AboutMe: React.FC = () => {
  return (
    <div className="bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section - Introduction */}
      <header className="min-h-screen flex flex-col justify-center items-center text-center px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>

        <div className="relative z-10 max-w-4xl mx-auto space-y-8">
          {/* Profile Photo */}
          <div className="w-72 h-72 mx-auto rounded-full overflow-hidden shadow-2xl border-4 border-white">
            <img src={introImg} alt="Giana" className="w-full h-full object-cover" />
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
            <span className="text-slate-800">Hi </span>
            <span className="text-[#0077C5]">Intuit</span>
            <span className="text-slate-800">, I'm </span>
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Giana</span>
          </h1>

          <div className="flex justify-center gap-4">
            <span className="px-5 py-2 bg-indigo-50 border border-indigo-200 rounded-full text-lg text-indigo-600 font-medium">
              26 yrs
            </span>
            <span className="px-5 py-2 bg-indigo-50 border border-indigo-200 rounded-full text-lg text-indigo-600 font-medium">
              GPA 4.0
            </span>
            <span className="px-5 py-2 bg-indigo-50 border border-indigo-200 rounded-full text-lg text-indigo-600 font-medium">
              Full Scholarship
            </span>
          </div>
        </div>

        <div className="absolute bottom-10 flex flex-col items-center animate-bounce text-indigo-400">
          <span className="text-2xl md:text-3xl font-semibold text-slate-600 mb-2">Let's get Intuit it</span>
          <ArrowDown size={32} />
        </div>
      </header>

      {/* Timeline Section */}
      <section className="py-20 px-8 max-w-7xl mx-auto relative">
        <h2 className="text-4xl font-bold text-center mb-4 text-slate-800">My Journey</h2>
        <p className="text-xl text-slate-500 text-center mb-20">What my resume won't tell you...</p>

        {/* Central timeline line */}
        <div className="absolute left-1/2 top-40 bottom-20 w-0.5 bg-gradient-to-b from-indigo-200 via-purple-200 to-pink-200 -translate-x-1/2"></div>

        {/* Timeline Items */}
        <TimelineItem
          year="Origin"
          title="From a Finance Family"
          description="I came from a Finance Family."
          images={[familyImg]}
          icon={<GraduationCap size={28} />}
          align="left"
        />

        <TimelineItem
          year="2017"
          title="Penn State Smeal Business School"
          description="Bachelor's in Finance."
          images={[smealShieldImg]}
          icon={<GraduationCap size={28} />}
          isLogo={true}
          align="right"
        />

        <TimelineItem
          year="2020/06"
          title="Goldman Sachs"
          description="Goldman Internship at 2020/06."
          images={[goldmanImg]}
          icon={<Briefcase size={28} />}
          align="left"
        />

        <TimelineItem
          year="2021"
          title="Cornell University"
          description="Master's in Statistics."
          images={[cornellImg]}
          icon={<GraduationCap size={28} />}
          isLogo={true}
          align="right"
        />

        <TimelineItem
          year="2022-2024"
          title="2yrs Accounting, Moss Adams"
          description="While I gained solid professional experience, I realized my passion wasn't there."
          images={[mossadamsImg]}
          icon={<Briefcase size={28} />}
          align="left"
        />

        <TimelineItem
          year="Turning Point"
          title="The Pivot: Hackathons & Startup"
          description="Attending hackathons and build with friends."
          images={[hackathonImg, cofoundImg]}
          icon={<Sparkles size={28} />}
          align="right"
        />

        <TimelineItem
          year="2025/01"
          title="BravoMeal AI Startup"
          description="Co-founded an AI-powered meal planning startup."
          images={[bravomeal]}
          icon={<Briefcase size={28} />}
          align="left"
        />

        <TimelineItem
          year="2025"
          title="Northeastern University"
          description={<>M.S. Computer Software Engineering, 4.0 GPA.<br />Full Scholarship.</>}
          images={[northeasternImg]}
          icon={<GraduationCap size={28} />}
          isLogo={true}
          align="right"
        />

        <TimelineItem
          year="2025/06"
          title="Wiwynn Internship"
          description="Software Engineering Intern at Wiwynn."
          images={[wiwynn, wiwynn1]}
          icon={<Briefcase size={28} />}
          align="left"
        />

        <TimelineItem
          year="Giving Back"
          title="Women in Tech Volunteer"
          description="Volunteering at Women in Tech to help women grow."
          images={[volunteerImg, volunteer2Img]}
          icon={<Heart size={28} />}
          align="right"
        />

        <TimelineItem
          year="4 Years"
          title="Concert Clarinet Player"
          description="Played clarinet in concert for 4 years."
          images={[concertImg, concert1Img]}
          icon={<Music size={28} />}
          align="left"
        />

        <TimelineItem
          year="Passion"
          title="Snowboarding Enthusiast"
          description="Love snowboarding with friends!"
          images={[snowboardImg, snowboard1Img]}
          icon={<Mountain size={28} />}
          align="right"
        />

        <TimelineItem
          year="Content"
          title="CS Influencer"
          description="Creating CS educational videos on Chinese social media."
          images={[influencerImg]}
          icon={<Video size={28} />}
          align="left"
        />
      </section>

      {/* Transition to Shorto */}
      <section className="py-20 text-center bg-gradient-to-b from-white to-indigo-50">
        <div className="max-w-3xl mx-auto px-4">
          <p className="text-xl text-slate-500 mb-8">
            Now, let me show you what I've been building...
          </p>
          <div className="animate-bounce text-indigo-400">
            <ArrowDown size={32} className="mx-auto" />
          </div>
        </div>
      </section>
    </div>
  );
};
