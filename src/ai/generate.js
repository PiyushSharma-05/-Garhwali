import OpenAI from "openai";

const client = new OpenAI({

apiKey:
process.env.REACT_APP_GROQ_API_KEY,

baseURL:
"https://api.groq.com/openai/v1",

dangerouslyAllowBrowser:true

});

export async function generateAnswer(
question,
rows
){

const examples =
rows
.map(
r=>

`English:
${r["English Sentence"]}

Garhwali:
${r["Garhwali Translation"]}`

)

.join("\n\n");

const prompt = `

You are Mi Garhwali.

Translate English to natural Garhwali.

Rules:
- Return ONLY translation
- No explanation
- No examples
- Use examples as reference

Examples:

${examples}

Input:
${question}

Output:

`;

const result =
await client.chat.completions.create({

model:
"llama-3.1-8b-instant",

temperature:
0.1,

messages:[
{
role:"user",
content:prompt
}
]

});

return result
.choices[0]
.message
.content
.trim();

}