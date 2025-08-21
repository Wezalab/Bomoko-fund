import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, AlertCircle, Save, FileText } from 'lucide-react';
import { useTranslation } from '@/lib/TranslationContext';

interface ValidationRule {
  field: string;
  label: string;
  required: boolean;
  condition?: (formData: any) => boolean;
  validator?: (value: any) => boolean;
  errorMessage?: string;
}

interface InitialSetupValidationProps {
  formData: any;
  onValidationComplete: (isValid: boolean, validatedData: any) => void;
  onSavePlan: () => void;
}

const InitialSetupValidation: React.FC<InitialSetupValidationProps> = ({
  formData,
  onValidationComplete,
  onSavePlan
}) => {
  const { t } = useTranslation();
  const [validationResults, setValidationResults] = useState<Record<string, boolean>>({});
  const [isValidating, setIsValidating] = useState(false);
  const [overallValid, setOverallValid] = useState(false);

  // Définition des règles de validation
  const validationRules: ValidationRule[] = [
    // Q1: Business establishment status
    {
      field: 'established_business',
      label: t('q1_text'),
      required: true,
    },
    
    // Q2: Business established date (if Q1 = Yes)
    {
      field: 'business_established_date',
      label: t('q2_text'),
      required: true,
      condition: (data) => data.established_business === t('yes'),
      validator: (value) => value && value.month && value.year
    },
    
    // Q3: Business planned date (if Q1 = No)
    {
      field: 'business_planned_date',
      label: t('q3_text'),
      required: true,
      condition: (data) => data.established_business === t('no'),
      validator: (value) => value && (value === t('unknown') || (value.month && value.year))
    },
    
    // Q4: Plan type
    {
      field: 'plan_type',
      label: t('q4_text'),
      required: true,
    },
    
    // Q5: Company structure
    {
      field: 'company_structure',
      label: t('q5_text'),
      required: true,
    },
    
    // Q6: Staff
    {
      field: 'staff',
      label: t('q6_text'),
      required: true,
    },
    
    // Q7: Future staff (if Q6 = No)
    {
      field: 'staff_future',
      label: t('q7_text'),
      required: true,
      condition: (data) => data.staff === t('no'),
    },
    
    // Q8: Business location
    {
      field: 'business_location',
      label: t('q8_text'),
      required: true,
      validator: (value) => value && value.trim().length > 0
    },
    
    // Q9: Business scope
    {
      field: 'business_scope',
      label: t('q9_text'),
      required: true,
    },
    
    // Q10: Products
    {
      field: 'products_yn',
      label: t('q10_text'),
      required: true,
    },
    
    // Q11: Product grouping (if Q10 = Yes)
    {
      field: 'product_grouping',
      label: t('q17_text'),
      required: false, // Optional even if products = yes
      condition: (data) => data.products_yn === t('yes'),
    },
    
    // Q12: Services
    {
      field: 'services_yn',
      label: t('q11_text'),
      required: true,
    },
    
    // Q13: Service grouping (if Q12 = Yes)
    {
      field: 'service_grouping',
      label: t('q18_text'),
      required: false, // Optional even if services = yes
      condition: (data) => data.services_yn === t('yes'),
    },
    
    // Q14: Intellectual Property
    {
      field: 'proprietary_IP',
      label: t('q12_text'),
      required: true,
    },
    
    // Q15: Financial projections
    {
      field: 'financial_model_required_yn',
      label: t('q13_text'),
      required: true,
    },
    
    // Q16: Forecast start date (if Q15 = Yes)
    {
      field: 'forecast_start_date',
      label: t('q19_text'),
      required: true,
      condition: (data) => data.financial_model_required_yn === t('yes'),
      validator: (value) => value && value.month && value.year
    },
    
    // Q17: Financial year end (if Q15 = Yes)
    {
      field: 'financial_year_end',
      label: t('q20_text'),
      required: true,
      condition: (data) => data.financial_model_required_yn === t('yes'),
    },
    
    // Q18: Forecast years (if Q15 = Yes)
    {
      field: 'forecast_years',
      label: t('q21_text'),
      required: true,
      condition: (data) => data.financial_model_required_yn === t('yes'),
    },
    
    // Q19: Inventory management (if Q15 = Yes)
    {
      field: 'inventory_management',
      label: t('q22_text'),
      required: true,
      condition: (data) => data.financial_model_required_yn === t('yes'),
    },
    
    // Q20: Finance required
    {
      field: 'finance_required',
      label: t('q14_text'),
      required: true,
    },
    
    // Q21: Exit planned
    {
      field: 'exit_planned',
      label: t('q15_text'),
      required: true,
    },
    
    // Q22: Tone
    {
      field: 'tone',
      label: t('q16_text'),
      required: true,
    },
  ];

  // Fonction de validation
  const validateForm = () => {
    setIsValidating(true);
    const results: Record<string, boolean> = {};
    let allValid = true;

    validationRules.forEach(rule => {
      const shouldValidate = !rule.condition || rule.condition(formData);
      
      if (shouldValidate) {
        const value = formData[rule.field];
        let isValid = true;

        if (rule.required) {
          // Check if field exists and is not empty
          isValid = value !== undefined && value !== null && value !== '';
          
          // Custom validator if provided
          if (isValid && rule.validator) {
            isValid = rule.validator(value);
          }
        }

        results[rule.field] = isValid;
        if (!isValid) {
          allValid = false;
        }
      } else {
        // Field not required due to condition
        results[rule.field] = true;
      }
    });

    setValidationResults(results);
    setOverallValid(allValid);
    setIsValidating(false);

    // Notify parent component
    onValidationComplete(allValid, formData);

    return allValid;
  };

  // Validate on mount and when formData changes
  useEffect(() => {
    validateForm();
  }, [formData]);

  // Get validation status for a field
  const getFieldStatus = (fieldName: string) => {
    if (validationResults[fieldName] === undefined) return 'pending';
    return validationResults[fieldName] ? 'valid' : 'invalid';
  };

  // Count completed fields
  const getCompletionStats = () => {
    const applicableRules = validationRules.filter(rule => 
      !rule.condition || rule.condition(formData)
    );
    const completedCount = applicableRules.filter(rule => 
      validationResults[rule.field] === true
    ).length;
    
    return {
      completed: completedCount,
      total: applicableRules.length,
      percentage: Math.round((completedCount / applicableRules.length) * 100)
    };
  };

  const stats = getCompletionStats();

  return (
    <div className="bg-white rounded-lg border shadow-sm">
      {/* Header */}
      <div className="p-6 border-b">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {t('validationInitialSetup') || 'Validation Configuration Initiale'}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {t('completeAllRequiredFields') || 'Complétez tous les champs requis avant de sauvegarder votre plan'}
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600">
              {stats.percentage}%
            </div>
            <div className="text-sm text-gray-500">
              {stats.completed}/{stats.total} {t('completed') || 'complété'}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-blue-600 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${stats.percentage}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </div>

      {/* Validation Results */}
      <div className="p-6">
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {validationRules.map(rule => {
            const shouldShow = !rule.condition || rule.condition(formData);
            if (!shouldShow) return null;

            const status = getFieldStatus(rule.field);
            const isValid = status === 'valid';
            const isPending = status === 'pending';

            return (
              <motion.div
                key={rule.field}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex items-center justify-between p-3 rounded-lg border ${
                  isValid 
                    ? 'bg-green-50 border-green-200' 
                    : isPending 
                    ? 'bg-gray-50 border-gray-200'
                    : 'bg-red-50 border-red-200'
                }`}
              >
                <div className="flex items-center space-x-3">
                  {isValid ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <AlertCircle className={`w-5 h-5 ${isPending ? 'text-gray-400' : 'text-red-600'}`} />
                  )}
                  <div>
                    <div className="font-medium text-gray-900">
                      {rule.label}
                    </div>
                    {!isValid && !isPending && (
                      <div className="text-sm text-red-600">
                        {rule.errorMessage || (t('fieldRequired') || 'Ce champ est requis')}
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  {rule.required ? (t('required') || 'Requis') : (t('optional') || 'Optionnel')}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Actions */}
      <div className="p-6 border-t bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            {overallValid ? (
              <span className="flex items-center text-green-600">
                <CheckCircle className="w-4 h-4 mr-2" />
                {t('allFieldsComplete') || 'Tous les champs requis sont complétés'}
              </span>
            ) : (
              <span className="flex items-center text-amber-600">
                <AlertCircle className="w-4 h-4 mr-2" />
                {t('completeRequiredFields') || 'Veuillez compléter les champs requis'}
              </span>
            )}
          </div>

          <div className="flex space-x-3">
            <button
              onClick={validateForm}
              disabled={isValidating}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {isValidating ? (t('validating') || 'Validation...') : (t('revalidate') || 'Revalider')}
            </button>

            <button
              onClick={onSavePlan}
              disabled={!overallValid || isValidating}
              className={`px-6 py-2 text-sm font-medium rounded-lg transition-colors flex items-center ${
                overallValid && !isValidating
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {overallValid ? (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {t('savePlan') || 'Sauvegarder le Plan'}
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4 mr-2" />
                  {t('completeToContinue') || 'Compléter pour continuer'}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InitialSetupValidation;
