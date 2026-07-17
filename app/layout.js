import "../src/styles/index.css";

export const metadata = {
  title: "Punch AI - Study Smarter, Not Harder",
  description: "Paste notes or a topic. Our AI builds interactive flashcards and quizzes to help you learn faster.",
  openGraph: {
    type: "website",
    title: "Punch AI - Study Smarter, Not Harder",
    description: "Paste notes or a topic. Our AI builds interactive flashcards and quizzes to help you learn faster.",
    images: ["/image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Punch AI - Study Smarter, Not Harder",
    description: "Paste notes or a topic. Our AI builds interactive flashcards and quizzes to help you learn faster.",
    images: ["/image.png"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/png" href="/image.png" />
      </head>
      <body>
        <div id="root">{children}</div>
      </body>
    </html>
  );
}
