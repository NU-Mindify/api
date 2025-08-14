

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
  model: "gemini-2.5-flash",
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
                  "description": { "type": "string"},
                  "color": {"type": "string"}
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
  const prompt = `You are an AI assistant for generating mind maps. A user has provided a topic. Your task is to generate a mind map with a central topic and several sub-topics with description. For each sub-topic, provide 2 or more related ideas depending on how broad the topic is. The mind map should be structured in a way that is logical for visualization. **For each main subtopic, assign a distinct color.** All child nodes of a subtopic must have the **same color** as their parent. Do not assign a color to the central topic.

  User Topic: "${userQuery}"

  Remember to fill in the 'label' for each node and to connect the nodes with edges. The central topic should have an id of '1'. The position of the nodes should be arranged in a clear layout, such as a tree or radial structure. The value of x and y is in pixels and should be unique and far enough to not overlap with other nodes.`;

  const result = await model.generateContent(prompt);

  const response = result.response.text();
  const mindMapData = JSON.parse(response);

  return mindMapData;
}

module.exports = { generateMindmap }