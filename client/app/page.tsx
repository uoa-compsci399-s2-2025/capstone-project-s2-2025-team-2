"use client";

export default function Home() {
  console.log("Project ID:", process.env.NEXT_PUBLIC_FIREBASE_PROJECTID);

  return (
    <div>
      Project ID: {process.env.NEXT_PUBLIC_FIREBASE_PROJECTID || "undefined"}
    </div>
  );
}
