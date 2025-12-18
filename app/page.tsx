"use client";

import {
  AnimatedProfileCard,
  ProfileCard,
  ProfileCardHorizontal,
  Header,
} from "@/components";

export default function Home() {
  return (
    <div
      className="flex min-h-screen flex-col font-sans relative"
      style={{ backgroundColor: "#363636" }}
    >
      <Header />
      <main className="flex flex-1 w-full max-w-3xl mx-auto flex-col items-center justify-center gap-8 py-8">
        <ProfileCard
          imageSrc="/image.png"
          name="Inna Azizyan"
          biography="Inna is a passionate educator and community leader. She has been working in the education sector for over 15 years, and her expertise spans curriculum development, student support, and community engagement. Inna is dedicated to creating inclusive learning environments and empowering students to reach their full potential."
          buttonText="Discover more"
          onClick={() => {
            /* handle click */
          }}
        />
        <ProfileCardHorizontal
          imageSrc="/image.png"
          name="Inna Azizyan"
          biography="I founded the organization when I was just 19 years old. The journey has had its challenges—many of them—but I’ve always had a clear goal"
          buttonText="Read more"
          onClick={() => {
            /* handle click */
          }}
        />
        <AnimatedProfileCard
          imageSrc="/image.png"
          name="Inna Azizyan"
          biography="I founded the organization when I was just 19 years old. The journey has had its challenges—many of them—but I've always had a clear goal"
          expandedBiography="I founded the organization when I was just 19 years old. The journey has had its challenges—many of them—but I've always had a clear goal. Over the years, I've learned that persistence and a clear vision can overcome any obstacle. Today, our organization has grown to serve thousands of young people across the region."
          buttonText="Read more"
          expandedButtonText="Discover more"
          onExpand={() => {
            // Optional callback when expanded
          }}
        />
      </main>
    </div>
  );
}
