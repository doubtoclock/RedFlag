"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export function TermsModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        >
          <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="bg-[#111] border border-white/20 rounded-2xl w-full max-w-lg max-h-[85vh] flex flex-col shadow-2xl overflow-hidden relative"
          >
            <div className="flex items-center justify-between p-5 border-b border-white/10 shrink-0">
              <h2 className="text-xl font-juana text-white">Terms & Conditions</h2>
              <button onClick={onClose} className="p-2 text-white/50 hover:text-white transition-colors bg-white/5 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto text-[13px] text-white/70 space-y-5 font-sans leading-relaxed">
              <p><strong>Last Updated:</strong> September 26, 2026</p>
              <p><strong>Effective Date:</strong> September 26, 2026</p>
              
              <p>Welcome to <strong>Red Flag</strong> ("Red Flag", "we", "us", or "our").</p>
              <p>These Terms & Conditions ("Terms") govern your access to and use of the Red Flag application and website (collectively, the "Service").</p>
              <p>By accessing or using Red Flag, you acknowledge that you have read, understood, and agree to these Terms. If you do not agree with these Terms, please do not use the Service.</p>

              <h3 className="text-white font-medium text-base mt-6">1. About Red Flag</h3>
              <p>Red Flag is a question-and-answer game designed around relationship, dating, and interpersonal scenarios.</p>
              <p>The Service presents users with a series of questions or statements and allows users to provide responses. Based on those responses, Red Flag generates a score, category, title, and/or message.</p>
              <p>The Service is designed primarily for <strong>entertainment and self-reflection purposes</strong>.</p>

              <h3 className="text-white font-medium text-base mt-6">2. Eligibility</h3>
              <p>You may use Red Flag only if you are legally permitted to use the Service under the laws applicable to you.</p>
              <p>The current application includes an age-selection field ranging from 13 to 60 but does not independently verify or enforce the user's age. If you are under the minimum age required by applicable law to use the Service, you must not use Red Flag.</p>
              <p>Parents or legal guardians are responsible for determining whether the Service is appropriate for minors in their care.</p>

              <h3 className="text-white font-medium text-base mt-6">3. Entertainment Disclaimer</h3>
              <p>Red Flag is an entertainment and self-reflection application.</p>
              <p>The scores, labels, categories, messages, questions, and results provided by Red Flag are <strong>not professional assessments</strong> and should not be interpreted as psychological assessments, clinical assessments, medical diagnoses, mental-health advice, relationship counseling, professional dating advice, legal advice, financial advice, or any other form of professional advice.</p>
              <p>A result such as "Red Flag Energy" or "Green Flag" is generated from your responses to predefined questions and is not a scientifically validated determination of your personality, character, compatibility, or relationship.</p>
              <p>You should not make important personal, relationship, medical, financial, legal, or other decisions solely based on a Red Flag result.</p>

              <h3 className="text-white font-medium text-base mt-6">4. How the Service Works</h3>
              <p>Red Flag may ask you to provide information during onboarding, including your name, age, who is taking the test, and your relationship status. You may then be presented with a series of relationship-related questions or statements. Your responses are used to calculate your Red Flag result.</p>
              <p>The current version of the Service processes this functionality locally within the application and does not require you to create an account.</p>

              <h3 className="text-white font-medium text-base mt-6">5. Quiz Results</h3>
              <p>Red Flag may generate results including a percentage score, a result category, a title, a personalized message, and other content based on your responses. Results are generated according to the application's programmed logic.</p>
              <p>We do not guarantee that any result is accurate, scientifically validated, complete, objective, representative of your actual personality, representative of another person's personality, or suitable for your particular circumstances. The results are intended to provide an entertaining and interactive experience.</p>

              <h3 className="text-white font-medium text-base mt-6">6. Your Responses</h3>
              <p>You are responsible for the responses and information you provide while using Red Flag. You should avoid entering information that you do not want to appear in a result or be visible if you choose to share your result.</p>
              <p>You acknowledge that your responses may affect the result generated by the Service.</p>

              <h3 className="text-white font-medium text-base mt-6">7. Sharing Results</h3>
              <p>Red Flag may provide a <strong>Share Result</strong> feature that allows you to generate an image containing your quiz result. The image may include information such as your score, your relationship-status-related result, and a result message.</p>
              <p>The generated image can be shared through your device's available sharing functionality. You are responsible for deciding whether and where to share your result.</p>
              <p>Once you voluntarily share your result with another person or third-party service, Red Flag does not control how that person or service may use, store, reproduce, or distribute the shared content. Your use of third-party platforms is subject to their respective terms and privacy policies.</p>

              <h3 className="text-white font-medium text-base mt-6">8. Acceptable Use</h3>
              <p>You agree to use Red Flag only for lawful purposes and in accordance with these Terms.</p>
              <p>You must not: use the Service for unlawful purposes; attempt to disrupt or interfere with the operation of the Service; attempt to gain unauthorized access to the Service or its infrastructure; attempt to bypass security or technical restrictions; introduce malicious software, code, or other harmful material; attempt to interfere with another user's use of the Service; use automated systems to abuse or disrupt the Service; attempt to reverse engineer, decompile, or modify the Service except where permitted by applicable law; or use the Service in a way that violates applicable laws or regulations.</p>

              <h3 className="text-white font-medium text-base mt-6">9. Intellectual Property</h3>
              <p>The Red Flag application and its contents, including but not limited to the Red Flag name, logos and branding, user interface design, graphics, illustrations, animations, questions and statements, text, software, layouts, and other original materials may be protected by copyright, trademark, or other intellectual-property laws.</p>
              <p>Unless expressly permitted by us or applicable law, you may not copy, reproduce, modify, distribute, republish, sell, license, create derivative works from, or commercially exploit our proprietary materials.</p>
              <p>Your use of Red Flag does not transfer ownership of any Red Flag intellectual property to you.</p>

              <h3 className="text-white font-medium text-base mt-6">10. User-Generated Content</h3>
              <p>The current version of Red Flag does not provide functionality for users to create public posts, profiles, comments, photographs, videos, or other public content.</p>
              <p>Your quiz responses and results are used to provide the Service. If you voluntarily generate and share a result image, you are responsible for the content you choose to share.</p>

              <h3 className="text-white font-medium text-base mt-6">11. Third-Party Services</h3>
              <p>Red Flag may interact with third-party applications or services through your device's native sharing functionality. Third-party services are independent from Red Flag and are not controlled by us.</p>
              <p>We are not responsible for the availability of third-party services, their content, their privacy practices, their security practices, or their handling of information you voluntarily share with them. Your use of a third-party service is governed by that service's own terms and policies.</p>

              <h3 className="text-white font-medium text-base mt-6">12. Privacy</h3>
              <p>Your use of Red Flag is also governed by our Privacy Policy. The Privacy Policy explains how information is handled by the current version of the Service.</p>
              <p>By using Red Flag, you acknowledge that you have had an opportunity to review our Privacy Policy.</p>

              <h3 className="text-white font-medium text-base mt-6">13. Availability of the Service</h3>
              <p>We may modify, update, suspend, or discontinue all or part of Red Flag at any time. We do not guarantee that the Service will always be available, operate without interruption, be free from errors, be compatible with every device or browser, remain available indefinitely, or remain unchanged.</p>
              <p>We may perform maintenance, updates, improvements, or modifications that temporarily affect availability.</p>

              <h3 className="text-white font-medium text-base mt-6">14. Updates</h3>
              <p>We may release updates, changes, improvements, or modifications to Red Flag from time to time. Updates may add or remove features, change questions, change scoring logic, modify the user interface, improve performance, fix bugs, or change how certain features operate.</p>
              <p>Continued use of the Service after an update may require you to use the updated version of the Service.</p>

              <h3 className="text-white font-medium text-base mt-6">15. No Warranty</h3>
              <p>To the maximum extent permitted by applicable law, Red Flag is provided on an <strong>"as is" and "as available"</strong> basis.</p>
              <p>We do not guarantee that the Service will always work correctly, the Service will always be available, quiz results will be accurate, quiz results will be scientifically valid, the information provided will be complete, the Service will meet your specific expectations, the Service will be compatible with your device, or errors will always be corrected.</p>
              <p>Nothing in these Terms excludes any warranty or consumer right that cannot legally be excluded under applicable law.</p>

              <h3 className="text-white font-medium text-base mt-6">16. Limitation of Liability</h3>
              <p>To the maximum extent permitted by applicable law, Red Flag and its developer/operator will not be liable for any loss, damage, or consequence arising from or related to your use of the Service, your inability to use the Service, your reliance on a quiz result, your interpretation of a result, decisions made based on information provided by the Service, your sharing of a result, third-party services used to share your result, or temporary or permanent unavailability of the Service.</p>
              <p>Nothing in these Terms is intended to exclude or limit liability where such exclusion or limitation is prohibited by applicable law.</p>

              <h3 className="text-white font-medium text-base mt-6">17. Personal Decisions</h3>
              <p>Red Flag provides an entertainment experience and should not be used as the sole basis for making decisions about your relationships or other aspects of your personal life. You are responsible for your own decisions and actions.</p>
              <p>A Red Flag result should not be treated as a definitive judgment about yourself or another person.</p>

              <h3 className="text-white font-medium text-base mt-6">18. Suspension or Termination</h3>
              <p>Because the current version of Red Flag does not require user accounts, there is no account-based termination process.</p>
              <p>We may restrict, suspend, or discontinue access to the Service where reasonably necessary, including for security reasons, legal reasons, maintenance, technical reasons, abuse of the Service, or other legitimate operational reasons.</p>

              <h3 className="text-white font-medium text-base mt-6">19. Changes to These Terms</h3>
              <p>We may update these Terms from time to time. When we make changes, we will update the <strong>"Last Updated"</strong> date at the beginning of these Terms. Where required by applicable law, we may provide additional notice of material changes.</p>
              <p>Your continued use of the Service after updated Terms become effective constitutes acceptance of the revised Terms to the extent permitted by applicable law.</p>

              <h3 className="text-white font-medium text-base mt-6">20. Severability & Entire Agreement</h3>
              <p>If any provision of these Terms is determined to be invalid, unlawful, or unenforceable, that provision will be interpreted or modified to the extent necessary to make it enforceable where legally possible. The remaining provisions of these Terms will continue to apply to the extent permitted by applicable law.</p>
              <p>These Terms, together with the Privacy Policy and any other policies expressly incorporated into these Terms, constitute the agreement between you and Red Flag regarding your use of the Service, except where applicable law requires otherwise.</p>

              <h3 className="text-white font-medium text-base mt-6">21. Contact Us</h3>
              <p>If you have questions, concerns, or requests regarding these Terms or the Red Flag Service, please contact us at:</p>
              <p><strong>Legal Email:</strong> legal@redflag.test</p>
            </div>
            
            <div className="p-4 border-t border-white/10 shrink-0">
              <button onClick={onClose} className="w-full bg-white/10 hover:bg-white/20 text-white font-medium rounded-full py-3 transition-colors text-sm">
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
