"use client";
import { useForm, FormProvider } from "react-hook-form";
import { useState } from "react";
import TextInput from "../../../components/Inputs/TextInput";
import Select from "@/components/Inputs/Select";
import FileInput from "@/components/Inputs/FileInput";
import RadioInput from "@/components/Inputs/RadioInput";
import Distribution from "@/components/Inputs/Distribution";
import CollaborationCharges from "@/components/Inputs/CollaborationCharges";
import AudienceLocation from "@/components/Inputs/AudienceLocation";

const FormContainer = ({ steps }) => {
  const methods = useForm({ mode: "onBlur" });
  const [currentStep, setCurrentStep] = useState(0);

  const onSubmit = (data) => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      console.log("Final submission:", data);
    }
  };

  const step = steps[currentStep];

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="mx-auto px-[50px] flex flex-col justify-center h-full ">
        <h2 className="text-xl font-semibold mb-2">{step.title}</h2>
        <p className="mb-4">{step.description}</p>

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
              className="px-4 py-2 bg-gray-200 rounded"
            >
              Back
            </button>
          )}
          <button type="submit" className="flex-grow px-4 py-2 bg-[#00674F] text-white rounded">
            {step.submit}
          </button>
        </div>
      </form>
    </FormProvider>
  );
};

export default FormContainer;
