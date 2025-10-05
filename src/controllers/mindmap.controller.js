

async function generateMindmap(req, res) {
  try {
    const { prompt:userPrompt, force, user_id } = req.body
    const prompt = userPrompt.toLowerCase().trim();
    // const prompt = req.body.prompt.toLowerCase().trim();
    // const force = req.body.force;

    const existingMap = await MindmapModel.findOne({prompt}).sort({updatedAt: -1});

    console.log(existingMap, !force);
    
    if(existingMap && !force){
      res.json(existingMap.content);
      return;
    }

    if ( !prompt ) {
      res.status(400).json({ error: "Missing body" })
      return;
    }
    
    const mindMap = await generateJSON(prompt);
    const newMindmap = await new MindmapModel({prompt, content:mindMap, user_id}).save()
    
    res.json(newMindmap)
  } catch (error) {
    res.status(500).json({ error })
    console.error(error);
    
  }
}


const { GoogleGenerativeAI } = require("@google/generative-ai");
const MindmapModel = require("../models/Mindmap");
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
              "target": { "type": "string" },
              "sourceHandle": {
                "type": "string",
                "enum": ["top", "bottom", "left", "right"]
              },
              "targetHandle": {
                "type": "string",
                "enum": ["top", "bottom", "left", "right"]
              }
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
  const prompt = `You are an AI assistant for generating mind maps. A user has provided a psychology topic. Your task is to generate a mind map with a central topic and several sub-topics with description. For each sub-topic, provide 2 or more related ideas. The mind map should be structured in a way that is logical for visualization. For each main subtopic, assign a distinct color. All child nodes of a subtopic must have the same color as their parent. Do not assign a color to the central topic.

  User Topic: "${userQuery}"

  Remember to fill in the 'label' for each node and to connect the nodes with edges. The central topic should have an id of '1'. The position of the nodes should be arranged in a clear radial structure. The value of x and y is in pixels and should be unique and does not overlap with other nodes. Specify the position of source and target handle depending on the position relevant to its parent. Strictly do not answer topic not related to psychology instead just put one node that has label and description of "Not psychology related topic."`;

  const result = await model.generateContent(prompt);

  const response = result.response.text();
  const mindMapData = JSON.parse(response);

  return mindMapData;
}

module.exports = { generateMindmap }