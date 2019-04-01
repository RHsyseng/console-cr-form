export const EnvRender_JSON = {
  fields: [
    {
      label: "Name",
      default: "rhpam-trial",
      required: true,
      jsonPath: "$.metadata.name",
      type: "text"
    },
    {
      label: "Value",
      default: "env2 default",
      required: true,
      jsonPath: "$..spec.properties.environment.enum",
      type: "text"
    }
  ]
};
