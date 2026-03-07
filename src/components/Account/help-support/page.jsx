'use client';

import  React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeftLine, MoreLine, FileTextLine, MessageLine, MailLine, PhoneLine, CloseLine, SearchLine } from '@phyoofficial/phyo-icon-library';

export default function HelpSupport() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('english');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFaqId, setSelectedFaqId] = useState(null);

  const languages = [
    { id: 'english', name: 'English', subtitle: "device's language" },
    { id: 'hindi', name: 'हिंदी', subtitle: 'Hindi' },
    { id: 'marathi', name: 'मराठी', subtitle: 'Marathi' },
    { id: 'gujarati', name: 'ગુજરાતી', subtitle: 'Gujarati' },
    { id: 'tamil', name: 'தமிழ்', subtitle: 'Tamil' },
    { id: 'bengali', name: 'বাংলা', subtitle: 'Bengali' },
    { id: 'kannada', name: 'ಕನ್ನಡ', subtitle: 'Kannada' },
    { id: 'malayalam', name: 'മലയാളം', subtitle: 'Malayalam' }
  ];

  const faqs = [
    {
      id: 1,
      title: "How to use the app?",
      content: "Our app is designed to be intuitive and user-friendly. Here's a quick guide to get you started:\n\n1. **Account Setup**: First, create your account by selecting whether you're an influencer or a brand. Fill in your profile information to help others understand who you are.\n\n2. **Dashboard Navigation**: Once logged in, you'll see your main dashboard. Use the navigation menu to explore different sections like your profile, messages, collaborations, and analytics.\n\n3. **Discovery**: Use the search and filter features to find influencers or brands that match your criteria. You can filter by niche, location, engagement rate, and more.\n\n4. **Connecting**: When you find someone you'd like to work with, send them a collaboration request. Include details about your proposal to increase your chances of a positive response.\n\n5. **Managing Collaborations**: Track all your ongoing and past collaborations in the \"My Collaborations\" section. Here you can view contract details, deliverables, timelines, and communicate with your partners.\n\n6. **Analytics**: Monitor your performance through our analytics dashboard. Track engagement, reach, and ROI for all your collaborations.\n\nIf you need more help, check out our video tutorials or contact our support team."
    },
    {
      id: 2,
      title: "How to convert to an influencer account?",
      content: "Converting your account to an influencer account is simple:\n\n1. Go to your account settings\n2. Select 'Account Type' from the menu\n3. Click on 'Convert to Influencer Account'\n4. Follow the on-screen instructions\n5. Complete your influencer profile with your niche, engagement rates, and portfolio\n6. Your account will be reviewed and approved within 24-48 hours\n\nOnce approved, you'll have access to all influencer features and be discoverable to brands looking for collaborations."
    },
    {
      id: 3,
      title: "What's the difference between influencer and brand accounts?",
      content: "**Influencer Accounts** are designed for content creators and influencers who want to collaborate with brands. Features include:\n- Portfolio showcase\n- Analytics dashboard for engagement tracking\n- Collaboration requests from brands\n- Direct messaging with brands\n\n**Brand Accounts** are for businesses looking to collaborate with influencers. Features include:\n- SearchLine and filter influencers by niche\n- Campaign management tools\n- Budget and deliverable tracking\n- Team collaboration features\n\nChoose the account type that best fits your role in the influencer marketing ecosystem."
    },
    {
      id: 4,
      title: "How do I choose the right influencer for my brand?",
      content: "Finding the right influencer for your brand involves several steps:\n\n1. **Define Your Goals**: Clearly identify what you want to achieve - brand awareness, sales, content creation, etc.\n\n2. **Identify Your Target Audience**: Understand your ideal customer and look for influencers whose audience matches.\n\n3. **CheckLine Engagement Rates**: Look beyond follower count. Engagement rate shows how active and loyal an influencer's audience is.\n\n4. **Review Content Quality**: Make sure the influencer's content style aligns with your brand values.\n\n5. **Analyze Niche Alignment**: Choose influencers who operate in your industry or related areas.\n\n6. **CheckLine Authenticity**: Look for genuine engagement and avoid accounts with suspicious activity.\n\n7. **Review Past Collaborations**: See what other brands they've worked with and the results.\n\n8. **Start Small**: Begin with micro-influencers or smaller collaborations before committing to major campaigns."
    },
    {
      id: 5,
      title: "How can user feedback improve product design?",
      content: "UserLine feedback is invaluable for improving our platform:\n\n1. **Direct Feedback**: We actively listen to suggestions and complaints from our users.\n\n2. **Usage Analytics**: We analyze how users interact with different features to identify pain points.\n\n3. **UserLine Testing**: We conduct regular sessions with users to understand their needs and frustrations.\n\n4. **Community Forum**: Our community discusses feature requests and improvements.\n\n5. **Continuous Iteration**: Based on feedback, we regularly update and improve our features.\n\n6. **Transparency**: We keep our users informed about upcoming changes and improvements.\n\nIf you have feedback or suggestions, please don't hesitate to contact our support team. Your input helps us build a better platform for everyone."
    }
  ];

  const filteredFaqs = faqs.filter(faq =>
    faq.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedFaq = faqs.find(faq => faq.id === selectedFaqId);

  const FaqItem = ({ faq, onClick }) => (
    <button onClick={onClick} className="w-full flex items-center px-6 py-5 bg-neutral-base hover:bg-gray-50 transition-colors">
      <FileTextLine className="w-6 h-6 text-[#43573b] mr-3 flex-shrink-0" strokeWidth={1.5} />
      <span className="text-base font-semibold text-[#242527] text-left">{faq.title}</span>
    </button>
  );

  return (
    <div className="w-full h-full flex flex-col bg-neutral-base">
      {/* App Bar */}
      <div className="flex items-center justify-between px-1 py-2 border-b border-gray-100">
        <button
          onClick={() => router.back()}
          className="flex items-center justify-center w-12 h-12 rounded-full hover:bg-gray-100 transition-colors"
        >
          <ArrowLeftLine className="w-6 h-6 text-[#242527]" />
        </button>
        
        <h1 className="flex-1 text-xl font-semibold text-[#242527] px-2">
          Help & Support
        </h1>
        
        <button
          onClick={() => setIsLanguageModalOpen(true)}
          className="flex items-center justify-center w-12 h-12 rounded-full hover:bg-gray-100 transition-colors"
        >
          <MoreLine className="w-6 h-6 text-[#242527]" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-9 relative flex flex-col">
        {selectedFaqId ? (
          /* FAQ Detail View */
          <>
            <button
              onClick={() => setSelectedFaqId(null)}
              className="flex items-center gap-2 px-4 py-4 text-[#242527] hover:bg-gray-50 rounded -ml-4"
            >
              <ArrowLeftLine className="w-5 h-5" />
              <span className="text-sm font-semibold">Back</span>
            </button>
            <div className="flex-1 px-4 py-4">
              <h1 className="text-2xl font-semibold text-[#242527] mb-4">{selectedFaq.title}</h1>
              <p className="text-base text-[#505152] whitespace-pre-line leading-relaxed">{selectedFaq.content}</p>
            </div>
          </>
        ) : (
          /* FAQ List View */
          <>
            {/* Logo and Heading */}
            <div className="text-center pt-6 px-4 mb-2">
              <h2 className="text-2xl font-bold text-[#242527] mb-2">Phyo</h2>
              <p className="text-lg text-[#242527] mb-6">How can we help?</p>
            </div>

            {/* SearchLine Box */}
            <div className="px-4 pb-6">
              <div className="relative">
                <SearchLine className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="SearchLine Help Center"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-10 py-3 bg-gray-100 rounded-full text-[#242527] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2"
                  >
                    <TwitterXLineXLineXLine className="w-5 h-5 text-gray-400" />
                  </button>
                )}
              </div>
            </div>

            {/* FAQs Section or No Results */}
            {filteredFaqs.length > 0 ? (
              <>
                <div className="pt-2 px-4">
                  <p className="text-xs text-[#505152] mb-2">FAQs</p>
                </div>
                <div className="w-full">
                  {filteredFaqs.map((faq) => (
                    <FaqItem
                      key={faq.id}
                      faq={faq}
                      onClick={() => setSelectedFaqId(faq.id)}
                    />
                  ))}
                </div>
              </>
            ) : (
              /* No Results Found */
              <div className="flex-1 flex flex-col items-center justify-center px-4">
                <p className="text-xl font-semibold text-[#242527] mb-2">No results found</p>
                <p className="text-sm text-gray-500 text-center">
                  Make sure everything is spelled correctly or try different keywords
                </p>
              </div>
            )}
          </>
        )}

        {/* Contact Us FAB - Only show when not in detail view and no search */}
        {!selectedFaqId && !searchQuery && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="fixed bottom-9 right-9 bg-[#43573b] hover:bg-[#3d4f36] text-white px-4 py-4 rounded-xl flex items-center gap-2 shadow-lg transition-colors"
          >
            <MessageLine className="w-6 h-6" strokeWidth={1.5} />
            <span className="text-base font-semibold">Contact Us</span>
          </button>
        )}
      </div>

      {/* Contact Us Modal */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setIsModalOpen(false)}
        >
          <div 
            className="bg-neutral-base rounded-3xl w-[400px] max-w-[90%] overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 pt-4">
              <h2 className="text-lg font-semibold text-[#242527]">Contact us by</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <TwitterXLineXLineXLine className="w-5 h-5 text-[#242527]" />
              </button>
            </div>

            {/* Contact Options */}
            <div className="flex flex-col">
              {/* Email Option */}
              <button className="flex items-center w-full hover:bg-gray-50 transition-colors">
                <div className="flex items-center px-6 py-5">
                  <MailLine className="w-6 h-6 text-[#43573b]" strokeWidth={1.5} />
                </div>
                <div className="flex-1 py-3 pr-4">
                  <p className="text-base font-semibold text-[#242527] text-left">Email</p>
                </div>
              </button>

              {/* Call Us Option */}
              <button className="flex items-center w-full hover:bg-gray-50 transition-colors">
                <div className="flex items-center px-6 py-5">
                  <PhoneLine className="w-6 h-6 text-[#43573b]" strokeWidth={1.5} />
                </div>
                <div className="flex-1 py-3 pr-4">
                  <p className="text-base font-semibold text-[#242527] text-left">Call Us</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Language Selection Modal */}
      {isLanguageModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setIsLanguageModalOpen(false)}
        >
          <div
            className="bg-neutral-base rounded-3xl w-[400px] max-w-[90%] overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-6 pb-4">
              <button
                onClick={() => setIsLanguageModalOpen(false)}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <TwitterXLineXLineXLine className="w-5 h-5 text-[#242527]" />
              </button>
              <h2 className="text-lg font-semibold text-[#242527]">Select Language</h2>
            </div>

            {/* Language Options */}
            <div className="flex flex-col max-h-[60vh] overflow-y-auto">
              {languages.map((language) => (
                <button
                  key={language.id}
                  onClick={() => setSelectedLanguage(language.id)}
                  className="flex items-center w-full px-6 py-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                >
                  {/* Radio Button */}
                  <div className={`flex items-center justify-center w-6 h-6 rounded-full border-2 mr-4 flex-shrink-0 border-gray-400 bg-neutral-base`}>
                    {selectedLanguage === language.id && (
                      <div className="w-3 h-3 rounded-full bg-[#43573B]" />
                    )}
                  </div>

                  {/* Language Text */}
                  <div className="flex flex-col items-start">
                    <p className="text-base font-semibold text-[#242527]">{language.name}</p>
                    <p className="text-sm text-gray-500">{language.subtitle}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
