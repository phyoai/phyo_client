"use client";

import { Minus, Plus } from "lucide-react";
import { useState } from "react";

const faqs = [
  { question: 'What is a "credit" in pricing plans?', answer: "A credit is a unit of measurement used for different actions on Phyo." },
  { question: "How does Phyo.ai find influencers?", answer: "Phyo.ai uses AI algorithms to analyze and suggest influencers based on your campaign needs." },
  { question: "Is there a free trial?", answer: "Yes, Phyo offers a free trial with limited features." },
  { question: "Can I generate a report for my ongoing or previous campaign?", answer: "Yes, you can generate reports for both ongoing and past campaigns in your dashboard." },
  { question: "How many platforms are available on Phyo?", answer: "Phyo supports multiple social platforms, including Instagram, YouTube, and TikTok." },
  { question: "Can I search communities on Phyo?", answer: "Yes, you can explore various influencer communities on Phyo." },
  { question: "Can I cancel my subscription?", answer: "Yes, you can cancel your subscription anytime from your account settings." },
  { question: "How does Phyo ensure influencer authenticity?", answer: "Phyo verifies influencers based on engagement metrics and AI analysis." },
  { question: "Which social platforms does Phyo support?", answer: "Phyo supports Instagram, YouTube, TikTok, and Twitter." },
  { question: "Can I try Phyo for free?", answer: "Yes, Phyo offers a free trial for new users." },
];

export default function Faq() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-[80%] mx-auto p-6">
      <h2 className="text-3xl font-bold text-center mb-6">Frequently Asked Questions</h2>
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div key={index} className="border-b border-green-600 first:border-t">
            <button
              className="w-full flex justify-between items-center py-3 text-left text-lg font-medium text-gray-900"
              onClick={() => toggleFAQ(index)}
            >
              {faq.question}
              {openIndex === index ? <Minus className="text-green-600" /> : <Plus className="text-green-600" />}
            </button>
            {openIndex === index && <p className="text-[#00674F] font-medium pb-3">{faq.answer}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
