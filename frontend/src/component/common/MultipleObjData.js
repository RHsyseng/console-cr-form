export const RHPAM_Env = {
  fields: [
    {
      label: "Name",
      default: "rhpam-trial",
      required: true,
      jsonPath: "$.spec.objects.console.env.name",
      type: "text"
    },
    {
      label: "Value",
      default: "env2 default",
      required: true,
      jsonPath: "$.spec.objects.console.env.value",
      type: "text"
    }
  ]
};
