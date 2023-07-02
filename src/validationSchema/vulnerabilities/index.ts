import * as yup from 'yup';

export const vulnerabilityValidationSchema = yup.object().shape({
  severity: yup.number().integer().required(),
  description: yup.string().required(),
  application_id: yup.string().nullable(),
  hacker_id: yup.string().nullable(),
});
