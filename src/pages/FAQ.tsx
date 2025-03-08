
import MainLayout from "@/components/layout/MainLayout";
import FAQAccordion from "@/components/faq/FAQAccordion";

const FAQ = () => {
  return (
    <MainLayout>
      <div className="space-y-6 max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Frequently Asked Questions</h1>
          <p className="text-muted-foreground">
            Get answers to common questions about our cricket streaming service
          </p>
        </div>
        
        <FAQAccordion />
        
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 mt-8">
          <h2 className="text-xl font-semibold mb-2">Still have questions?</h2>
          <p className="mb-4">
            If you couldn't find the answer to your question in our FAQ, please check back later as we regularly update this section with new information.
          </p>
        </div>
      </div>
    </MainLayout>
  );
};

export default FAQ;
