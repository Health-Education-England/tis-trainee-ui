import React, {
  Children,
  cloneElement,
  useState,
  useEffect,
  forwardRef,
  Ref,
  useImperativeHandle
} from "react";
import { Button } from "nhsuk-react-components";
import ScrollTo from "../../forms/ScrollTo";
import styles from "./Stepper.module.scss";
interface IStepper {
  children: React.ReactElement[];
  currentStep?: number;
}
interface RefObject {
  updateActiveStep: (step: number) => void;
}
interface IStep {
  children: React.ReactNode;
  stepIndex?: number;
  title?: string;
  activeStep?: number;
  updateActiveStep?: (step: number) => void;
  stepCount?: number;
  disableNextButton?: boolean;
  disableBackButton?: boolean;
}
export const Stepper = forwardRef(
  ({ children, currentStep = 0 }: IStepper, ref: Ref<RefObject>) => {
    const [activeStep, setActiveStep] = useState(currentStep);
    useEffect(() => {
      setActiveStep(currentStep);
    }, [currentStep]);

    useImperativeHandle(ref, () => ({ updateActiveStep }));
    const updateActiveStep = (step: number) => {
      setActiveStep(activeStep + step);
    };
    return (
      <ol className={styles.stepper}>
        {Children.map(children, (child: React.ReactElement, stepIndex) => {
          return (
            <>
              {cloneElement(child, {
                stepIndex,
                updateActiveStep,
                activeStep,
                stepCount: Children.count(children)
              })}
            </>
          );
        })}
      </ol>
    );
  }
);

export const Step = ({
  children,
  stepIndex = 0,
  title,
  updateActiveStep,
  activeStep = 0,
  stepCount = 0,
  disableNextButton,
  disableBackButton
}: IStep) => {
  return (
    <>
      {stepIndex > 0 && activeStep === stepIndex && (
        <ScrollTo location="element" scrollType="smooth" offset={-30} />
      )}
      <li
        data-cy={`index_${stepIndex}`}
        data-active={stepIndex === activeStep ? "true" : "false"}
        className={`${styles.step} ${
          stepIndex === activeStep ? styles.active : undefined
        }`}
      >
        <h2>{title || `Step ${stepIndex}`}</h2>

        {activeStep === stepIndex && (
          <div className="step-content">
            {children}
            <div className={styles.stepFooter}>
              {stepIndex > 0 && (
                <Button
                  className="btnPrevious"
                  disabled={disableBackButton}
                  secondary
                  onClick={() => {
                    updateActiveStep && updateActiveStep(-1);
                  }}
                >
                  Back
                </Button>
              )}
              {stepIndex < stepCount - 1 && (
                <Button
                  className="btnNext"
                  disabled={disableNextButton}
                  onClick={() => {
                    updateActiveStep && updateActiveStep(1);
                  }}
                >
                  Continue
                </Button>
              )}
            </div>
          </div>
        )}
      </li>
    </>
  );
};
