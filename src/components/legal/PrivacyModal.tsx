"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export function PrivacyModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
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
              <h2 className="text-xl font-juana text-white">Privacy Policy</h2>
              <button onClick={onClose} className="p-2 text-white/50 hover:text-white transition-colors bg-white/5 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto text-[13px] text-white/70 space-y-5 font-sans leading-relaxed">
              <p><strong>Last Updated:</strong> September 26, 2026</p>
              
              <p>Welcome to <strong>Red Flag</strong> ("Red Flag", "we", "us", or "our").</p>
              <p>This Privacy Policy explains how Red Flag handles information when you use our application and website (the "Service").</p>
              
              <p>Red Flag is a question-and-answer game that presents users with relationship and interpersonal scenarios and generates a result based on the user's responses.</p>
              <p>The current version of Red Flag is designed to operate primarily on your device. Red Flag does not currently have a backend database, user account system, analytics system, advertising system, or server-side storage for the information you enter into the quiz.</p>

              <h3 className="text-white font-medium text-base mt-6">1. Information We Collect</h3>
              <p><strong>1.1 Information You Enter During Onboarding</strong></p>
              <p>Red Flag may ask you to provide certain information during the onboarding process, including your name, age, who is taking the test, and your relationship status.</p>
              <p>Your name and age are held temporarily in the application's memory and are not transmitted to a Red Flag server or permanently stored by Red Flag.</p>
              <p>Your relationship status is stored locally in your browser using browser <code>localStorage</code> so that Red Flag can use it when displaying your results.</p>
              
              <p><strong>1.2 Quiz Answers</strong></p>
              <p>During the quiz, you provide answers by swiping left or right on relationship-related questions. Your individual answers are temporarily maintained in the application's memory and are used to calculate your result.</p>
              <p>The current version of Red Flag does not send your answers to a Red Flag server, store them in a database, associate them with an account, or send them to analytics providers. Your quiz answers are discarded when the relevant browser session or application state is lost.</p>
              
              <p><strong>1.3 Quiz Results</strong></p>
              <p>After completing the quiz, Red Flag generates a result based on your responses. The result is generated locally within the application and is not transmitted to a Red Flag backend.</p>

              <h3 className="text-white font-medium text-base mt-6">2. Information We Do Not Collect</h3>
              <p>Based on the current implementation, Red Flag does not intentionally collect or transmit the following information to its own servers: Email address, Telephone number, Precise/Approximate location, GPS information, Contacts, Camera data, Microphone data, Device advertising ID, User accounts, Passwords, Profile photographs, Uploaded media, or Payment information.</p>
              
              <h3 className="text-white font-medium text-base mt-6">3. Local Storage</h3>
              <p>Red Flag currently uses browser <code>localStorage</code> to store one piece of information:<br/><strong>Storage Key:</strong> <code>redflag_relationship</code><br/><strong>Purpose:</strong> To remember the relationship status selected during onboarding and use it when displaying your result.</p>
              
              <h3 className="text-white font-medium text-base mt-6">4. How Your Information Is Used</h3>
              <p>Information entered into Red Flag is used to provide the application's functionality. This includes operating the onboarding experience, processing quiz answers, calculating your quiz result, and generating a result image when you choose to share your result.</p>
              <p>The current version of Red Flag does not use your quiz information for advertising, analytics, selling personal information, or training artificial intelligence models.</p>

              <h3 className="text-white font-medium text-base mt-6">5. Sharing Your Result</h3>
              <p>Red Flag provides an optional Share Result feature. When you choose to share your result, Red Flag generates an image of your result locally on your device. The application then uses your device's native sharing functionality to allow you to choose another application through which to share the image.</p>

              <h3 className="text-white font-medium text-base mt-6">6. Data Retention & Account Deletion</h3>
              <p>Your name, age, quiz answers, and quiz result are generated locally and not stored in a backend database. Your selected relationship status remains in browser <code>localStorage</code> until the relevant browser or website data is cleared. Since Red Flag does not currently maintain online user accounts, there is no account deletion process.</p>
              
              <h3 className="text-white font-medium text-base mt-6">7. Contact Us</h3>
              <p>If you have questions, concerns, or requests regarding this Privacy Policy, please contact us at:</p>
              <p><strong>Privacy Email:</strong> redflag.app.support@gmail.com</p>
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
