const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

async function getDecisionAnalysis(decision, options, values) {
  const prompt = `
Ti presento un problema decisionale:
- Decisione da prendere: ${decision}
- Opzioni possibili: ${options.join(", ")}
- Valori personali rilevanti: ${values}

Fornisci un'analisi ragionata su quale opzione è più in linea con i valori espressi, con pro e contro sintetici per ciascuna opzione. Sii empatico, diretto e concreto.`;

  try {
    const response = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 600,
    });
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("Errore GPT:", error);
    throw error;
  }
}

module.exports = { getDecisionAnalysis };
