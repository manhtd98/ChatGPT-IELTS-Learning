// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  try {
    const requestOptions = {
      method: 'POST',
      headers: { "Authorization":"Basic cld6n7eoo0065sr1acbwczykv"},
      body: JSON.stringify({ input: 'React POST Request Example' })
  };
    const result = await fetch(`https://dashboard.scale.com/spellbook/api/app/kw1n3er6`, requestOptions);
    console.log(result);
    res.status(200).json({ result: result.text });
  } catch (error: any) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        },
      });
    }
  }
}
