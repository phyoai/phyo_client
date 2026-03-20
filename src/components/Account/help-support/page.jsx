'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeftLine, FileTextLine, Message3Line, MailLine, PhoneLine, CloseLine, SearchLine } from '@phyoofficial/phyo-icon-library';
import { useGoBack } from '@/hooks/useGoBack';
import AppBar from '@/components/ui/AppBar';
import Button from '@/components/ui/Button';
import IconButton from '@/components/ui/IconButton';
import Card from '@/components/ui/Card';
import { colors } from '@/config/colors';
import apiClient from '@/utils/api';

export default function HelpSupportAll() {
  const router = useRouter();
  const goBack = useGoBack();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('english');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFaqId, setSelectedFaqId] = useState(null);
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFaqs();
  }, []);

  const fetchFaqs = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.get('/help/faqs');
      setFaqs(response.data.data || []);
    } catch (err) {
      console.error('Error fetching FAQs:', err);
      setError('Failed to load FAQs');
      setFaqs([]);
    } finally {
      setLoading(false);
    }
  };

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

  const filteredFaqs = faqs.filter(faq =>
    faq.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (faq.question && faq.question.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const selectedFaq = faqs.find(faq => faq._id === selectedFaqId || faq.id === selectedFaqId);

  const FaqItem = ({ faq, onClick }) => (
    <button onClick={onClick} className="w-full flex items-center px-6 py-5 transition-colors" style={{ backgroundColor: colors.neutral.base }}>
      <FileTextLine className="w-6 h-6 mr-3 flex-shrink-0" style={{ color: colors.brand.base }} strokeWidth={1.5} />
      <span className="text-base font-semibold text-left" style={{ color: colors.text.neutral.base }}>{faq.title || faq.question}</span>
    </button>
  );

  if (loading) {
    return (
      <div className="w-full h-full flex flex-col" style={{ backgroundColor: colors.neutral.base }}>
        <AppBar
          title="Help & Support"
          onBack={() => router.back()}
          showMenu={true}
          onMenuClick={() => setIsLanguageModalOpen(true)}
        />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2" style={{ borderColor: colors.brand.base }}></div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col" style={{ backgroundColor: colors.neutral.base }}>
      <AppBar
        title="Help & Support"
        onBack={() => router.back()}
        showMenu={true}
        onMenuClick={() => setIsLanguageModalOpen(true)}
      />

      {error && (
        <div className="mx-3 mt-3 p-3 bg-red-50 border border-red-200 rounded text-red-800 text-sm">
          {error}
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-3 sm:px-4 md:px-6 lg:px-9 relative flex flex-col">
        {selectedFaqId ? (
          /* FAQ Detail View */
          <>
            <div className="flex items-center gap-2 px-4 py-4 -ml-4">
              <IconButton
                icon={ArrowLeftLine}
                size="sm"
                variant="default"
                onClick={() => setSelectedFaqId(null)}
              />
              <span className="text-sm font-semibold" style={{ color: colors.text.neutral.base }}>Back</span>
            </div>
            {selectedFaq && (
              <div className="flex-1 px-4 py-4">
                <h1 className="text-2xl font-semibold mb-4" style={{ color: colors.text.neutral.base }}>{selectedFaq.title || selectedFaq.question}</h1>
                <p className="text-base whitespace-pre-line leading-relaxed" style={{ color: colors.text.neutral.muted }}>{selectedFaq.content || selectedFaq.answer}</p>
              </div>
            )}
          </>
        ) : (
          /* FAQ List View */
          <>
            {/* Logo and Heading */}
            <div className="text-center pt-6 px-4 mb-2">
              <h2 className="text-2xl font-bold mb-2" style={{ color: colors.text.neutral.base }}>Phyo</h2>
              <p className="text-lg mb-6" style={{ color: colors.text.neutral.base }}>How can we help?</p>
            </div>

            {/* SearchLine Box */}
            <div className="px-3 sm:px-4 pb-4 sm:pb-6">
              <div className="relative">
                <SearchLine className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: colors.text.neutral.muted }} />
                <input
                  type="text"
                  placeholder="SearchLine Help Center"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-10 py-3 rounded-full focus:outline-none focus:ring-2"
                  style={{
                    backgroundColor: colors.neutral.muted,
                    color: colors.text.neutral.base,
                    borderColor: colors.neutral.muted
                  }}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2"
                  >
                    <CloseLine className="w-5 h-5" style={{ color: colors.text.neutral.muted }} />
                  </button>
                )}
              </div>
            </div>

            {/* FAQs Section or No Results */}
            {filteredFaqs.length > 0 ? (
              <>
                <div className="pt-2 px-4">
                  <p className="text-xs mb-2" style={{ color: colors.text.neutral.muted }}>FAQs</p>
                </div>
                <div className="w-full">
                  {filteredFaqs.map((faq) => (
                    <FaqItem
                      key={faq._id || faq.id}
                      faq={faq}
                      onClick={() => setSelectedFaqId(faq._id || faq.id)}
                    />
                  ))}
                </div>
              </>
            ) : (
              /* No Results Found */
              <div className="flex-1 flex flex-col items-center justify-center px-4">
                <p className="text-xl font-semibold mb-2" style={{ color: colors.text.neutral.base }}>No results found</p>
                <p className="text-sm text-center" style={{ color: colors.text.neutral.muted }}>
                  Make sure everything is spelled correctly or try different keywords
                </p>
              </div>
            )}
          </>
        )}

        {/* Contact Us FAB - Only show when not in detail view and no search */}
        {!selectedFaqId && !searchQuery && (
          <Button
            variant="primary"
            size="lg"
            icon={Message3Line}
            onClick={() => setIsModalOpen(true)}
            className="fixed bottom-6 sm:bottom-8 md:bottom-9 right-4 sm:right-6 md:right-9 rounded-xl"
          >
            Contact Us
          </Button>
        )}
      </div>

      {/* Contact Us Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setIsModalOpen(false)}
        >
          <Card
            variant="default"
            className="w-full sm:w-[400px] sm:max-w-[90vw] md:max-w-[400px] rounded-3xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b" style={{ borderColor: colors.neutral.muted }}>
              <h2 className="text-lg font-semibold" style={{ color: colors.text.neutral.base }}>Contact us by</h2>
              <IconButton
                icon={CloseLine}
                size="sm"
                variant="default"
                onClick={() => setIsModalOpen(false)}
              />
            </div>

            {/* Contact Options */}
            <div className="flex flex-col -mx-6 -mb-6 -mt-2">
              {/* Email Option */}
              <button className="flex items-center w-full px-6 py-5 transition-colors border-b" style={{ borderColor: colors.neutral.muted }}>
                <MailLine className="w-6 h-6 mr-4 flex-shrink-0" style={{ color: colors.brand.base }} strokeWidth={1.5} />
                <p className="text-base font-semibold text-left" style={{ color: colors.text.neutral.base }}>Email</p>
              </button>

              {/* Call Us Option */}
              <button className="flex items-center w-full px-6 py-5 transition-colors">
                <PhoneLine className="w-6 h-6 mr-4 flex-shrink-0" style={{ color: colors.brand.base }} strokeWidth={1.5} />
                <p className="text-base font-semibold text-left" style={{ color: colors.text.neutral.base }}>Call Us</p>
              </button>
            </div>
          </Card>
        </div>
      )}

      {/* Language Selection Modal */}
      {isLanguageModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setIsLanguageModalOpen(false)}
        >
          <Card
            variant="default"
            className="w-full sm:w-[400px] sm:max-w-[90vw] md:max-w-[400px] rounded-3xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b -mx-6 -mt-6 px-6 pt-6 mb-2" style={{ borderColor: colors.neutral.muted }}>
              <IconButton
                icon={CloseLine}
                size="sm"
                variant="default"
                onClick={() => setIsLanguageModalOpen(false)}
              />
              <h2 className="text-lg font-semibold" style={{ color: colors.text.neutral.base }}>Select Language</h2>
              <div className="w-6" />
            </div>

            {/* Language Options */}
            <div className="flex flex-col max-h-[60vh] overflow-y-auto -mx-6 -mb-6">
              {languages.map((language) => (
                <button
                  key={language.id}
                  onClick={() => setSelectedLanguage(language.id)}
                  className="flex items-center w-full px-6 py-4 transition-colors border-b last:border-b-0"
                  style={{ borderColor: colors.neutral.muted }}
                >
                  {/* Radio Button */}
                  <div className="flex items-center justify-center w-6 h-6 rounded-full border-2 mr-4 flex-shrink-0" style={{ borderColor: colors.neutral.muted, backgroundColor: colors.neutral.base }}>
                    {selectedLanguage === language.id && (
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors.brand.base }} />
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
          </Card>
        </div>
      )}
    </div>
  );
}
