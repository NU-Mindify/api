

async function generateMindmap(req, res) {
  try {
    const { prompt } = req.body;
    if ( !prompt ) {
      res.status(400).json({ error: "Missing body" })
      return;
    }
    
    const mindMap = await generateJSON(prompt);
    console.log(mindMap);
    
    res.json(mindMap)
  } catch (error) {
    res.status(500).json({ error })
    console.error(error);
    
  }
}

const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GOOGLE);
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash-8b", // or gemini-1.5-flash, as they support structured output
  generationConfig: {
    responseMimeType: "application/json",
    responseSchema: {
      "type": "object",
      "properties": {
        "nodes": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "id": { "type": "string" },
              "data": {
                "type": "object",
                "properties": {
                  "label": { "type": "string" },
                  "description": { "type": "string"}
                },
                "required": ["label"]
              },
              "position": {
                "type": "object",
                "properties": {
                  "x": { "type": "number" },
                  "y": { "type": "number" }
                },
                "required": ["x", "y"]
              }
            },
            "required": ["id", "data", "position"]
          }
        },
        "edges": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "id": { "type": "string" },
              "source": { "type": "string" },
              "target": { "type": "string" }
            },
            "required": ["id", "source", "target"]
          }
        }
      },
      "required": ["nodes", "edges"]
    },
  },
});

async function generateJSON(userQuery) {
  const prompt = `You are an AI assistant for generating mind maps. A user has provided a topic. Your task is to generate a mind map with a central topic and several sub-topics with short description. For each sub-topic, provide 2-3 related ideas. The mind map should be structured in a way that is logical for visualization.

  User Topic: "${userQuery}"

  Remember to fill in the 'label' for each node and to connect the nodes with edges. The central topic should have an id of '1'. The position of the nodes should be arranged in a clear layout, such as a radial structure. The value of x and y is in pixels. There should not be a node with same position.`;

  const result = await model.generateContent(prompt);

  // The API response will already be a valid JSON object thanks to the schema.
  // You can parse it directly.
  const response = result.response.text();
  const mindMapData = JSON.parse(response);

  return mindMapData;
}

module.exports = { generateMindmap }