import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type {
  BMCBlockKey,
  BMCWizardAnswers,
  BusinessModelCanvas,
  StrategySuggestion,
} from '@/types/bmc';

interface BMCState {
  currentCanvas: BusinessModelCanvas | null;
  wizardAnswers: BMCWizardAnswers;
  wizardStep: number;
  isGenerating: boolean;
  editingBlockKey: BMCBlockKey | null;
  savedCanvases: BusinessModelCanvas[];
}

const emptyAnswers: BMCWizardAnswers = {
  customerSegments: '',
  valuePropositions: '',
  channels: '',
  customerRelationships: '',
  revenueStreams: '',
  keyResources: '',
  keyActivities: '',
  keyPartnerships: '',
  costStructure: '',
  businessName: '',
  industry: '',
};

const initialState: BMCState = {
  currentCanvas: null,
  wizardAnswers: emptyAnswers,
  wizardStep: 0,
  isGenerating: false,
  editingBlockKey: null,
  savedCanvases: [],
};

const bmcSlice = createSlice({
  name: 'bmc',
  initialState,
  reducers: {
    setWizardStep(state, action: PayloadAction<number>) {
      state.wizardStep = action.payload;
    },
    setWizardAnswer(state, action: PayloadAction<{ key: keyof BMCWizardAnswers; value: string }>) {
      state.wizardAnswers[action.payload.key] = action.payload.value;
    },
    setWizardAnswers(state, action: PayloadAction<BMCWizardAnswers>) {
      state.wizardAnswers = action.payload;
    },
    setCanvas(state, action: PayloadAction<BusinessModelCanvas>) {
      state.currentCanvas = action.payload;
    },
    updateBlock(state, action: PayloadAction<{ key: BMCBlockKey; content: string }>) {
      if (state.currentCanvas) {
        const block = state.currentCanvas.blocks.find(b => b.key === action.payload.key);
        if (block) {
          block.content = action.payload.content;
        }
      }
    },
    setEditingBlock(state, action: PayloadAction<BMCBlockKey | null>) {
      state.editingBlockKey = action.payload;
    },
    setIsGenerating(state, action: PayloadAction<boolean>) {
      state.isGenerating = action.payload;
    },
    setStrategySuggestions(state, action: PayloadAction<StrategySuggestion[]>) {
      if (state.currentCanvas) {
        state.currentCanvas.strategySuggestions = action.payload;
      }
    },
    setSavedCanvases(state, action: PayloadAction<BusinessModelCanvas[]>) {
      state.savedCanvases = action.payload;
    },
    resetWizard(state) {
      state.wizardAnswers = emptyAnswers;
      state.wizardStep = 0;
      state.isGenerating = false;
    },
    resetCurrentCanvas(state) {
      state.currentCanvas = null;
      state.editingBlockKey = null;
    },
  },
});

export const {
  setWizardStep,
  setWizardAnswer,
  setWizardAnswers,
  setCanvas,
  updateBlock,
  setEditingBlock,
  setIsGenerating,
  setStrategySuggestions,
  setSavedCanvases,
  resetWizard,
  resetCurrentCanvas,
} = bmcSlice.actions;

export default bmcSlice.reducer;
