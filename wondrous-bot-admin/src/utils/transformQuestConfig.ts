import { TYPES } from './constants';

type InputQuestStep = {
  type: string;
  order: number;
  prompt: string;
  options: Array<{
    position: number;
    text: string;
    correct: boolean;
    __typename: string;
  }> | null;
  __typename: string;
};

type OutputQuestStep = {
  id: number;
  type: string;
  value:
    | string
    | {
        question: string;
        withCorrectAnswers: boolean;
        multiSelectValue: string;
        answers: Array<{
          value: string;
          isCorrect?: boolean;
        }>;
      };
};

export function transformQuestConfig(obj: InputQuestStep[]): OutputQuestStep[] {
  return obj.map((step) => {
    const outputStep: OutputQuestStep = {
      id: step.order,
      type: step.type,
      value: '',
    };

    if (
      step.type === TYPES.TEXT_FIELD ||
      step.type === TYPES.NUMBER ||
      step.type === TYPES.ATTACHMENTS
    ) {
      outputStep.value = step.prompt;
    } else if ([TYPES.SINGLE_QUIZ, TYPES.MULTI_QUIZ].includes(step.type)) {
      const hasCorrectAnswer = step.options!.some(
        (option) => option.correct !== null && option.correct !== undefined
      );
      outputStep.value = {
        question: step.prompt,
        withCorrectAnswers: hasCorrectAnswer,
        multiSelectValue: step.type,
        answers: step.options!.map((option) => ({
          value: option.text,
          ...(hasCorrectAnswer ? { isCorrect: option.correct } : {}),
        })),
      };
    }

    return outputStep;
  });
}

