// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
const isEmpty = (str: string) => !str.trim().length;

const getPrompt = (
  topicType: string,
  promptType: string,
  question: string,
  content: string
) => {
  let actor, questionType;
  switch (topicType) {
    case "IELTS Writing":
      questionType = "IELTS Writing Task 2";
      actor = "an IELTS test taker with a band score of 8.0";
      break;
    case "IELTS Speaking":
      questionType = "IELTS Speaking";
      actor = "an IELTS test taker with a band score of 8.0";
      break;
    case "Debate":
      questionType = "debate";
      actor = "a debater";
      break;
    default:
      questionType = "";
      actor = "a person";
      break;
  }

  switch (promptType) {
    // Brainstorming
    case "outline":
      return `Act as ${actor}. Write an essay outline in response to the following ${questionType} question: ${question}`;
    case "support_arguments":
      return `Act as ${actor}. Given the following ${questionType} question, generate 3 arguments to support the statement: ${question}`;
    case "oppose_arguments":
      return `Act as ${actor}. Given the following ${questionType} question, generate 3 arguments to oppose the statement: ${question}`;
    case "sample_answer":
      return `Act as ${actor}. Write an essay in response to the following ${questionType} question with at least 250 words: ${question}`;

    // While writing
    case "introduction":
      return `Act as ${actor}. Write a short introduction paragraph for an essay in response to the following ${questionType} question:: ${question}`;
    case "conclusion":
      return `Act as ${actor}. Write a short conclusion paragraph for this half-done essay:
"${content}"
For your information, the essay is written in response to the following ${questionType} question: ${question}`;
    case "elaborate":
      return `Act as ${actor}. Elaborate/Explain the following argument in 3-4 sentences:
"${content}"
For your information, the essay is written in response to the following ${questionType} question: ${question}`;
    case "example":
      return `Act as ${actor}. Give and explain an example in support of the following argument in 1-2 sentences:
"${content}"
For your information, the essay is written in response to the following ${questionType} question: ${question}`;
    case "finish_sentence":
      return `Act as ${actor}. Finish this sentence for me:
"${content}"
For your information, the essay is written in response to the following ${questionType} question: ${question}`;

    // Edit essay
    case "correct_mistakes":
      return `Point out clearly the mistakes in this essay and how to correct them: ${content}`;
    case "paraphrase":
      return `Paraphrase/Rephrase this sentence/paragraph: 
${content}`;
    case "make_longer":
      return `Make this ${questionType} essay longer by elaborating on the existing points (don't add more arguments):
"${content}"
For your information, the essay is written in response to the following ${questionType} question: ${question}`;
    case "make_simpler":
      return `Rewrite this ${questionType} essay using simpler/more academic language: 
${content}`;
    case "improve":
      return `Improve/Perfect this essay: 
${content}`;

    // Feedback for essay
    case "suggestions":
      return `What are the strengths & weaknesses of this essay? Give your suggestions for improvement for the writer: 
${content}`;

    // Learn vocab
    case "dictionary":
      return `Explain the meaning of ${content} and give me an example of how to use it in real life.`;
    case "synonyms":
      return `Give me 5 synonyms of ${content}`;
    case "antonyms":
      return `Give me 5 antonyms of ${content}`;
    case "other_ways_to_say":
      return `Give me 10 other ways to say ${content}`;

    case "summarize":
      return `Act as a summarizer and summarize this essay: 
${content}`;

    default:
      return "";
  }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const temperature = req.body.temperature || 1;

  const question = req.body.question || "";
  const topicType = req.body.topicType || "";
  const promptType = req.body.promptType || "";
  const content = req.body.content || "";

  if (isEmpty(question) || isEmpty(topicType) || isEmpty(promptType)) {
    res.status(400).json({
      error: {
        message: "Invalid args",
      },
    });
    return;
  }

  const prompt = getPrompt(topicType, promptType, question, content);
  if (isEmpty(prompt)) {
    res.status(400).json({
      error: {
        message: "Invalid prompt",
      },
    });
    return;
  }
  const requestOptions = {
    method: "POST",
    headers: { 'Authorization': "Basic cld6n7eoo0065sr1acbwczykv" },
    body: JSON.stringify({ 'input': prompt }),
  };
  console.log(prompt);
  await axios.post('https://dashboard.scale.com/spellbook/api/app/kw1n3er6',
    {
      input: prompt,
    },
    { headers: { 'Authorization': "Basic " + process.env.OPENAI_API_KEY } },
  )
    .then((response) => {
      // console.log(response.data);
      res.status(200).json({ result: response.data.text });
    }, (error) => {
      console.log(error);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        },
      });
    });

}
