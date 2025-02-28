"use client";

import Bounded from "@/app/components/Bounded";
import { Content } from "@prismicio/client";
import { PrismicRichText, SliceComponentProps } from "@prismicio/react";
import { Button, Input, Spinner } from "@nextui-org/react";
import { useState } from "react";
import axios from "axios";

export type InputSliceProps = SliceComponentProps<Content.InputSlice>;

const InputSlice = ({ slice }: InputSliceProps): JSX.Element => {
  const [userInput, setUserInput] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchApi = async (getMethod: string) => {
    const text = userInput;
    const baseUrl = "http://127.0.0.1:8000";

    try {
      const response = await axios.get(`${baseUrl}${getMethod}${text}`);

      if (response) {
        return response.data;
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmitButton = async () => {
    setResult("generating result")

    setLoading(true)
    const predictRoute = "/predict/";

    const prediction = await fetchApi(predictRoute);

    let predicted_value=(parseFloat(prediction.Result[0][0])*100).toFixed(2);
    setResult(predicted_value)

    setLoading(false);
  };

  return (
    <Bounded
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      <PrismicRichText
        field={slice.primary.heading}
        components={{
          heading1: ({ children }) => (
            <h2 className="md:text-1xl text-balance text-center text-5xl font-medium">
              {children}
            </h2>
          ),
        }}
      />
      <div className="prose prose-invert mt-4 bg-gradient-to-b from-yellow-100 to-yellow-500 bg-clip-text text-2xl not-italic text-transparent">
        <PrismicRichText field={slice.primary.body} />
      </div>

      <div className="mt-20 flex w-full items-center px-10">
        <Input
          type="text"
          label="Your Text"
          size="sm"
          onValueChange={setUserInput}
        />
        <div className="ml-4">
          <Button
            color="warning"
            variant="ghost"
            size="md"
            onPress={handleSubmitButton}
          >
            Scan
          </Button>
        </div>
      </div>

      {result ? (
        <>
          {loading ? (
            <div className="mt-10">
              <Spinner color="warning" />
            </div>
          ) : (
            <div className="mt-10 flex-col items-center">
              <h5>Human written Probability: {result} % </h5>
            </div>
          )}
        </>
      ) : null}
    </Bounded>
  );
};

export default InputSlice;
