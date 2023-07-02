import * as yup from 'yup';

export const applicationValidationSchema = yup.object().shape({
  name: yup.string().required(),
  type: yup.string().required(),
  scope: yup.string().required(),
  organization_id: yup.string().nullable(),
});
