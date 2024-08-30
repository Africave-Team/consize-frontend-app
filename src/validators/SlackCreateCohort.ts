import * as Yup from "yup"

export const SlackEnrollCohortValidator = Yup.object().shape({
  agree: Yup.boolean().required(),
  schedule: Yup.boolean().required(),
  date: Yup.string().when("schedule", {
    is: true,
    then: schema => schema.required("Select a schedule date"),
    otherwise: schema => schema.optional().nullable()
  }),
  time: Yup.string().when("schedule", {
    is: true,
    then: schema => schema.required("Select a schedule time"),
    otherwise: schema => schema.optional().nullable()
  }),
})
export const SlackCreateCohortValidator = Yup.object().shape({
  name: Yup.string().when("agree", {
    is: true,
    then: schema => schema.required("Set a name for this cohort"),
    otherwise: schema => schema.optional().nullable()
  }),
})