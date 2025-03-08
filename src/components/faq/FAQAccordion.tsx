
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQAccordion = () => {
  const faqs = [
    {
      question: "Is this website really free?",
      answer: "Yes, all cricket streams on this website are completely free to watch. We don't charge any subscription fees or require payment information."
    },
    {
      question: "How can I watch matches on this website?",
      answer: "Simply browse the available matches, click on the one you want to watch, and select from the available streaming sources. The stream will start playing automatically."
    },
    {
      question: "What should I do if a stream is not working?",
      answer: "We provide multiple streaming sources for each match. If one source isn't working, try switching to a different one using the source selector below the video player."
    },
    {
      question: "Can I watch matches on my mobile device?",
      answer: "Yes, our website is fully responsive and works on all devices including smartphones and tablets. Some streams may be specifically optimized for mobile viewing."
    },
    {
      question: "How do I add a match to my watchlist?",
      answer: "Click the star icon on any match card to add it to your watchlist. You can access your watchlist anytime from the navigation menu."
    },
    {
      question: "Why are some matches not available?",
      answer: "We aim to provide streams for all major cricket matches. However, availability may depend on broadcasting rights and other factors."
    },
    {
      question: "Is it legal to watch streams on this website?",
      answer: "We only aggregate publicly available streams and do not host any content ourselves. Users are responsible for ensuring they comply with local laws regarding online streaming."
    },
    {
      question: "Do I need to create an account to watch matches?",
      answer: "No, no account is needed to watch any match. You can use the watchlist feature which stores your preferences locally on your device."
    }
  ];

  return (
    <Accordion type="single" collapsible className="w-full">
      {faqs.map((faq, index) => (
        <AccordionItem key={index} value={`item-${index}`}>
          <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
          <AccordionContent>{faq.answer}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

export default FAQAccordion;
