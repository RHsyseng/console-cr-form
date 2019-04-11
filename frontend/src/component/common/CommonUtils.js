export function getJsonSchemaPathForJsonPath(jsonPath) {
  jsonPath = jsonPath.slice(2, jsonPath.length);
  jsonPath = jsonPath.replace(".", ".properties.");
  jsonPath = "$.." + jsonPath;

  //console.log("jsonSchema Path: " + jsonPath);
  return jsonPath;
}
