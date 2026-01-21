import { ArrowLeft } from 'lucide-react';
import { Button } from '../components/Button'; // Assuming Button component path

interface PolicyDetailProps {
  title: string;
  content: React.ReactNode;
  onBack: () => void; // Function to go back
}

export function PolicyDetail({ title, content, onBack }: PolicyDetailProps) {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Optional: Add a simple header specific to detail pages or rely on main header */}
      <section className="bg-gradient-to-r from-gray-100 to-gray-200 py-12 border-b">
         <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Button onClick={onBack} variant="ghost" size="sm" className="mb-4 text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Priorities
            </Button>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800">{title}</h1>
         </div>
      </section>

      {/* Main Content Area */} 
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none text-gray-700">
             {/* Render the content passed as props */}
             {content}
          </div>
        </div>
      </section>
    </div>
  );
}