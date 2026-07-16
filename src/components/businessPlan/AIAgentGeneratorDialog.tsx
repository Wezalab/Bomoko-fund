import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { generateMultiAgentBusinessPlan } from '@/lib/geminiAgents';
import { Bot, FileText, CheckCircle2, Loader2, Target, Briefcase, Goal } from 'lucide-react';
import toast from 'react-hot-toast';

interface AIAgentGeneratorDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onPlanGenerated: (plan: any) => void;
}

const AIAgentGeneratorDialog: React.FC<AIAgentGeneratorDialogProps> = ({ isOpen, onClose, onPlanGenerated }) => {
  const [step, setStep] = useState<'input' | 'generating' | 'success'>('input');
  const [formData, setFormData] = useState({
    businessDescription: '',
    targetMarket: '',
    goals: '',
  });
  const [progressMsg, setProgressMsg] = useState('');
  const [generatedPlan, setGeneratedPlan] = useState<any>(null);

  const handleGenerate = async () => {
    if (!formData.businessDescription || !formData.targetMarket || !formData.goals) {
      toast.error('Please fill in all fields to give the agents enough context.');
      return;
    }

    setStep('generating');
    setProgressMsg('Initializing multi-agent system...');

    try {
      const plan = await generateMultiAgentBusinessPlan(
        {
          businessDescription: formData.businessDescription,
          targetMarket: formData.targetMarket,
          goals: formData.goals,
        },
        (msg) => setProgressMsg(msg)
      );

      setGeneratedPlan(plan);
      setStep('success');
      toast.success('Business plan generated successfully!');
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || 'Failed to generate business plan. Check your API key.');
      setStep('input');
    }
  };

  const handleFinish = () => {
    onPlanGenerated(generatedPlan);
    onClose();
    // Reset state for next time
    setTimeout(() => {
      setStep('input');
      setFormData({ businessDescription: '', targetMarket: '', goals: '' });
      setGeneratedPlan(null);
    }, 300);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && step !== 'generating' && onClose()}>
      <DialogContent className="sm:max-w-[600px] bg-white">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 text-2xl text-darkBlue">
            <Bot className="w-6 h-6 text-teal-600" />
            <span>Multi-Agent Business Plan Generator</span>
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            {step === 'input' && "Provide some context and our 4 AI agents (Marketing, Financial, Operations, CEO) will work together to craft a comprehensive business plan."}
            {step === 'generating' && "The agents are currently brainstorming and drafting your business plan..."}
            {step === 'success' && "Your comprehensive business plan is ready!"}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {step === 'input' && (
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center space-x-2">
                  <Briefcase className="w-4 h-4 text-gray-500" />
                  <span>Business Description</span>
                </label>
                <textarea
                  className="w-full min-h-[100px] p-3 rounded-xl border-2 border-gray-200 focus:border-teal-500 focus:ring-0 resize-none"
                  placeholder="e.g. A sustainable coffee shop sourcing beans directly from local African farmers..."
                  value={formData.businessDescription}
                  onChange={(e) => setFormData({ ...formData, businessDescription: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center space-x-2">
                  <Target className="w-4 h-4 text-gray-500" />
                  <span>Target Market</span>
                </label>
                <Input
                  className="h-12 rounded-xl border-2 border-gray-200 focus-visible:border-teal-500 focus-visible:ring-0"
                  placeholder="e.g. Young professionals and students in urban areas"
                  value={formData.targetMarket}
                  onChange={(e) => setFormData({ ...formData, targetMarket: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center space-x-2">
                  <Goal className="w-4 h-4 text-gray-500" />
                  <span>Primary Business Goals (1-3 years)</span>
                </label>
                <Input
                  className="h-12 rounded-xl border-2 border-gray-200 focus-visible:border-teal-500 focus-visible:ring-0"
                  placeholder="e.g. Reach $50k MRR in year 1, expand to 3 locations by year 3"
                  value={formData.goals}
                  onChange={(e) => setFormData({ ...formData, goals: e.target.value })}
                />
              </div>
            </div>
          )}

          {step === 'generating' && (
            <div className="flex flex-col items-center justify-center py-10 space-y-6">
              <div className="relative">
                <div className="absolute inset-0 bg-teal-200 rounded-full blur-xl animate-pulse"></div>
                <Bot className="w-20 h-20 text-teal-600 relative z-10 animate-bounce" />
              </div>
              <div className="flex items-center space-x-3 text-lg font-medium text-gray-700">
                <Loader2 className="w-5 h-5 animate-spin text-teal-600" />
                <span>{progressMsg}</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2 mt-4 max-w-xs overflow-hidden">
                <div className="bg-teal-600 h-2 rounded-full w-full origin-left animate-[pulse_2s_ease-in-out_infinite] opacity-80"></div>
              </div>
            </div>
          )}

          {step === 'success' && (
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
              <CheckCircle2 className="w-20 h-20 text-green-500" />
              <h3 className="text-xl font-bold text-gray-800">Plan Generated!</h3>
              <p className="text-gray-500 text-center text-sm px-6">
                Our multi-agent system successfully drafted your Marketing, Operations, and Financial strategies, along with a comprehensive Executive Summary.
              </p>
            </div>
          )}
        </div>

        <DialogFooter className="sm:justify-end">
          {step === 'input' && (
            <>
              <Button variant="outline" onClick={onClose} className="rounded-xl font-semibold">
                Cancel
              </Button>
              <Button onClick={handleGenerate} className="bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-semibold flex items-center space-x-2">
                <Bot className="w-4 h-4" />
                <span>Generate Plan</span>
              </Button>
            </>
          )}
          {step === 'success' && (
            <Button onClick={handleFinish} className="bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-semibold flex items-center space-x-2 w-full sm:w-auto">
              <FileText className="w-4 h-4" />
              <span>View Generated Plan</span>
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AIAgentGeneratorDialog;
