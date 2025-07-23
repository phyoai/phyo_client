"use client";
import { useForm, FormProvider } from "react-hook-form";
import { useState } from "react";
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import TextInput from "../../../components/Inputs/TextInput";
import Select from "../../../components/Inputs/Select";
import FileInput from "../../../components/Inputs/FileInput";
import RadioInput from "../../../components/Inputs/RadioInput";
import Distribution from "../../../components/Inputs/Distribution";
import CollaborationCharges from "../../../components/Inputs/CollaborationCharges";
import AudienceLocation from "../../../components/Inputs/AudienceLocation";

const FormContainer = ({ steps }) => {
  const methods = useForm({ 
    mode: "onBlur",
    resolver: (values) => {
      const errors = {};
      
      // Check if passwords match on the first step
      if (values.password && values.confirmPassword && values.password !== values.confirmPassword) {
        errors.confirmPassword = {
          type: "manual",
          message: "Passwords do not match"
        };
      }
      
      return {
        values,
        errors
      };
    }
  });
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signup, isAuthenticated } = useAuth();

  const onSubmit = async (data) => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      // Final submission - handle brand signup
      setLoading(true);
      setError('');

      try {
        // Prepare signup data to match the API endpoint
        const signupData = {
          email: data.email,
          password: data.password,
          type: 'BRAND',
          name: data.brandName || data.name || 'Brand User',
          username: data.brandName?.toLowerCase().replace(/\s+/g, '') || 'branduser',
          industry: data.industry || 'general',
          companyName: data.brandName || data.companyName || 'Brand Company',
          website: data.website || '',
          // Add any additional fields from the form
          ...data
        };

        const result = await signup(signupData);
        
        if (result.success && isAuthenticated()) {
          // Redirect to the original requested URL or default dashboard
          const redirect = searchParams.get('redirect') || '/brand/dashboard';
          router.push(redirect);
        } else if (!isAuthenticated()) {
          setError('You must be authenticated to access the dashboard.');
        } else {
          if ((result.error || '').toLowerCase().includes('already exist')) {
            setError(
              <span>
                User with this email already exists.{' '}
                <a href="/login" className="text-blue-600 underline">Login here</a>.
              </span>
            );
          } else {
            setError(result.error || 'Signup failed');
          }
        }
      } catch (error) {
        setError('An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    }
  };

  const step = steps[currentStep];

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="mx-auto px-[50px] flex flex-col justify-center h-full">
        <h2 className="text-xl font-semibold mb-2">{step.title}</h2>
        <p className="mb-4">{step.description}</p>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {step.fields.map((field) => {
          if (field.type === "text") {
            return <TextInput key={field.name} {...field} />;
          } else if (field.type === "select") {
            return <Select key={field.name} {...field} />;
          } else if (field.type === "file") {
            return <FileInput key={field.name} {...field} />;
          } else if (field.type === "radio") {
            return <RadioInput key={field.name} {...field} />;
          } else if (field.type === "distribution") {
            return <Distribution key={field.name} {...field} />
          } else if (field.type === "collaborationCharges") {
            return <CollaborationCharges key={field.name} {...field} />;
          } else if (field.type === "audienceLocation") {
            return <AudienceLocation key={field.name} {...field} />;
          } else {
            return <TextInput key={field.name} {...field} />;
          }
        })}

        <div className="flex justify-between gap-2 mt-6">
          {currentStep > 0 && (
            <button
              type="button"
              onClick={() => setCurrentStep((prev) => prev - 1)}
              disabled={loading}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            >
              Back
            </button>
          )}
          <button 
            type="submit" 
            disabled={loading}
            className="flex-grow px-4 py-2 bg-[#00674F] text-white rounded disabled:opacity-50"
          >
            {loading ? 'Processing...' : step.submit}
          </button>
        </div>
      </form>
    </FormProvider>
  );
};

export default FormContainer;
